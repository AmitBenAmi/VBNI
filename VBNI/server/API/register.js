const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const registerDAL = require('../DAL/DB/registerDAL');
const MemberDAL = require('../DAL/DB/memberDAL');

class RegisterRouter extends Route {
    init() {
        this.MemberDAL = new MemberDAL();
        this.registerDAL = new registerDAL();
        this.register();
    }

    register() {
        super.post('register', (req, res) => {
                var userName =  req.body.userName;
                this.MemberDAL.findById(userName,
                // if user name exists - send conflict code
                () => {
                        super._sendResponse(HttpStatusCodes.CONFLICT, res);
                }, () => 
                {
                    var addedToRegister = {
                        _id : req.body.userName,
                        firstName : req.body.firstName,
                        lastName : req.body.lastName,
                        job : req.body.job,
                        groupId : req.body.groupId
                    };
                    // if id not found - register could be done
                    this.registerDAL.createRegistration(addedToRegister,
                    // on error
                    () => {
                            super._sendInternalServerError(res);
                    },
                    // on success - addind response the registed user name
                    () => {
                        res.body = addedToRegister;
                        super._sendOk(res);
                    });
                
                }, () => {
                    super._sendInternalServerError(res);
                });
        });
    }
}

module.exports = RegisterRouter;