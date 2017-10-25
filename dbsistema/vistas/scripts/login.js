$("#frmAcceso").on('submit', function(e){
    e.preventDefault();
    logina=$("#logina").val();
    clavea=$("#clavea").val();
    
    
    
    $.post("../ajax/usuario.php?op=verificar", {"logina":logina, "clavea":clavea}, function(data){
        if(data!="null"){ //estava entrando em qualquer usuario pq o null estava sem aspas
            $(location).attr("href", "escritorio.php");
        } else {
            bootbox.alert("Usuario y/o Password incorrectos");
        }
    })
    
    
})