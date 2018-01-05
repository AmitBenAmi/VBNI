const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const MemberDAL = require('../DAL/DB/memberDAL');
const cookieName = 'user';
const cookieParams = {
    httpOnly: false,
    signed: false,
    maxAge: 300000,
};

class LoginRouter extends Route {
    init() {
        this.memberDAL = new MemberDAL();
        this.loginPage();
        this.login();
        this.requestsMiddleware();
    }

    _checkForCookies(req, name, isSigned) {
        let signedCookieExist = !!isSigned && !!req.signedCookies && !!req.signedCookies[name];
        let nonSignedCookieExist = !isSigned && !!req.cookies && !!req.cookies[name];

        return signedCookieExist || nonSignedCookieExist;
    }

    requestsMiddleware() {
        this.app.use((req, res, next) => {
            console.info(`${req.protocol} request for path ${req.path}`);

            if (this._checkForCookies(req, cookieName, cookieParams.signed)) {
                next();
            }
            else {
                res.writeHead(HttpStatusCodes.MOVED_TEMPORARILY, {
                    'Location': '/login'
                });
                res.end();
            }
        });
    }

    loginPage() {
        super.get('login', (req, res) => {
            if (!this._checkForCookies(req, cookieName, cookieParams.signed)) {
                res.sendfile('views/login.html');
            }
            else {
                res.writeHead(HttpStatusCodes.MOVED_TEMPORARILY, {
                    'Location': '/'
                });
                res.end();
            }
            
        });
    }

    login() {
        super.post('login', (req, res) => {
            let userName;

            try {
                userName = req.body.username;
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }

            this.memberDAL.findById(userName, (member) => {
                try {
                    res.cookie(cookieName, JSON.stringify(member), cookieParams);
                    super._sendOk(res);
                }
                catch (e) {
                    console.error(e);
                    super._sendInternalServerError(res);
                }
            }, () => {
                super._sendNotFound(res);
            }, () => {
                super._sendInternalServerError(res);
            });
        });
    }
}

module.exports = LoginRouter;