const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const MemberDAL = require('../DAL/DB/memberDAL');
const cookieName = 'user';
const minutes = 5;
const secondsInMinute = 60;
const millisecondsInSecond = 1000;
const cookieParams = {
    httpOnly: false,
    signed: false,
    maxAge: minutes * secondsInMinute * millisecondsInSecond,
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
                res.redirect(`${prefixLoginURL}login.html`);
            } else {
                next();
            }
        });
    }

    login() {
        super.post('login', (req, res) => {
            try {
                let userName = req.body.username;

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
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
        });
    }
}

module.exports = LoginRouter;