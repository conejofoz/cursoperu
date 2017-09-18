<?php
//Incluimos inicialmente la conexion a la base de datos
require "../config/Conexion.php";

Class Articulo{
    //Implementamos nuestro constructor
    public function __construct() {
        
    }
    
    //Implementamos um medoto para insertar registros
    public function insertar($idcategoria, $codigo, $nombre, $stock, $descripcion, $imagem){
        $sql = "INSERT INTO articulo (idcategoria, $codigo, nombre, stock, descripcion,condicion, imagem) "
                . "VALUES ('$idcategoria', '$codigo', '$nombre', '$stock', '$descripcion', '$imagem', '1')";
        return ejecutarConsulta($sql);
    }
    
    
    //Implementamos um metodo para editar registros
    public function editar($idarticulo, $idcategoria, $codigo, $nombre, $stock, $descripcion, $imagem){
        $sql="UPDATE articulo SET idcategoria='$idcategoria', codigo='$codigo', nombre='$nombre', stock='$stock', descripcion='$descripcion', imagem='$imagem' WHERE idarticulo='$idarticulo'";
        return ejecutarConsulta($sql);
    }
    
    //Implementamos um metodo para desactivar articulos
    public function desativar($idarticulo){
        $sql="UPDATE articulo SET condicion='0' WHERE idarticulo='$idarticulo'";
        return ejecutarConsulta($sql);
    }
    //Implementamos um metodo para desactivar articulos
    public function ativar($idarticulo){
        $sql="UPDATE articulo SET condicion='1' WHERE idarticulo='$idarticulo'";
        return ejecutarConsulta($sql);
    }
    
    
    
    //Implementar un metodo para mostrar los datos de un registro a modificar
    public function mostrar($idarticulo){
        $sql="SELECT * FROM articulo WHERE idcategoria='$idarticulo'";
        return ejecutarConsultaSimpleFila($sql);
    }
    //Implementar un metodo para listar los registros
    public function listar(){
        $sql="SELECT a.idarticulo, a.idcategoria, c.nombre as categoria, a.codigo,a.nombre, a.stock, a.descripcion, a.imagem, a.condicion FROM articulo a INNER JOIN categoria c on a.idcategoria=c.idcategoria";
        return ejecutarConsulta($sql);
    }
    
    
    
    
}