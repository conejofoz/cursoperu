<?php
//Incluimos inicialmente la conexion a la base de datos
require "../config/Conexion.php";

Class Usuario{
    //Implementamos nuestro constructor
    public function __construct() {
        
    }
    
    //Implementamos um medoto para insertar registros
    public function insertar($nombre, $tipo_documento,$num_documento,$direccion,$telefono,$email,$login,$clave,$imagen){
        $sql = "INSERT INTO usuario (nombre, tipo_documento,num_documento,direccion,telefono,email,login,clave,imagen, condicion) "
                . "VALUES ('$nombre', '$tipo_documento','$num_documento','$direccion','$telefono','$email','$login','$clave','$imagen', '1')";
        return ejecutarConsulta($sql);
    }
    
    
    //Implementamos um metodo para editar registros
    public function editar($idusuario, $nombre, $tipo_documento,$num_documento,$direccion,$telefono,$email,$login,$clave,$imagen){
        $sql="UPDATE usuario SET nombre='$nombre', "
                . "tipo_documento='$tipo_documento',"
                . "num_documento='$num_documento, "
                . "direccion='$direccion', "
                . "telefono='$telefono', "
                . "email='$email', "
                . "login='$login', "
                . "clave='$clave', "
                . "imagen='$imagen' "
                . "WHERE idusuario='$idusuario'";
        return ejecutarConsulta($sql);
    }
    
    //Implementamos um metodo para desactivar categorias
    public function desativar($idusuario){
        $sql="UPDATE usuario SET condicion='0' WHERE idusuario='$idusuario'";
        return ejecutarConsulta($sql);
    }
    //Implementamos um metodo para desactivar categorias
    public function ativar($idusuario){
        $sql="UPDATE usuario SET condicion='1' WHERE idusuario='$idusuario'";
        return ejecutarConsulta($sql);
    }
    
    
    
    //Implementar un metodo para mostrar los datos de un registro a modificar
    public function mostrar($idusuario){
        $sql="SELECT * FROM usuario WHERE idusuario='$idusuario'";
        return ejecutarConsultaSimpleFila($sql);
    }
    //Implementar un metodo para listar los registros
    public function listar(){
        $sql="SELECT * FROM usuario";
        return ejecutarConsulta($sql);
    }
    
}
