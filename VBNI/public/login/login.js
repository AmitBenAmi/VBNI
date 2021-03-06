const googlePassword = 'Google';

let showMessage = (message) => {
    $("#toast")[0].MaterialSnackbar.showSnackbar({ message: message });
}

let login = (username, password) => {
    if (!(username && password)) {
        showMessage(`Username and Password are required`);
    }
    else {
        $.post("/login", { username: username, password: password })
            .done((data) => {
                window.location.href = '/';
            })
            .fail((xhr, status, errorMessage) => {
                let message;

                switch (xhr.status) {
                    case (404): {
                        if (password !== googlePassword) {
                            message = 'Username is incorrect.';
                        }
                        else {
                            message = 'User isn\'t registered with Google.\nRegister or user Username/Password for authentication.'
                        }
                        break;
                    }
                    case (500): {
                        message = 'Server error, cannot log-in.';
                        break;
                    }
                    default: {
                        message = `An error occured: ${errorMessage}.`;
                        break;
                    }
                }

                showMessage(message);
            });
    };
}

let profile;

function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    loginFromGoogle();
}

function loginFromGoogle() {
    let email = profile.getEmail();
    if (email) {
        login(email, googlePassword);
    }
}

$(document).ready(() => {
    const enterKey = 13;

    function checkLoginState() {
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    }

    let loginFromHtml = function (evt) {
        let password = $("#pass").val();
        let username = $("#username").val();
        login(username, password);
    }

    $("#login-button").on('click', loginFromHtml);
    $('html').keyup((event) => {
        if (event.keyCode === enterKey) {
            loginFromHtml(event);
        }
    });
});


//    ________                            _________ .__                                
//    /  _____/______  ____  __ ________   \_   ___ \|  |__   ____   ____  ______ ____  
//    /   \  __\_  __ \/  _ \|  |  \____ \  /    \  \/|  |  \ /  _ \ /  _ \/  ___// __ \ 
//    \    \_\  \  | \(  <_> )  |  /  |_> > \     \___|   Y  (  <_> |  <_> )___ \\  ___/ 
//    \______  /__|   \____/|____/|   __/   \______  /___|  /\____/ \____/____  >\___  >
//        \/                   |__|             \/     \/                  \/     \/ 

var vbniGroupChoose = angular.module('loginApp', []);

vbniGroupChoose.controller('groupChooseCtrl', ["$scope", "$http", function($scope, $http) {
    $scope.groups = [];
    $http.get('/groups').then(function(res) {
            $scope.groups = res.data;
            $scope.selectedGroup = $scope.groups[0]._id;
        }, function(err) {
            console.log(err);
        })

    $scope.openGroups = () => {
        showDialog("group-dialog");
    };

    $scope.groupChosen = function() {
        var user = { userName : "guest", firstName : "Guest", lastName : ""}
        user.groupId = $scope.selectedGroup;

        document.cookie = "user=" + encodeURIComponent(JSON.stringify(user)) + "; path=/"
        window.location.href = "/"
    } 

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
    }


//        ,---,                          ,--,                        
//        .'  .' `\    ,--,              ,--.'|                        
//    ,---.'     \ ,--.'|              |  | :     ,---.              
//    |   |  .`\  ||  |,               :  : '    '   ,'\   ,----._,. 
//    :   : |  '  |`--'_      ,--.--.  |  ' |   /   /   | /   /  ' / 
//    |   ' '  ;  :,' ,'|    /       \ '  | |  .   ; ,. :|   :     | 
//    '   | ;  .  |'  | |   .--.  .-. ||  | :  '   | |: :|   | .\  . 
//    |   | :  |  '|  | :    \__\/: . .'  : |__'   | .; :.   ; ';  | 
//    '   : | /  ; '  : |__  ," .--.; ||  | '.'|   :    |'   .   . | 
//    |   | '` ,/  |  | '.'|/  /  ,.  |;  :    ;\   \  /  `---`-'| | 
//    ;   :  .'    ;  :    ;  :   .'   \  ,   /  `----'   .'__/\_: | 
//    |   ,.'      |  ,   /|  ,     .-./---`-'            |   :    : 
//    '---'         ---`-'  `--`---'                       \   \  /  
//                                                            `--`-'   

    let showDialog = (id, onClose) => {
        let dialog = $('#' + id)[0];

        if (dialog) {
            dialog.showModal();
            dialog.addEventListener('click', outsideDialog.bind(dialog));
            dialog.addEventListener('keydown', (e) => {
                if (e.keyCode === 27) {
                    onClose && onClose();
                }
            });

            //update MDL
            componentHandler.upgradeAllRegistered();
        }
    };

    let closeDialog = (id, onClose) => {
        let dialog = $('#' + id)[0];

        if (dialog) {
            dialog.close();
        }

        onClose && onClose();
    };

    function outsideDialog(event) {
        if ($(event.srcElement).is('select')) {
            return;
        }
        var dialog = this;
        var rect = dialog.getBoundingClientRect();
        var isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
          dialog.close();
          dialog.removeEventListener('click', outsideDialog);
        }
      }
}])