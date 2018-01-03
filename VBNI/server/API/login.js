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
                let userName = req.body.user;

                // this.memberDAL.findById(userName, (member) => {
                //     // Add the username to the cookie
                //     const cookieParams = {
                //         httpOnly: true,
                //         signed: true,
                //         maxAge: 300000,
                //     };
                //     res.cookie('username', userName, cookieParams);
                //     res.sendStatus(200);
                // });                

                // Add the username to the cookie
                const cookieParams = {
                    httpOnly: true,
                    signed: true,
                    maxAge: 300000,
                };
                res.cookie('username', userName, cookieParams);
                res.sendStatus(200);
            }
            catch (e) {
                console.error(e);
                res.sendStatus(401);
            }
        });
    }
}

module.exports = LoginRouter;