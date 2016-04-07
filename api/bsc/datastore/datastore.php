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
			$pstmt=$this->db->prepare('SELECT people.* FROM sessions INNER JOIN people ON people.pkey=sessions.person WHERE jwt=?');
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

	public function loginMyREHSUSer($myrehs_ticket){
		$pstmt=$this->db->prepare('SELECT ep.pkey, ep.netid, ep.email FROM elcid.sessions AS es LEFT JOIN elcid.people_program_rights AS eppr ON eppr.person = es.`user` INNER JOIN elcid.people AS ep ON ep.pkey=es.`user` WHERE myrehs_ticket=? AND eppr.program = 66 LIMIT 1');
		$pstmt2=$this->db->prepare('INSERT INTO sessions (person,api_key,create_ts,jwt) VALUES (?,?,?,?)');
		try{
			$pstmt->execute([$myrehs_ticket]);
			if($pstmt->rowCount()<0){throw new DatastoreException('ERROR, MyREHS session informatin not found',0);}
			$myrehs_user=$pstmt->fetch(PDO::FETCH_ASSOC);
			$bytes = openssl_random_pseudo_bytes(16);
			$api_key=bin2hex($bytes);
			$qry='SELECT * FROM people WHERE ';
			if(!empty($myrehs_user['netid'])){$qry.='netid="'.$myrehs_user['netid'].'"';}
			else{$qry.='elcid="'.$myrehs_user['elcid'].'"';}
			$stmt=$this->db->query($qry.' LIMIT 1');
			if($stmt->rowCount()<0){throw new DatastoreException('ERROR, You are not authorized to use this database',0);}
			$person=$stmt->fetch(PDO::FETCH_ASSOC);
			$ts=date('Y-m-d H:i:s');
			$expire=date('Y-m-d H:i:s',mktime(date('H')+24,date('i'),date('s'),date('m'),date('d'),date('Y')));

			$signer = new Sha256();
			$token = (new Builder())->setIssuer('https://halflife.rutgers.edu')
				->setIssuedAt(time())
				->setExpiration(time() + 86400)
				->set('user', $person['pkey'])
				->set('user_type',$person['user_type'])
				->sign($signer,$this->hashKey)
				->getToken();
			$pstmt2->execute([$person['pkey'],$api_key,$ts,$token]);
			return $token;
		}
		catch(\Exception $e){
			throw new DatastoreException('Unable to process request',0);
			$this->__logError($e->getMessage(),__FUNCTION__);
		}
	}
}