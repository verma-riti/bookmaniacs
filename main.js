$(document).ready(function() {
    Materialize.updateTextFields();
    $('.carousel').carousel();
    (function() {
        var _swal = window.swal;
        window.swal = function() {
            var previousWindowKeyDown = window.onkeydown;
            _swal.apply(this, Array.prototype.slice.call(arguments, 0));
            window.onkeydown = previousWindowKeyDown;
        };
    })();
});