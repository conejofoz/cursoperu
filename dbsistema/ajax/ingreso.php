<?php
if(strlen(session_id())< 1){
    session_start();
}

require_once '../modelos/Ingreso.php';

$ingreso = new Ingreso();

$idingreso = isset($_POST["idingreso"]) ? limpiarCadena($_POST["idingreso"]) : "";
$idprovedor = isset($_POST["idprovedor"]) ? limpiarCadena($_POST["idprovedor"]) : "";
$idusuario = isset($_POST["idusuario"]) ? limpiarCadena($_POST["idusuario"]) : "";
$tipo_comprovante = isset($_POST["tipo_comprovante"]) ? limpiarCadena($_POST["tipo_comprovante"]) : "";
$serie_comprovante = isset($_POST["serie_comprovante"]) ? limpiarCadena($_POST["serie_comprovante"]) : "";
$num_comprovante = isset($_POST["num_comprovante"]) ? limpiarCadena($_POST["num_comprovante"]) : "";
$fecha_hora = isset($_POST["fecha_hora"]) ? limpiarCadena($_POST["fecha_hora"]) : "";
$impuesto = isset($_POST["impuesto"]) ? limpiarCadena($_POST["impuesto"]) : "";
$total_compra = isset($_POST["total_compra"]) ? limpiarCadena($_POST["total_compra"]) : "";

switch ($_GET["op"]) {
    case 'guardaryeditar':
        if(empty($idingreso)){
            $rspta=$ingreso->insertar($idprovedor, $idusuario, $tipo_comprovante, $serie_comprovante, $num_comprovante, $fecha_hora, $impuesto, $total_compra, $_POST['idarticulo'],$_POST['cantidad'],$_POST['precio_compra'],$_POST['precio_venta']);
            echo $rspta ? "Ingreso registrad" : "Ingreso no se pudo registrar";
        } else {
            
        }

        break;
    case 'anular':
        $rspta=$ingreso->anular($idingreso);
        echo $rspta ? "Ingreso anulado" : "Ingreso no se puede anular";

        break;
    case 'mostrar':
        $rspta=$ingreso->mostrar($idingreso);
        //Codificar o resultado utilizando json
        echo json_encode($rspta);

        break;
    case 'listar':
        $rspta=$ingreso->listar();
        //Vamos declarar un array
        $data = Array();
        
        while($reg=$rspta->fetch_object()){
            $data[] = array(
                "0"=>($reg->estado=='Aceptado')?'<button class="btn btn-warning" onclick="mostrar('.$reg->$idingreso.')"><i class="fa fa-pencil"></i></button>'.
                ' <button class="btn btn-danger" onclick="anular('.$reg->$idingreso.')"><i class="fa fa-close"></i></button>':
                '<button class="btn btn-warning" onclick="mostrar('.$reg->$idingreso.')"><i class="fa fa-pencil"></i></button>',
                "1"=>$reg->fecha,
                "2"=>$reg->proveedor,
                "3"=>$reg->usuario,
                "4"=>$reg->tipo_comprovante,
                "5"=>$reg->serie_comprovante .'-'.$reg->num_comprovante,
                "6"=>$reg->total_compra,
                "7"=>($reg->estado=='Aceptado')?'<span class="label bg-green">Aceptado</span>':
                '<span class="label bg-red">Anulado</span>'
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