<?php include('template.php');

class index extends template
{
	function __construct(){
		parent::__construct('template.json');
	}
}

$nick=new index();
$nick->page_header(); ?>
<script language="javascript">
	var icarusApp=angular.module('app',[]);
</script>
<div class="rehs_header">Login</div>
<div style="width:100%;text-align:center"><button type="button" class="btn btn-default btn-sm" onClick="window.location='cas_login.php'">Log In with NetID/Password</button></div>
<?php $nick->page_footer(); ?>