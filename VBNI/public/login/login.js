$(document).ready(() => {
    const enterKey = 13;

    let showMessage = (message) => {
        $("#toast")[0].MaterialSnackbar.showSnackbar({ message: message });
    }

    let eventFn = (evt) => {
        let password = $("#pass").val();
        let username = $("#username").val();

        if (!(username && password)) {
            showMessage(`Username and Password are required`);
        }
        else {
            $.post("/login", { username: username, password: password })
                .done((data) => {
                    window.location.href = '/';
                })
                .fail((xhr, status, errorMessage) => {
                    let toast = $("#toast")[0];
                    let message;

                    switch (xhr.status) {
                        case (404): {
                            message = 'Username is incorrect.';
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

    $("#login-button").on('click', eventFn);
    $('html').keyup((event) => {
        if (event.keyCode === enterKey) {
            eventFn(event);
        }
    });
});