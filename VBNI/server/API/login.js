const Route = require('./route');
const UserDAL = require('../DAL/DB/userDAL');

class LoginRouter extends Route {
    init() {
        this.userDAL = new UserDAL();
        this.login();
    }

    login() {
        super.post('login', (req, res) => {
            this.userDAL.findById(req.body.userName, (user) => {
                res.send(user);
            });
        });
    }
}

module.exports = LoginRouter;