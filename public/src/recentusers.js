var lifeRU = 0;

$('document').ready(() => {
    /** Check search box */
    $('#searchbox-box').focus(() => {
        lifeRU++;
        ShowRecentUsers();
    })
    $('#searchbox-box').blur(() => {
        lifeRU--;
        if(lifeRU < 1) HideRecentUsers();
    })

    /** Check mouse on */
    $('#searchbox').hover(()=> {
        lifeRU++;
    }, () => {
        lifeRU--;
        if(lifeRU < 1) HideRecentUsers();
    })

    /** Change Recent Users */
    $('#searchbox-platform').change(() => {
        GetRecentUsers();
    })
})

function ShowRecentUsers() {
    $('#recent-users').css('display', 'block');
    $('#searchbox-platform').css('border-bottom-left-radius', '0px');
    $('#searchbox-button').css('border-bottom-right-radius', '0px');

    GetRecentUsers();
}

function HideRecentUsers() {
    const radius = $('#searchbox-platform').css('border-top-left-radius')

    $('#recent-users').css('display', 'none');
    $('#searchbox-platform').css('border-bottom-left-radius', radius);
    $('#searchbox-button').css('border-bottom-right-radius', radius);

    lifeRU = 0;
}

function GetRecentUsers() {

    /** Recent Users */
    var recentUsersHtml = '';
    var platform = $('#searchbox-platform option:selected').val();

    var recentUsers
    try{
        recentUsers = JSON.parse(`${getCookie('recent-lologme-' + platform).slice(2)}`);
    } catch(err) {
        recentUsers = [];
    }

    if(recentUsers.length === 0) {
        HideRecentUsers();
    }

    for (i in recentUsers) {
        if(i > 10) break;

        var user = recentUsers[i];

        recentUsersHtml += `
        <div class="recent-user">
            <a href="/${platform}/user/${user}">
                ${user}
            </a>
            <span class="recent-delete" onclick="RemoveRecentUsers('${user}')"><i class="fa fa-times" aria-hidden="true"></i></span>
        </div>`
    }

    $('#recent-container').html(recentUsersHtml);
}

function RemoveRecentUsers(_user) {
    /** Recent Users */
    var platform = $('#searchbox-platform option:selected').val();

    var recentUsers
    try{
        recentUsers = JSON.parse(`${getCookie('recent-lologme-' + platform).slice(2)}`);
    } catch(err) {
        return;
    }

    for(i in recentUsers) {
        if(_user === recentUsers[i]) {
            recentUsers.splice(i, 1);
            break;
        }
    }

    var cookieStr = 'j: ' + JSON.stringify(recentUsers);
    setCookie('recent-lologme-'+platform, cookieStr, 30);

    lifeRU--;
    GetRecentUsers();
}