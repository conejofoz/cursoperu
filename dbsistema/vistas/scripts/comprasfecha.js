
var tabla;

//Funcion que se ejecuta al inicio

function init() {
    listar();
    $("#fecha_inicio").change(listar);
    $("#fecha_fin").change(listar);
}







function listar() {
    var fecha_inicio = $("#fecha_inicio").val();
    var fecha_fin = $("#fecha_fin").val();
    
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
                    url: '../ajax/consultas.php?op=comprasfecha',
            data:{fecha_inicio: fecha_inicio, fecha_fin: fecha_fin},
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














init();
