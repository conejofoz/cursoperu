<?php
//Incluimos inicialmente la conexion a la base de datos
require "../config/Conexion.php";

Class Persona{
    //Implementamos nuestro constructor
    public function __construct() {
        
    }
    
    //Implementamos um medoto para insertar registros
    public function insertar($tipo_persona, $nombre, $tipo_documento, $num_documento, $direccion, $telefono, $email){
        $sql = "INSERT INTO persona (tipo_persona, nombre, tipo_documento, num_documento, direccion, telefono, email) "
                . "VALUES ('$tipo_persona','$nombre', '$tipo_documento', '$num_documento', '$direccion', '$telefono', '$email')";
        return ejecutarConsulta($sql);
    }
    
    
    //Implementamos um metodo para editar registros
    public function editar($idpersona, $tipo_persona, $nombre, $tipo_documento, $num_documento, $direccion, $telefono, $email){
        $sql="UPDATE persona SET "
                . "tipo_persona='$tipo_persona', "
                . "nombre='$nombre', "
                . "tipo_documento='$tipo_documento', "
                . "num_documento='$num_documento', "
                . "direccion='$direccion', "
                . "telefono='$telefono', "
                . "email='$email' "
                . "WHERE idpersona='$idpersona'";
        return ejecutarConsulta($sql);
    }
    
    //Implementamos um metodo para desactivar categorias
    public function eliminar($idpersona){
        $sql="DELETE FROM persona WHERE idpersona='$idpersona'";
        return ejecutarConsulta($sql);
    }
        
    
    //Implementar un metodo para mostrar los datos de un registro a modificar
    public function mostrar($idpersona){
        $sql="SELECT * FROM persona WHERE idpersona='$idpersona'";
        return ejecutarConsultaSimpleFila($sql);
    }
    //Implementar un metodo para listar los registros
    public function listarp(){
        $sql="SELECT * FROM persona WHERE tipo_persona='Proveedor'";
        return ejecutarConsulta($sql);
    }
    public function listarc(){
        $sql="SELECT * FROM persona WHERE tipo_persona='Cliente'";
        return ejecutarConsulta($sql);
    }
    
    
    
    
}
