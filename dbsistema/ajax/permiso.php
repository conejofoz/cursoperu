<?php
require_once '../modelos/Permiso.php';
$permiso = new Permiso();

switch ($_GET["op"]) {
    case 'listar':
        $rspta=$permiso->listar();
        //Vamos declarar un array
        $data = Array();
        while($reg=$rspta->fetch_object()){
            $data[] = array(
                "0"=>$reg->nombre
            );
        }
        $results = array(
            "sEcho"=>1, //Informacion para el datatables
            "iTotalRecords"=>count($data), //enviamos el total registros ao datatable
            "iTotalDisplayRecords"=>count($data), //enviamos el total de registros a visualizar
            "aaData"=>$data
        );
        echo json_encode($results);
        break;
}