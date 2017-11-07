var tabla;

//Función que se ejecuta al inicio
function init() {
    mostrarform(false);
    listar();

    $("#formulario").on("submit", function (e)
    {
        guardaryeditar(e);
    });
    //Cargamos los items al select cliente
    $.post("../ajax/venta.php?op=selectCliente", function (r) {
        $("#idcliente").html(r);
        $('#idcliente').selectpicker('refresh');
    });
}

//Función limpiar
function limpiar()
{
    $("#idcliente").val("");
    $("#cliente").val("");
    $("#serie_comprovante").val("");
    $("#num_comprovante").val("");
    $("#impuesto").val("0");

    $("#total_venta").val("");
    $(".filas").remove();
    $("#total").html("0");
    $("#idventa").val(""); //eu - náo gravava a venda depois de consultar pq ficava o id armazenado

    //Obtenemos la fecha actual
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#fecha_hora').val(today);

    //Marcamos el primer tipo_documento
    $("#tipo_comprovante").val("Boleta");
    $("#tipo_comprovante").selectpicker('refresh');
    
   
}

//Función mostrar formulario
function mostrarform(flag)
{
    limpiar();
    
    if (flag) //consulta
    {
        $("#listadoregistros").hide();
        $("#formularioregistros").show();
        //$("#btnGuardar").prop("disabled",false);
        $("#btnagregar").hide();
        //listarArticulos();

        $("#btnGuardar").hide();
        $("#btnCancelar").show();
        $("#btnAgregarArt").show();
        detalles = 0;
        
        
    } else  //nova venda
    {
        listarArticulos();
        $("#listadoregistros").show();
        $("#formularioregistros").hide();
        $("#btnagregar").show();
        limparDetalhes(); // eu // limpar detalhes numa nova venda //cria datatable vazio
        tabla2.ajax.reload();// eu // detalhes nova venda estava saindo pequeno
    }
}

//Función cancelarform
function cancelarform()
{
    limpiar();
    mostrarform(false);
}

//Función Listar
function listar()
{
    tabla = $('#tbllistado').dataTable(
            {
                "aProcessing": true, //Activamos el procesamiento del datatables
                "aServerSide": true, //Paginación y filtrado realizados por el servidor
                dom: 'Bfrtip', //Definimos los elementos del control de tabla
                buttons: [
                    'copyHtml5',
                    'excelHtml5',
                    'csvHtml5',
                    'pdf'
                ],
                "ajax":
                        {
                            url: '../ajax/venta.php?op=listar',
                            type: "get",
                            dataType: "json",
                            error: function (e) {
                                console.log(e.responseText);
                            }
                        },
                "bDestroy": true,
                "iDisplayLength": 5, //Paginación
                "order": [[0, "desc"]]//Ordenar (columna,orden)
            }).DataTable();
}


//Función ListarArticulos
function listarArticulos()
{
    tabla = $('#tblarticulos').dataTable(
            {
                "aProcessing": true, //Activamos el procesamiento del datatables
                "aServerSide": true, //Paginación y filtrado realizados por el servidor
                dom: 'Bfrtip', //Definimos los elementos del control de tabla     
                buttons: [
                ],
                "ajax":
                        {
                            url: '../ajax/venta.php?op=listarArticulosVenta',
                            type: "get",
                            dataType: "json",
                            error: function (e) {
                                console.log(e.responseText);
                            }
                        },
                "bDestroy": true,
                "iDisplayLength": 5, //Paginación
                "order": [[0, "desc"]]//Ordenar (columna,orden)
            }).DataTable();
}
//Función para guardar o editar

function guardaryeditar(e)
{
    e.preventDefault(); //No se activará la acción predeterminada del evento
    //$("#btnGuardar").prop("disabled",true);
    var formData = new FormData($("#formulario")[0]);

    $.ajax({
        url: "../ajax/venta.php?op=guardaryeditar",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function (datos)
        {
            bootbox.alert(datos);
            mostrarform(false);
            listar();
        }

    });
    limpiar();
}

function mostrar(idventa) // quando clica no botao visualizar venda
{
    $.post("../ajax/venta.php?op=mostrar", {idventa: idventa}, function (data, status)
    {
        data = JSON.parse(data);
        mostrarform(true);

        $("#idcliente").val(data.idcliente);
        $("#idcliente").selectpicker('refresh');
        $("#tipo_comprovante").val(data.tipo_comprovante);
        $("#tipo_comprovante").selectpicker('refresh');
        $("#serie_comprovante").val(data.serie_comprovante);
        $("#num_comprovante").val(data.num_comprovante);
        $("#fecha_hora").val(data.fecha);
        $("#impuesto").val(data.impuesto);
        //$("#idventa").val(data.idventa);
        $("#idventa").val(idventa);
        //Ocultar y mostrar los botones
        $("#btnGuardar").hide();
        $("#btnCancelar").show();
        $("#btnAgregarArt").hide();
        $("#total").html("US$ " + data.total_venta); //eu mostrar total abaixo do datatable
    });

    /*$.post("../ajax/venta.php?op=listarDetalle&id=" + idventa, function (r) {
        $("#detalles").html(r);
        tabla.ajax.reload(); //eu
        $("#detalles").hide();
        $("#detalles").show();
    });
    */
   //*******
   tabla2 = $('#detalles').dataTable(
            {
                "language": {"emptyTable": "No data available in table"}, //******no ANDAAAAAAA
                "aProcessing": true, //Activamos el procesamiento del datatables
                "aServerSide": true, //Paginación y filtrado realizados por el servidor
                dom: 'Bfrtip', //Definimos los elementos del control de tabla     
                buttons: [
                ],
                "ajax":
                        {
                            url: '../ajax/venta.php?op=listarDetalle',
                            data:{idventa: idventa},
                            type: "get",
                            dataType: "json",
                            error: function (e) {
                                console.log(e.responseText);
                            }
                        },
                "bDestroy": true,
                "paging": false,
                "searching": false,
                "iDisplayLength": 15, //Paginación
                "order": [[0, "desc"]]//Ordenar (columna,orden)
            }).DataTable();
   //*******
}

