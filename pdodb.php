<?php
class pdoDB
{
	var $dbh;
	var $table;
	var $fields=Array();
	var $error='';
	var $mode;
	var $affectedRows;
	var $sql='';
	var $errorCode='';

	function pdoDB($dbname='')
	{
		try
		{
			$this->dbh = new PDO("mysql:host=localhost;dbname=".$dbname,'www','48fgh38g64');
			$this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		}
		catch(PDOException $e){$this->error=$e->getMessage();}
	}

	function add($table)
	{
		$this->table=$table;
		$this->mode=1;
	}

	function edit($table)
	{
		$this->table=$table;
		$this->mode=2;
	}

	function multi_add($table)
	{
		$this->table=$table;
		$this->mode=3;
	}

	function query($qry,$limit=0)
	{
		try
		{
			if($limit==1)
			{
				$qry.=' LIMIT 1';
				$stmt=$this->dbh->query($qry);
				$retval=$stmt->fetch(PDO::FETCH_ASSOC);
				return($retval);
			}
			else
			{
				$stmt=$this->dbh->query($qry);
				return($stmt);
			}
		}
		catch(PDOException $e)
		{
			$this->error=$e->getMessage();
			$this->errorCode=$e->getCode();
			return(false);
		}
	}

	function pq($qry,$bv,$limit=0)
	{
		$rs=$this->prepared_query(Array('qry'=>$qry,'bind_vars'=>$bv),$limit);
		return($rs);
	}

	function prepared_query($pqry=Array(),$limit=0)
	{
		try
		{
			if($limit==1)
			{
				$pqry['qry'].=' LIMIT 1';
				$stmt=$this->dbh->prepare($pqry['qry']);
				$stmt->execute($pqry['bind_vars']);
				$this->affectedRows=$stmt->rowCount();
				$ra=$stmt->fetch(PDO::FETCH_ASSOC);
				return($ra);
			}
			else
			{
				$stmt=$this->dbh->prepare($pqry['qry']);
				$stmt->execute($pqry['bind_vars']);
				$this->affectedRows=$stmt->rowCount();
				return($stmt);
			}
		}
		catch(PDOException $e)
		{
			$this->error=$e->getMessage();
			$this->errorCode=$e->getCode();
		}
	}

	function update_multi_add()
	{
		$bind_vars=Array();
		$qry='INSERT INTO '.$this->table;
		$flds='';
		$qm='';
		for($a=0;$a<count($this->fields);$a++)
		{
			$b=0;
			foreach($this->fields[$a] as $key=>$val)
			{
				if($a==0)
				{
					$flds.=$key.',';
					$qm.=':'.$key.',';
				}
				$bind_vars[$a][':'.$key]=$val;
				$b++;
			}
		}
		$qry.='('.substr($flds,0,-1).') VALUES('.substr($qm,0,-1).')';
		try
		{
			$stmt=$this->dbh->prepare($qry);
			for($i=0;$i<$a;$i++)
			{
				$stmt->execute($bind_vars[$i]);
			}
		}
		catch(PDOException $e)
		{
			$this->error=$e->getMessage();
			$this->errorCode=$e->getCode();
			$this->sql=$qry;
		}
	}

	function update($whereQry='')
	{
		if($this->mode==3)
		{
			$this->update_multi_add();
		}
		else
		{
			if($this->mode==1)
			{
				$qry='INSERT INTO '.$this->table.' (';
				$qm='';
				foreach($this->fields as $key=>$val)
				{
					$qry.=$key.',';
					$qm.='?,';
				}
				$qry=substr($qry,0,-1).') VALUES ('.substr($qm,0,-1).') ';
			}
			if($this->mode==2)
			{
				$qry='UPDATE '.$this->table.' SET ';
				foreach($this->fields as $key=>$val)
				{
					$qry.=$key.'= ?, ';
				}
				if(is_array($whereQry))
				{
					$qry=substr($qry,0,-2).' WHERE ';
					foreach($whereQry as $key=>$val)
					{
						$qry.=$key.'=? AND ';
					}
					$qry=substr($qry,0,-5);
				}
				else{$qry=substr($qry,0,-2).' WHERE '.$whereQry;}
			}
			try
			{
				$i=1;
				$bv=Array();
				$stmt=$this->dbh->prepare($qry);
				foreach($this->fields as $key=>&$val)
				{
					$bv[]=$val;
				}
				if(is_array($whereQry))
				{
					foreach($whereQry as $key=>$val)
					{
						$bv[]=$val;
					}
				}
				$stmt->execute($bv);
				$this->affectedRows=$stmt->rowCount();
			}
			catch(PDOException $e)
			{
				$this->error=$e->getMessage();
				$this->sql=$qry;
				$this->errorCode=$e->getCode();
			}
		}
		unset($this->fields);
	}

	function lastInsertId()
	{
		return $this->dbh->lastInsertId();
	}
}

//$this->dbh->lastInsertId();
//$stmt->rowCount()
