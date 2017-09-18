<?php

require_once '../modelos/Articulo.php';

$articulo = new Articulo();

$idarticulo = isset($_POST["idarticulo"]) ? limpiarCadena($_POST["idarticulo"]) : "";
$idcategoria = isset($_POST["idcategoria"]) ? limpiarCadena($_POST["idcategoria"]) : "";
$codigo = isset($_POST["codigo"]) ? limpiarCadena($_POST["codigo"]) : "";
$nombre = isset($_POST["nombre"]) ? limpiarCadena($_POST["nombre"]) : "";
$stock = isset($_POST["stock"]) ? limpiarCadena($_POST["stock"]) : "";
$descripcion = isset($_POST["descripcion"]) ? limpiarCadena($_POST["descripcion"]) : "";
$imagem = isset($_POST["imagem"]) ? limpiarCadena($_POST["imagem"]) : "";

switch ($_GET["op"]) {
    case 'guardaryeditar':
        
        if(!file_exists($_FILES['imagem']['tmp_name']) || !is_uploaded_file($_FILES['imagem']['tmp_name'])){
            $imagem="";
        } else {
            $ext = explode(".", $_FILES['imagem']['name']);
            if ($_FILES['imagem']['type'] == "image/jpg" || $_FILES['imagem']['type'] == "image/jpeg" || $_FILES['imagem']['type'] == "image/png"){
                $imagem = round(microtime(true)) . '.' . end($ext);
                move_uploaded_file($_FILES['imagem']['tmp_name'], '../files/articulos/' . $imagem);
            }
        }
        
        if(empty($idarticulo)){
            $rspta=$articulo->insertar($idcategoria, $codigo, $nombre, $stock, $descripcion, $imagem);
            echo $rspta ? "Articulo registrado" : "Articulo no se pudo registrar";
        } else {
            $rspta=$articulo->editar($idarticulo, $idcategoria, $codigo, $nombre, $stock, $descripcion, $imagem);
            echo $rspta ? "Articulo actualizado" : "Articulo no se pudo actualizar";
        }

        break;
    case 'desactivar':
        $rspta=$articulo->desativar($idarticulo);
        echo $rspta ? "Articulo Desactivado" : "Articulo no se puede desactivar";

        break;
    case 'activar':
        $rspta=$articulo->ativar($idarticulo);
        echo $rspta ? "Articulo Activado" : "Articulo no se puede activar";

        break;
    case 'mostrar':
        $rspta=$articulo->mostrar($idarticulo);
        //Codificar o resultado utilizando json
        echo json_encode($rspta);

        break;
    case 'listar':
        $rspta=$articulo->listar();
        //Vamos declarar un array
        $data = Array();
        
        while($reg=$rspta->fetch_object()){
            $data[] = array(
                "0"=>($reg->condicion)?'<button class="btn btn-warning" onclick="mostrar('.$reg->idarticulo.')"><i class="fa fa-pencil"></i></button>'.
                ' <button class="btn btn-danger" onclick="desactivar('.$reg->idarticulo.')"><i class="fa fa-close"></i></button>':
                '<button class="btn btn-warning" onclick="mostrar('.$reg->idarticulo.')"><i class="fa fa-pencil"></i></button>'.
                ' <button class="btn btn-primary" onclick="activar('.$reg->idarticulo.')"><i class="fa fa-check"></i></button>',
                "1"=>$reg->nombre,
                "2"=>$reg->categoria,
                "3"=>$reg->codigo,
                "4"=>$reg->stock,
                "5"=>"<img src='../files/articulos/".$reg->imagem." ' height='50px' width='50px' >",
                "6"=>($reg->condicion)?'<span class="label bg-green">Activado</span>':
                '<span class="label bg-red">Desactivado</span>'
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