<?php include('template.php');

class app extends template
{
	function __construct(){
		parent::__construct('template.json');
		$this->add_js_file('js/services.js');
		$this->add_js_file('js/controllers.js');
	}
}

$nick=new app();
$nick->page_header(); ?>
<div ui-view></div>
<?php $nick->page_footer(); ?>