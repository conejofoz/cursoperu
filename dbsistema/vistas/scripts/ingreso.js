
var tabla;

//Funcion que se ejecuta al inicio

function init() {
    mostrarform(false);
    listar();

    $("#formulario").on("submit", function (e) {
        guardaryeditar(e);
    });
    
    
    
    //cargamos los itens al select proveedor
    $.post("../ajax/ingreso.php?op=selectProveedor", function(r){
        $("#idproveedor").html(r);
        $("#idproveedor").selectpicker('refresh');
    })
    

}


function limpiar() {
    $("#idproveedor").val("");
    $("#proveedor").val("");
    $("#serie_comprovante").val("");
    $("#num_comprovante").val("");
    $("#fecha_hora").val("");
    $("#impuesto").val("");
    
    $("#total_compra").val("");
    $(".filas").remove();
    $("#total").html("0");
    
    
}


function mostrarform(flag) {
    limpiar();
    if (flag) {
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        $("#btnGuardar").prop("disabled", false);
        $("#btnagregar").hide();
        listarArticulos();
        $("#guardar").hide();
        $("#btnGuardar").show();
        $("#btnCancelar").show();
        $("#btnAgregar").show();

    } else {
        $("#listadoregistros").show();
        $("#formularioregistros").hide();
        $("#btnagregar").show();

    }
}



function cancelarform() {
    limpiar();
    mostrarform(false);
}



function listar() {
    tabla = $('#tbllistado').dataTable({
        "aProcessing": true, //activamos el procesamiento del datatables
        "aServerSide": true, //paginacion y filtrado realizados por el servidor
        dom: 'Bfrtip', //definimos los elementos del control de tabla
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdf'
        ],
        "ajax":
                {
                    url: '../ajax/ingreso.php?op=listar',
                    type: "get",
                    dataType: "json",
                    error: function (e) {
                        console.log(e.responseText);
                    }
                },
        "bDestroy": true,
        "iDisplayLength": 5, //paginacion
        "order": [[0, "desc"]]
    }).DataTable();
}




function listarArticulos() {
    tabla = $('#tblarticulos').dataTable({
        "aProcessing": true, //activamos el procesamiento del datatables
        "aServerSide": true, //paginacion y filtrado realizados por el servidor
        dom: 'Bfrtip', //definimos los elementos del control de tabla
        buttons: [
            
        ],
        "ajax":
                {
                    url: '../ajax/ingreso.php?op=listarArticulos',
                    type: "get",
                    dataType: "json",
                    error: function (e) {
                        console.log(e.responseText);
                    }
                },
        "bDestroy": true,
        "iDisplayLength": 5, //paginacion
        "order": [[0, "desc"]]
    }).DataTable();
}



function guardaryeditar(e) {
    e.preventDefault();
    //$("#btnGuardar").prop("disabled", true);
    var formData = new FormData($("#formulario")[0]);

    $.ajax({
        url: "../ajax/ingreso.php?op=guardaryeditar",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,

        success: function (datos) {
            bootbox.alert(datos);
            mostrarform(false);
            listar();
        }
    });
    limpiar();
}



function mostrar(idarticulo){
    $.post("../ajax/articulo.php?op=mostrar",{idarticulo:idarticulo},function(data, status){
       data = JSON.parse(data);
       mostrarform(true);
       
       $("#idcategoria").val(data.idcategoria);
       $('#idcategoria').selectpicker('refresh');
       $("#codigo").val(data.codigo);
       $("#nombre").val(data.nombre);
       $("#stock").val(data.stock);
       $("#descripcion").val(data.descripcion);
       $("#imagenmuestra").show();
       $("#imagenmuestra").attr("src", "../files/articulos/"+data.imagen);
       $("#imagenactual").val(data.imagen);
       $("#idarticulo").val(data.idarticulo);
       generarbarcode();
    })
}



function anular(idingreso){
    bootbox.confirm("Deseja desactivar el ingreso?", function(result){
        if(result){
           $.post("../ajax/ingreso.php?op=desactivar",{idingreso:idingreso},function(e){
              bootbox.alert(e);
              tabla.ajax.reload();
           });
        }
    })
}




//declaracion de variables necesarias para traabjar con las compras y sus detalles

var impuesto=18;
var cont=0;
var detalles=0;
$("#guardar").hide();
$("#tipo_comprovante").change(marcarImpuesto);




function marcarImpuesto(){
    var tipo_comprovante=$("#tipo_comprovante option:selected").text();
    if(tipo_comprovante=='Factura'){
        $("#impuesto").val(impuesto);
    } else {
        $("#impuesto").val("0");
    }
}





function agregarDetalle(idarticulo, articulo){
    var cantidad = 1;
    var precio_compra = 1;
    var precio_venta = 1;
    
    if(idarticulo!=""){
        var subtotal=cantidad*precio_compra;
        var fila = '<tr class="filas" id="fila'+cont+'">'+
                '<td><button class="btn btn-danger" onclick="eliminarDetalle('+cont+')">X</button></td>' +
                '<td><input type="hidden" name="idarticulo[]" value="'+idarticulo+'" >'+articulo+'</td>' +
                '<td><input type="number" name="cantidad[]" id="cantidad" value="'+cantidad+'" ></td>' +
                '<td><input type="number" name="precio_compra[]" id="precio_compra[]" value="'+precio_compra+'" ></td>' +
                '<td><input type="number" name="precio_venta[]" id="precio_venta[]" value="'+precio_venta+'" ></td>' +
                '<td><span name="subtotal" id="subtotal'+cont+'">'+subtotal+'</span></td>' +
                '<td><button type="button" onclick="modificarSubtotales()" class="btn btn-info"><i class="fa fa-refresh"></i></button></td>' +
                '</tr>';
        cont++;
        detalles=detalles+1;
        $("#detalles").append(fila);
        modificarSubtotales();
    } else {
        alert("error ao ingressao o detalle");
    }
}




/*function modificarSubtotales(){
    var cant = document.getElementsByName("cantidad[]");
    var prec = document.getElementsByName("precio_compra[]");
    var sub = document.getElementsByName("subtotal");
    
    for (var i=0;i <cant.length;i++){
        var inpC=cant[i];
        var inpP=prec[i];
        var inpX=sub[i];
        
        inpX.value=inpC.value * inpP.value;
        document.getElementsByName("subtotal")[i].innerHTML = inpX.value;
    }
    calcularTotales();
}
*/

 function modificarSubtotales()
  {
  	var cant = document.getElementsByName("cantidad[]");
    var prec = document.getElementsByName("precio_compra[]");
    var sub = document.getElementsByName("subtotal");

    for (var i = 0; i <cant.length; i++) {
    	var inpC=cant[i];
    	var inpP=prec[i];
    	var inpS=sub[i];

    	inpS.value=inpC.value * inpP.value;
    	document.getElementsByName("subtotal")[i].innerHTML = inpS.value;
    }
    calcularTotales();

  }



function calcularTotales(){
    var sub = document.getElementsByName("subtotal");
    var total = 0.0;
    for(var i = 0; i<sub.length; i++){
        total += document.getElementsByName("subtotal")[i].value;
    }
    $("#total").html("S/." + total);
    $("#total_compra").val(total);
    evaluar();
}




function evaluar(){
    if(detalles > 0){
        $("#guardar").show();
    } else {
        $("#guardar").hide();
        cont=0;
    }
}




function eliminarDetalle(indice){
    $("#fila"+indice).remove();
    calcularTotales();
}




init();