//Función para anular registros
function anular(idventa)
{
    bootbox.confirm("¿Está Seguro de anular la venta?", function (result) {
        if (result)
        {
            $.post("../ajax/venta.php?op=anular", {idventa: idventa}, function (e) {
                bootbox.alert(e);
                tabla.ajax.reload();
            });
        }
    })
}

//Declaración de variables necesarias para trabajar con las compras y
//sus detalles
var impuesto = 18;
var cont = 0;
var detalles = 0;
//$("#guardar").hide();
$("#btnGuardar").hide();
$("#tipo_comprovante").change(marcarImpuesto);

function marcarImpuesto()
{
    var tipo_comprovante = $("#tipo_comprovante option:selected").text();
    if (tipo_comprovante == 'Factura')
    {
        $("#impuesto").val(impuesto);
    } else
    {
        $("#impuesto").val("0");
    }
}

function agregarDetalle(idarticulo, articulo, precio_venta)
{
    var cantidad = 1;
    var descuento = 0;

    if (idarticulo != "")
    {
        var subtotal = cantidad * precio_venta;
        var fila = '<tr class="filas" id="fila' + cont + '">' +
                '<td width="10"><button type="button" class="btn btn-danger" onclick="eliminarDetalle(' + cont + ')">X</button></td>' +
                '<td><input type="hidden" name="idarticulo[]" value="' + idarticulo + '">' + articulo + '</td>' +
                '<td width="10"><input styele="width: 10px;" type="number" onchange="modificarSubototales()" name="cantidad[]" id="cantidad[]" value="' + cantidad + '"></td>' +
                '<td width="10"><input type="number" onchange="modificarSubototales()" name="precio_venta[]" id="precio_venta[]" value="' + precio_venta + '"></td>' +
                '<td width="10"><input type="number" name="descuento[]" value="' + descuento + '"></td>' +
                '<td width="10"><span name="subtotal" id="subtotal' + cont + '">' + subtotal + '</span></td>' +
                '<td width="10"><button type="button" onclick="modificarSubototales()" class="btn btn-info"><i class="fa fa-refresh"></i></button></td>' +
                '</tr>';
        cont++;
        detalles = detalles + 1;
        $('#detalles').append(fila); 
        modificarSubototales(); 
    } else
    {
        alert("Error al ingresar el detalle, revisar los datos del artículo");
    }
}

function modificarSubototales()
{
    var cant = document.getElementsByName("cantidad[]");
    var prec = document.getElementsByName("precio_venta[]");
    var desc = document.getElementsByName("descuento[]");
    var sub = document.getElementsByName("subtotal");

    for (var i = 0; i < cant.length; i++) {
        var inpC = cant[i];
        var inpP = prec[i];
        var inpD = desc[i];
        var inpS = sub[i];

        inpS.value = (inpC.value * inpP.value) - inpD.value;
        document.getElementsByName("subtotal")[i].innerHTML = inpS.value;
    }
    calcularTotales();

}
function calcularTotales() {
    var sub = document.getElementsByName("subtotal");
    var total = 0.0;

    for (var i = 0; i < sub.length; i++) {
        total += document.getElementsByName("subtotal")[i].value;
    }
    $("#total").html("S/. " + total);
    $("#total_venta").val(total);
    evaluar();
}

function evaluar() {
    if (detalles > 0)
    {
        $("#btnGuardar").show();
    } else
    {
        $("#btnGuardar").hide();
        cont = 0;
    }
}

function eliminarDetalle(indice) {
    $("#fila" + indice).remove();
    calcularTotales();
    detalles = detalles - 1;
    evaluar()
}




function limparDetalhes(){
    tabla2 = $('#detalles').dataTable(
            {
                "aProcessing": true, //Activamos el procesamiento del datatables
                "aServerSide": true, //Paginación y filtrado realizados por el servidor
                dom: 'Bfrtip', //Definimos los elementos del control de tabla     
                buttons: [
                ],
                "ajax":
                        {
                            url: '../ajax/venta.php?op=listarDetalle',
                            data:{idventa: 0},
                            type: "get",
                            dataType: "json",
                            error: function (e) {
                                console.log(e.responseText);
                            }
                        },
                "bDestroy": true,
                "iDisplayLength": 15, //Paginación
                "order": [[0, "desc"]]//Ordenar (columna,orden)
            }).DataTable();
}

init();