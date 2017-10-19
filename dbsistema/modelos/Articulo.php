<?php
//Incluimos inicialmente la conexion a la base de datos
require "../config/Conexion.php";

Class Articulo{
    //Implementamos nuestro constructor
    public function __construct() {
        
    }
    
    //Implementamos um medoto para insertar registros
    public function insertar($idcategoria, $codigo, $nombre, $stock, $descripcion, $imagen){
        $sql = "INSERT INTO articulo (idcategoria, codigo, nombre, stock, descripcion, condicion, imagen) "
                . "VALUES ('$idcategoria', '$codigo', '$nombre', '$stock', '$descripcion', '1','$imagen')";
        return ejecutarConsulta($sql);
    }
    
    
    //Implementamos um metodo para editar registros
    public function editar($idarticulo, $idcategoria, $codigo, $nombre, $stock, $descripcion, $imagen){
        $sql="UPDATE articulo SET idcategoria='$idcategoria', codigo='$codigo', nombre='$nombre', stock='$stock', descripcion='$descripcion', imagen='$imagen' WHERE idarticulo='$idarticulo'";
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
        $sql="SELECT * FROM articulo WHERE idarticulo='$idarticulo'";
        return ejecutarConsultaSimpleFila($sql);
    }
    //Implementar un metodo para listar los registros
    public function listar(){
        $sql="SELECT "
                . "a.idarticulo, "
                . "a.idcategoria, "
                . "c.nombre as categoria, "
                . "a.codigo, "
                . "a.nombre, "
                . "a.stock, "
                . "a.descripcion, "
                . "a.imagen, "
                . "a.condicion "
                . "FROM articulo a "
                . "INNER JOIN categoria c on a.idcategoria=c.idcategoria";
        return ejecutarConsulta($sql);
    }



    //Implementar un metodo para listar los registros activos
    public function listarActivos(){
        $sql="SELECT "
                . "a.idarticulo, "
                . "a.idcategoria, "
                . "c.nombre as categoria, "
                . "a.codigo, "
                . "a.nombre, "
                . "a.stock, "
                . "a.descripcion, "
                . "a.imagen, "
                . "a.condicion "
                . "FROM articulo a "
                . "INNER JOIN categoria c on a.idcategoria=c.idcategoria "
                . "WHERE a.condicion='1'";
        return ejecutarConsulta($sql);
    }
    


    //implementar un metodo para listar los registros activos, su ultimo precio y el stock (vamos a unir con el ultimo registro de la tabla detalle_ingresso
    public function listarActivosVenta(){
        $sql="SELECT "
                . "a.idarticulo, "
                . "a.idcategoria, "
                . "c.nombre as categoria, "
                . "a.codigo, "
                . "a.nombre, "
                . "a.stock, "
                . "(SELECT precio_venta FROM detalle_ingreso WHERE idarticulo=a.idarticulo order by iddetalle_ingreso desc limit 0,1) as precio_venta, "
                . "a.descripcion, "
                . "a.imagen, "
                . "a.condicion "
                . "FROM articulo a "
                . "INNER JOIN categoria c on a.idcategoria=c.idcategoria "
                . "WHERE a.condicion='1'";
        return ejecutarConsulta($sql);
    }
}
