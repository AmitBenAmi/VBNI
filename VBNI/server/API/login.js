const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const MemberDAL = require('../DAL/DB/memberDAL');
const cookieName = 'user';
const cookieParams = {
    httpOnly: false,
    signed: false,
    maxAge: 300000,
};
const prefixLoginURL = "/login/";

class LoginRouter extends Route {
    init() {
        this.memberDAL = new MemberDAL();
        this.login();
        this.requestsMiddleware();
    }

    _checkForCookies(req, name, isSigned) {
        let signedCookieExist = !!isSigned && !!req.signedCookies && !!req.signedCookies[name];
        let nonSignedCookieExist = !isSigned && !!req.cookies && !!req.cookies[name];

        return signedCookieExist || nonSignedCookieExist;
    }

    _isReqToLogin(req) {
        return req.path.startsWith(prefixLoginURL) || 
               (req.path === '/login' && req.method === 'POST');
    }

    requestsMiddleware() {
        this.app.use((req, res, next) => {
            console.info(`${req.protocol} request for path ${req.path}`);

            // If user isn't logged in, redirect to login page
            if (!this._checkForCookies(req, cookieName, cookieParams.signed) &&
                !this._isReqToLogin(req)) {
                res.redirect('/login/login.html');
            } else {
                next();
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
                    res.cookie(cookieName, `${member.firstName} ${member.lastName}`, cookieParams);
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