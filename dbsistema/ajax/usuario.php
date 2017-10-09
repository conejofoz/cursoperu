<?php

require_once '../modelos/Usuario.php';

$usuario = new Usuario();

$idusuario = isset($_POST["idusuario"]) ? limpiarCadena($_POST["idusuario"]) : "";
$nombre = isset($_POST["nombre"]) ? limpiarCadena($_POST["nombre"]) : "";
$tipo_documento = isset($_POST[""]) ? limpiarCadena($_POST[""]) : "";
$num_documento = isset($_POST["num_documento"]) ? limpiarCadena($_POST["num_documento"]) : "";
$direccion = isset($_POST["direccion"]) ? limpiarCadena($_POST["direccion"]) : "";
$telefono = isset($_POST["telefono"]) ? limpiarCadena($_POST["telefono"]) : "";
$email = isset($_POST["email"]) ? limpiarCadena($_POST["email"]) : "";
$cargo = isset($_POST["cargo"]) ? limpiarCadena($_POST["cargo"]) : "";
$login = isset($_POST["login"]) ? limpiarCadena($_POST["login"]) : "";
$clave = isset($_POST["clave"]) ? limpiarCadena($_POST["clave"]) : "";
$imagen = isset($_POST["imagen"]) ? limpiarCadena($_POST["imagen"]) : "";

switch ($_GET["op"]) {
    case 'guardaryeditar':
        
        if(!file_exists($_FILES['imagen']['tmp_name']) || !is_uploaded_file($_FILES['imagen']['tmp_name'])){
            $imagen=$_POST["imagenactual"];
        } else {
            $ext = explode(".", $_FILES['imagen']['name']);
            if ($_FILES['imagen']['type'] == "image/jpg" || $_FILES['imagen']['type'] == "image/jpeg" || $_FILES['imagen']['type'] == "image/png"){
                $imagen = round(microtime(true)) . '.' . end($ext);
                move_uploaded_file($_FILES['imagen']['tmp_name'], '../files/usuarios/' . $imagen);
            }
        }
        
        //Hash SHA256 en la contrasenha
        $clavehash= hash("SHA256", $clave);
        
        if(empty($idusuario)){
            $rspta=$usuario->insertar($nombre, $tipo_documento,$num_documento,$direccion,$telefono,$email,$login,$clavehash,$imagen, $_POST['permiso']);
            echo $rspta ? "Usuario registrado" : "Usuario no se pudo registrar";
        } else {
            $rspta=$usuario->editar($idusuario, $nombre, $tipo_documento,$num_documento,$direccion,$telefono,$email,$login,$clavehash,$imagen, $_POST['permiso']);
            echo $rspta ? "Usuario actualizado" : "Usuario no se pudo actualizar";
        }

        break;
    case 'desactivar':
        $rspta=$articulo->desativar($idusuario);
        echo $rspta ? "Articulo Desactivado" : "Articulo no se puede desactivar";

        break;
    case 'activar':
        $rspta=$usuario->ativar($idusuario);
        echo $rspta ? "Articulo Activado" : "Articulo no se puede activar";

        break;
    case 'mostrar':
        $rspta=$usuario->mostrar($idusuario);
        //Codificar o resultado utilizando json
        echo json_encode($rspta);

        break;
    case 'listar':
        $rspta=$usuario->listar();
        //Vamos declarar un array
        $data = Array();
        
        while($reg=$rspta->fetch_object()){
            $data[] = array(
                "0"=>($reg->condicion)?'<button class="btn btn-warning" onclick="mostrar('.$reg->idusuario.')"><i class="fa fa-pencil"></i></button>'.
                ' <button class="btn btn-danger" onclick="desactivar('.$reg->idusuario.')"><i class="fa fa-close"></i></button>':
                '<button class="btn btn-warning" onclick="mostrar('.$reg->idusuario.')"><i class="fa fa-pencil"></i></button>'.
                ' <button class="btn btn-primary" onclick="activar('.$reg->idusuario.')"><i class="fa fa-check"></i></button>',
                "1"=>$reg->nombre,
                "2"=>$reg->tipo_documento,
                "3"=>$reg->num_documento,
                "4"=>$reg->telefono,
                "5"=>$reg->email,
                "6"=>$reg->login,
                "7"=>"<img src='../files/usuarios/".$reg->imagen." ' height='50px' width='50px' >",
                "8"=>($reg->condicion)?'<span class="label bg-green">Activado</span>':
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
        
        
    case 'permisos':
        //obtenemos todos los permisos de la tabla permisos
        require_once '../modelos/Permiso.php';
        $permiso = new Permiso();
        $rspta = $permiso->listar();
        
        
        
        //obetner los permisos asignados al usuario
        $id=$_GET['id'];
        $marcados = $usuario->listamarcados($id);
        $valores=array();
        //almacenar los permisos asignados al usuario en el array
        while ($per = $marcados->fetch_object()){
            array_push($valores, $per->idpermiso);
        }
        
        //mostramos la lista de permisos en la vista y si estan o no marcados
        while ($reg = $rspta->fetch_object()){
            $sw= in_array($reg->idpermiso, $valores)?'checked':'';
            echo '<li> <input type="checkbox" '.$sw.' name="permiso[]" value"'.$reg->idpermiso.'">'.$reg->nombre.' </li>';
        }
        
        break;
        
        
    
}