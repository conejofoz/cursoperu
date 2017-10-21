<?php
//Incluimos inicialmente la conexion a la base de datos
require "../config/Conexion.php";

Class Consultas{
    //Implementamos nuestro constructor
    public function __construct() {
        
    }
    
    
    //Implementar un metodo para listar los registros
    public function comprasfecha($fecha_inicio, $fecha_fin){
        $sql="SELECT DATE(i.fecha_hora) as fecha, "
                . "u.nombre as usuario, "
                . "p.nombre as proveedor, "
                . "i.tipo_comprovante, i.serie_comprovante, i.num_comprovante, i.total_compra, i.impuesto, i.estado "
                . "FROM ingreso i "
                . "INNER JOIN persona p ON i.idproveedor=p.idpersona "
                . "INNER JOIN usuario u ON i.idusuario=u.idusuario "
                . "WHERE DATE(i.fecha_hora) >= '$fecha_inicio' AND DATE(i.fecha_hora)<='$fecha_fin'";
        return ejecutarConsulta($sql);
    }
    
    public function ventasfechacliente($fecha_inicio, $fecha_fin, $idcliente){
        $sql="SELECT DATE(v.fecha_hora) as fecha, "
                . "u.nombre as usuario, "
                . "p.nombre as cliente, "
                . "v.tipo_comprovante, v.serie_comprovante, v.num_comprovante, v.total_venta, v.impuesto, v.estado "
                . "FROM venta v "
                . "INNER JOIN persona p ON v.idcliente=p.idpersona "
                . "INNER JOIN usuario u ON v.idusuario=u.idusuario "
                . "WHERE DATE(v.fecha_hora) >= '$fecha_inicio' AND DATE(v.fecha_hora)<='$fecha_fin' AND v.idcliente='$idcliente'";
        return ejecutarConsulta($sql);
    }
    

    
   /* public function ventasfechacliente($fecha_inicio,$fecha_fin,$idcliente)
	{
		$sql="SELECT DATE(v.fecha_hora) as fecha, "
                        . "u.nombre as usuario, "
                        . "p.nombre as cliente, "
                        . "v.tipo_comprovante,v.serie_comprovante,v.num_comprovante,v.total_venta,v.impuesto,v.estado "
                        . "FROM venta v "
                        . "INNER JOIN persona p ON v.idcliente=p.idpersona "
                        . "INNER JOIN usuario u ON v.idusuario=u.idusuario "
                        . "WHERE DATE(v.fecha_hora)>='$fecha_inicio' AND DATE(v.fecha_hora)<='$fecha_fin' AND v.idcliente='$idcliente'";
		return ejecutarConsulta($sql);		
	}

    */
}
