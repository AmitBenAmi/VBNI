$(document).ready(function() {
    $("#login-button").on('click',function(evt) {
        var pass = $("#pass").val();
        var user = $("#username").val();

        if (user && pass) {
            $.post("/login", { user: user, pass: pass })
            .done(function( data ) {
                window.location.href = '/';
            })
            .fail(function() {
                $("#toast").MaterialSnackbar.showSnackbar({message: 'Example Message # '})        
            });
        }
        
    });
});