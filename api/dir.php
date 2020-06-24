<?php 
$out = array();
foreach (glob($_GET['folderUrl'].'*') as $filename) {
    $p = pathinfo($filename);
    $out[] = $p['basename'];
}

echo json_encode($out); 
?>