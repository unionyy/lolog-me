function HideLog() {
    $('#user-games-body').attr('hidden', true);
    $('#user-games-header .fa-caret-up').css('display', 'none');
    $('#user-games-header .fa-caret-down').css('display', 'inline');
}

function ShowLog() {
    $('#user-games-body').attr('hidden', false);
    $('#user-games-header .fa-caret-up').css('display', 'inline');
    $('#user-games-header .fa-caret-down').css('display', 'none');
}