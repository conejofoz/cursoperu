
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
}


function mostrarform(flag) {
    limpiar();
    if (flag) {
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        $("#btnGuardar").prop("disabled", false);
        $("#btnagregar").hide();
        listarArticulos();

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
    $("#btnGuardar").prop("disabled", true);
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
            tabla.ajax.reload();
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








init();


