const Route = require('./route');
const UserDAL = require('../DAL/DB/userDAL');

class LoginRouter extends Route {
    init() {
        this.userDAL = new UserDAL();
        this.login();
    }

    login() {
        super.post('login', (req, res) => {
            try {
                let userName = req.body.userName;

                this.userDAL.findById(userName, (user) => {
                    res.send(user);
                });
            }
            catch (e) {
                console.error(e);
                this._sendBadRequest(res);
            }
        });
    }
}

module.exports = LoginRouter;