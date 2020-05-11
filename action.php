<?php

$jsonName = "data/".$_GET['selectedFileUrl'];
$jsonContent = file_get_contents($jsonName);
if ($jsonContent === false) {echo "json is not correct";}
$json = json_decode($jsonContent,true);
if ($json === null) { echo "json is not correct";}

echo $jsonContent;
/*foreach ($json as $key => $val) {
    echo "$key\n";
}*/

/*readData($json,true);


function readData($json,$send){
	$jsonIterator = new RecursiveIteratorIterator(
    new RecursiveArrayIterator($json),
    RecursiveIteratorIterator::SELF_FIRST);

	foreach ($jsonIterator as $key => $val) {
		echo "$key:\n"
    	if(is_array($val)) {
        	echo "$key:\n";
   		} else {
        	echo "$key => $val\n";
	        //if($key == "name"){
	        //	if($send == true){
    		//		echo "$val,";
	        //	}
	        }
    	}
	}	
}*/

?>