<?
$netID  = $_SERVER['cn'];
$path="data/";
$fileName = $netID.".json"; 

if($_SERVER['REQUEST_METHOD'] === 'POST'){
	if (!file_exists($path)){
		mkdir($path, 0777, true);
	}
    file_put_contents($path.$fileName,file_get_contents("php://input"));
}
else{
    $content = file_get_contents($path.$fileName);
	if($content == FALSE){
		print("0");
	}
	else{
		print($content);
	}
}
?>
