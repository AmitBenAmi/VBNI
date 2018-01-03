const Route = require('./route');
const MemberDAL = require('../DAL/DB/memberDAL');

class LoginRouter extends Route {
    init() {
        this.memberDAL = new MemberDAL();
        this.login();
    }

    login() {
        super.post('login', (req, res) => {
            try {
                let userName = req.body.userName;

                this.memberDAL.findById(userName, (member) => {
                    res.send(member);
                });
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
        });
    }
}

module.exports = LoginRouter;