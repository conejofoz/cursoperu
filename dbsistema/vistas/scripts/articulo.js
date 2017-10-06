
var tabla;

//Funcion que se ejecuta al inicio

function init() {
    mostrarform(false);
    listar();

    $("#formulario").on("submit", function (e) {
        guardaryeditar(e);
    })
    
    
    //Cargamos los itens al select categoria
    $.post("../ajax/articulo.php?op=selectCategoria", function(r){
       $("#idcategoria").html(r);
       $('#idcategoria').selectpicker('refresh');
    });
    
    $("#imagenmuestra").hide();
}


function limpiar() {
    $("#codigo").val("");
    $("#nombre").val("");
    $("#descripcion").val("");
    $("#stock").val("");
    $("#imagenmuestra").attr("src","");
    $("#imagenactual").val("");
    $("#imagen").val(""); //eu arrumei esse q atualizava o proximo com a imagen do anterior
    $("#print").hide();
    $("#idarticulo").val("");
}


function mostrarform(flag) {
    limpiar();
    if (flag) {
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        $("#btnGuardar").prop("disabled", false);
        $("#btnagregar").hide();

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
                    url: '../ajax/articulo.php?op=listar',
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
        url: "../ajax/articulo.php?op=guardaryeditar",
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



function desactivar(idarticulo){
    bootbox.confirm("Deseja desactivar el articulo?", function(result){
        if(result){
           $.post("../ajax/articulo.php?op=desactivar",{idarticulo:idarticulo},function(e){
              bootbox.alert(e);
              tabla.ajax.reload();
           });
        }
    })
}



function activar(idarticulo){
    bootbox.confirm("Deseja activar el articulo?", function(result){
        if(result){
           $.post("../ajax/articulo.php?op=activar",{idarticulo:idarticulo},function(e){
              bootbox.alert(e);
              tabla.ajax.reload();
           });
        }
    })
}



//funcion para generar el codigo de barras
function generarbarcode(){
    codigo=$("#codigo").val();
    JsBarcode("#barcode", codigo);
    $("#print").show();
}


//function para imprimir el codigo de barras
function imprimir(){
    $("#print").printArea();
}



init();
