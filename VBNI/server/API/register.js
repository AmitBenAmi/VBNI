const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const registerDAL = require('../DAL/DB/registerDAL');
const MemberDAL = require('../DAL/DB/memberDAL');

class RegisterRouter extends Route {
    init() {
        this.MemberDAL = new MemberDAL();
        this.registerDAL = new registerDAL();
        this.register();
        this.getRegistrations();
    }

    register() {
        super.post('register', (req, res) => {
            var userName = req.body.userName;
            this.MemberDAL.findById(userName,
                // if user name exists - send conflict code
                () => {
                    super._sendResponse(HttpStatusCodes.CONFLICT, res);
                }, () => {
                    this.registerDAL.findById(userName, () => {
                        super._sendResponse(HttpStatusCodes.CONFLICT, res);
                    }, () => {
                        var addedToRegister = {
                            _id: userName,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            job: req.body.job,
                            groupId: req.body.groupId,
                            phone: req.body.phone,
                            website: req.body.website
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
                }, () => {
                    super._sendInternalServerError(res);
                });
        });
    }

    getRegistrations() {
        super.get('register/:groupId', (req, res) => {
            try {
                let groupId = req.params.groupId;

                this.registerDAL.getRegistrationsByGroup(groupId, () => {
                    super._sendBadRequest(res);
                }, () => {
                    super._sendInternalServerError(res);
                }, (registrations) => {
                    res.send(registrations);
                });
            }
            catch (e) {
                console.error(e);

                super._sendBadRequest(res);
            }
        });
    }
}

module.exports = RegisterRouter;