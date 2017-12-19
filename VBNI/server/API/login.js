const Route = require('./router');
const User = require('../Models/user');

class LoginRouter extends Route {
    init(app) {
        super.post(app, 'login', this.login);
    }

    login(req, res) {
        let user = new User();
        user.login(req.body.userName, (user) => {
            res.send(user);
        });
    }
}

module.exports = LoginRouter;