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
			$user=$token->getClaim('user');
			$expire=$token->getClaim('exp');
			if($expire>(time()+86400)){throw new DatastoreException('Token has expired',3);}
			$pstmt=$this->db->prepare('SELECT * FROM users WHERE pkey=?');
			$pstmt->execute([$user]);
			if($pstmt->rowCount()>0){
				$rs=$pstmt->fetch(\PDO::FETCH_ASSOC);
				$this->authenticatedUser=$rs;
			}
			else{throw new DatastoreException('User is not authenticated',3);}
		}
		catch(\Exception $e){throw new DatastoreException('ERROR, unable to authenication user',2);}
	}

	protected function __getYahooStockName($stock){
		$url='http://finance.yahoo.com/d/quotes.csv?s='.$stock.'&f=n';
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
		curl_setopt($ch, CURLOPT_TIMEOUT, 5);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		$data = curl_exec($ch);
		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		if(($httpcode>=200 && $httpcode<300)&&substr($data,0,3)!='N/A'){
			return(substr($data,1,-2));
		}
		else{return(FALSE);}
	}

	protected function __getYahooStock($stock){
		##The URL for querying the Yahoo! Finance API
		##Yahoo Query Language (YQL) is used in the GET request for this URL.
		$url='http://ichart.finance.yahoo.com/table.csv?s='.$stock.'&a=04&b=14&c=2015&d='.date('m').'&e='.date('d').'&f='.date('Y');
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0');
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
		curl_setopt($ch, CURLOPT_TIMEOUT, 5);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		$data = curl_exec($ch);
		$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		if($httpcode>=200 && $httpcode<300){
			$pstmt=$this->db->prepare('DELETE FROM historical WHERE `symbol`=?');
			$pstmt->execute([$stock]);
			$pstmt2=$this->db->prepare('INSERT INTO historical (symbol,datee,close_price) VALUES (?,?,?)');
			$pstmt3=$this->db->prepare('SELECT stock_name FROM stock WHERE stock=? LIMIT 1');
			$pstmt3->execute([$stock]);
			$title=$pstmt3->fetch(\PDO::FETCH_ASSOC);
			$lines=explode("\n",$data);
			$m=count($lines);
			$retval=['title'=>$title['stock_name'],'data'=>[]];
			for($i=1;$i<$m-1;$i++){
				$cell=explode(',',$lines[$i]);
				$retval['data'][]=[strtoupper($stock),$cell[0],$cell[4]];
				$pstmt2->execute([$stock,$cell[0],$cell[4]]);
			}
			return($retval);
		}
		else{return(FALSE);}
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
				$pstmt=$this->db->prepare('INSERT INTO login_history (user) VALUES (?)');
				$ts=date('Y-m-d H:i:s');
				$expire=date('Y-m-d H:i:s',mktime(date('H')+24,date('i'),date('s'),date('m'),date('d'),date('Y')));
				$signer = new Sha256();
				$token = (new Builder())->setIssuer('http://rugatech.com')
					->setIssuedAt(time())
					->setExpiration(time() + 86400)
					->set('user', $user['pkey'])
					->sign($signer,$this->hashKey)
					->getToken();
				$pstmt->execute([$user['pkey']]);
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
			$new_pkey=$this->db->lastInsertId();
			return('{"pkey":'.$new_pkey.'}');
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
			$retval=[];
			if($this->authenticatedUser['pkey']!=$user){throw new DatastoreException('You cannot view this record',3);}
			$pstmt=$this->db->prepare('SELECT stock,stock_name FROM stock WHERE `user`=?');
			$pstmt->execute([$user]);
			while($rs=$pstmt->fetch(\PDO::FETCH_ASSOC)){
				$retval[]=['stock'=>$rs['stock'],'stock_name'=>$rs['stock_name']];
			}
			return($retval);
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
		}
	}

	public function deleteStock($user,$stock){
		if(!is_numeric($user)){throw new DatastoreException('Invalid User pkey supplied',5);}
		try{
			$this->__authenticateUser();
			if($this->authenticatedUser['pkey']!=$user){throw new DatastoreException('You cannot delete this record',3);}
			$pstmt=$this->db->prepare('DELETE FROM stock WHERE `user`=? AND stock=?');
			$pstmt->execute([$user,$stock]);
			return(["results"=>1]);
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
		}
	}

	public function addStock($user,$stock){
		if(!is_numeric($user)){throw new DatastoreException('Invalid User pkey supplied',5);}
		try{
			$this->__authenticateUser();
			if($this->authenticatedUser['pkey']!=$user){throw new DatastoreException('You cannot add this record',3);}
			$stockName=$this->__getYahooStockName($stock);
			if(!$stockName){
				throw new DatastoreException('Invalid stock symbol',2);
			}
			else{
				$stockName=trim($stockName);
				$pstmt=$this->db->prepare('INSERT INTO stock(`user`,stock,stock_name) VALUES (?,?,?)');
				$pstmt->execute([$user,$stock,$stockName]);
				return(['symbol'=>$stock,'stock_name'=>$stockName]);
			}
		}
		catch(\PDOException $e){
			throw new DatastoreException('Database Error',2);
		}
	}

	public function downloadStock($stock){
		try{
			$this->__authenticateUser();
			$retval=$this->__getYahooStock($stock);
			if(!$retval){
				throw new DatastoreException('Invalid stock symbol',2);
			}
			else{
				return($retval);
			}
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