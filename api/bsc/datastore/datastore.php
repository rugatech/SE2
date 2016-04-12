<?php
namespace bsc\datastore;

use bsc\datastore\DatastoreException;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Parser;

class datastore{
	public $db;
	public $authenticatedUser=[];
    public $hashKey='anvheryfjkfde';
    public $jwt;

	public function __construct($jwt){
		try{
			$this->db=new PDOdriver();
			$jwt_split=explode(' ',$jwt);
			$this->jwt=$jwt_split[1];
		}
		catch(\PDOException $e){
			throw new DatastoreException('Unable to connect to database',2);
		}
	}

	private function __logError($error,$func){
		$pstmt=$this->db->prepare('INSERT INTO datastore_errors (error,func) VALUES (?,?)');
		$pstmt->execute([$error,$func]);
	}

	protected function __authenticateUser(){
		try{
			$signer=new Sha256();
			$token = (new Parser())->parse((string)$this->jwt);
			$signer=new Sha256();
			if(!$token->verify($signer, $this->hashKey)){throw new DatastoreException('Unable to verify JWT token',3);}
			$person=$token->getClaim('user');
			$expire=$token->getClaim('exp');
			if($expire>(time()+86400)){throw new DatastoreException('Token has expired',3);}
			$pstmt=$this->db->prepare('SELECT users.* FROM session INNER JOIN users ON users.pkey=session.user WHERE sessid=?');
			$pstmt->execute([$this->jwt]);
			if($pstmt->rowCount()>0){
				$rs=$pstmt->fetch(\PDO::FETCH_ASSOC);
				$this->authenticatedUser=$rs;
			}
			else{throw new DatastoreException('User is not authenticated',3);}
		}
		catch(\Exception $e){throw new DatastoreException('ERROR, unable to authenication user',2);}
	}

	public function _sanitize($data){
		foreach($data as $key=>$val){
			$data[$key]=filter_var($val,FILTER_SANITIZE_STRING);
		}
		return $data;
	}

	public function login($data){
		if(empty($data['email'])){throw new DatastoreException('Invalid E-Mail Address',1);}
		if(empty($data['password'])){throw new DatastoreException('Invalid Password',1);}
		$pstmt=$this->db->prepare('SELECT * FROM users WHERE email=? LIMIT 1');
		try{
			$pstmt->execute([$data['email']]);
			if($pstmt->rowCount()<1){throw new DatastoreException('User Not Found',1);}
			$user=$pstmt->fetch(\PDO::FETCH_ASSOC);
			if(!password_verify($data['password'],$user['password'])){
				throw new DatastoreException('Incorrect Password',3);
			}
			else{
				unset($pstmt);
				$pstmt=$this->db->prepare('INSERT INTO session (user,sessid) VALUES (?,?)');
				$ts=date('Y-m-d H:i:s');
				$expire=date('Y-m-d H:i:s',mktime(date('H')+24,date('i'),date('s'),date('m'),date('d'),date('Y')));
				$signer = new Sha256();
				$token = (new Builder())->setIssuer('http://rugatech.com')
					->setIssuedAt(time())
					->setExpiration(time() + 86400)
					->set('user', $user['pkey'])
					->sign($signer,$this->hashKey)
					->getToken();
				$pstmt->execute([$user['pkey'],$token]);
				return $token;
			}
		}
		catch(\PDOException $e){
			throw new DatastoreException('Unable to authenicate user',2);
		}
	}

	public function addUser($data){
		if(empty($data['fname'])){throw new DatastoreException('Invalid First Name',1);}
		if(empty($data['lname'])){throw new DatastoreException('Invalid Last Name',1);}
		if(empty($data['email'])){throw new DatastoreException('Invalid E-Mail Address',1);}
		if(empty($data['password'])){throw new DatastoreException('Invalid Password',1);}
		if (filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false){throw new DatastoreException('Invalid E-Mail Address',1);}
		$data=$this->_sanitize($data);
		$pstmt=$this->db->prepare('INSERT INTO users (fname,lname,email,password) VALUES (?,?,?,?)');
		try{
			$salt = substr(strtr(base64_encode(mcrypt_create_iv(22, MCRYPT_DEV_URANDOM)), '+', '.'), 0, 22);
			$options = [
			    'cost' => 11,
			    'salt' => $salt,
			];
			$passwd=password_hash($data['password'], PASSWORD_BCRYPT, $options);
			$pstmt->execute([$data['fname'],$data['lname'],$data['email'],$passwd]);
		}
		catch(\PDOException $e){
			throw new DatastoreException('Unable to add user',2);
		}
	}

	public function editUser($data,$pkey){
		if(empty($data['fname'])){throw new DatastoreException('Invalid First Name',1);}
		if(empty($data['lname'])){throw new DatastoreException('Invalid Last Name',1);}
		if(empty($data['email'])){throw new DatastoreException('Invalid E-Mail Address',1);}
		if (filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false){throw new DatastoreException('Invalid E-Mail Address',1);}
		$this->__authenticateUser();
		if($this->authenticatedUser['pkey']!=$pkey){throw new DatastoreException('You cannot edit this user',3);}
		$data=$this->_sanitize($data);
		$pstmt=$this->db->prepare('UPDATE users SET fname=?,lname=?,email=? WHERE pkey=?');
		try{
			$pstmt->execute([$data['fname'],$data['lname'],$data['email'],$pkey]);
		}
		catch(\PDOException $e){
			throw new DatastoreException('Unable to update user',2);
		}
	}

	public function getUser($pkey){
		if(!is_numeric($pkey)){throw new DatastoreException('Invalid ID supplied',5);}
		try{
			$this->__authenticateUser();
			$pstmt=$this->db->prepare('SELECT pkey,fname,lname,email FROM users WHERE pkey=?');
			$pstmt->execute([$pkey]);
			if($pstmt->rowCount()>0){
				$rs=$pstmt->fetch(\PDO::FETCH_ASSOC);
				return(json_encode($rs,JSON_NUMERIC_CHECK));
			}
			else{throw new DatastoreException('Person not found',1);}
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
		}
	}

	public function getUserStock($user){
		if(!is_numeric($user)){throw new DatastoreException('Invalid ID supplied',5);}
		try{
			$this->__authenticateUser();
			if($this->authenticatedUser['pkey']!=$user){throw new DatastoreException('You cannot view this record',3);}
			$pstmt=$this->db->prepare('SELECT stock FROM stock WHERE `user`=?');
			$pstmt->execute([$user]);
			if($pstmt->rowCount()>0){
				while($rs=$pstmt->fetch(\PDO::FETCH_ASSOC)){
					$retval[]=['stock'=>$rs['stock']];
				}
				return($retval);
			}
			else{throw new DatastoreException('User not found',1);}
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
		}
	}

	public function logout(){
		try{
			$this->__authenticateUser();
			$pstmt=$this->db->prepare('DELETE FROM session WHERE sessid=?');
			$pstmt->execute([$this->jwt]);
			return ('{"logout":1}');
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
		}
	}

}