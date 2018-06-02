const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const referralsDAL = require('../DAL/DB/referralsDAL');
const membersDAL = require('../DAL/DB/memberDAL');
const AWS = require('aws-sdk');
const cookieName = 'user';
AWS.config.region = 'eu-west-1';
AWS.config.update({
    accessKeyId: 'AKIAILYP3HZRDBMUNE2A',
    secretAccessKey: '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'
});
const sns = new AWS.SNS();

class ReferralRouter extends Route {
    init() {
        this.referralsDAL = new referralsDAL();
        this.membersDAL = new membersDAL();
        this.getByReferrerId();
        this.getByReferenceToMemberId();
        this.createReferral();
        this.setReferralAsGoodOrBad();
        this.getOpenRefsByReferenceToId();
    }

    getByReferrerId() {
        super.get('referrals/:memberId', (req, res) => {    
            req.params.memberId ? this._getByReferrerId(req.params.memberId, req, res) : super._sendBadRequest(res);
        });
    }

    _getByReferrerId(memberId, req, res) {
        this.referralsDAL.getByReferrerId(memberId, () => {
            super._sendInternalServerError(res); 
        },
        (referrals) => {
            res.send(referrals);
        },
        () => {
            super._sendBadRequest(res); 
        });
    }

    getByReferenceToMemberId() {
        super.get('references/:memberId', (req, res) => {
            req.params.memberId ? this._getByReferenceToMemberId(req.params.memberId, req, res) : super._sendBadRequest(res);
        });
    }

    getOpenRefsByReferenceToId() {
        super.get('references/count/:memberId', (req,res) => {
            req.params.memberId ?
                this._getOpenRefsByReferenceToId(req.params.memberId, req, res) :
                super._sendBadRequest(res);
        });
    }

    _sendSms(referrer, referTo, clientName, successCb, errorCb, notFoundCb) {
        this.membersDAL.findById(referrer, (referrerDoc) => {
            this.membersDAL.findById(referTo, (referToDoc) => {
                if (!referToDoc.phone) {
                    successCb();
                }
                else {
                    let phone = 
                        referToDoc.phone.startsWith('+97205') ? 
                            referToDoc.phone : 
                            (referToDoc.phone.startsWith('+9725') ? 
                                referToDoc.phone.replace('+9725', '+97205') :
                                (referToDoc.phone.startsWith('05') ? 
                                    `+972${referToDoc.phone}` : 
                                    `+9720${referToDoc.phone}`));

                    let params = {
                        Message: `Hello ${referToDoc.firstName} ${referToDoc.lastName}.\nYou have a new referral from ${referrerDoc.firstName} ${referrerDoc.lastName}.\nThe client name is: ${clientName}.`,
                        MessageAttributes: {
                            'AWS.SNS.SMS.SenderID': {
                                DataType: 'String',
                                StringValue: 'BNI'
                            }
                        },
                        PhoneNumber: phone,
                        Subject: 'BNI'
                    };
                    sns.publish(params, (err, data) => {
                        if (err)  {
                            console.error(err, err.stack);
                            successCb();
                        }
                        else {
                            console.log(data);
                            successCb(data);
                        }
                    });
                }
            }, successCb, successCb);
        }, successCb, successCb);
    }

    createReferral() {
        super.post('references', (req, res) => {
            try {
                let referrer = JSON.parse(req.cookies[cookieName]).userName;
                let referenceTo = req.body.referenceTo;
                let clientName = req.body.clientName;
                this.referralsDAL.createReferral(referrer, referenceTo, clientName, () => {
                    super._sendInternalServerError(res);
                }, () => {
                    this._sendSms(referrer, referenceTo, clientName, () => {
                        super._sendOk(res);
                    }, () => {
                        super._sendInternalServerError(res);
                    }, () => {
                        this._sendNotFound(res);
                    });
                });
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
        });
    }

    setReferralAsGoodOrBad() {
        super.put('references/:referralId', (req, res) => {
            try {
                let referralId = req.params.referralId;
                let isGood = req.body.isGood;
                let amount = req.body.amount;

                if (isGood) {
                    if (amount === undefined) {
                        throw `Invalid amount for referral: ${amount}`;
                    }
                    else {
                        this.referralsDAL.setGoodReferral(referralId, amount, () => {
                            super._sendBadRequest(res);
                        }, () => {
                            super._sendInternalServerError(res);
                        }, () => {
                            super._sendOk(res);
                        });
                    }
                }
                else {
                    this.referralsDAL.setBadReferral(referralId, () => {
                        super._sendBadRequest(res);
                    }, () => {
                        super._sendInternalServerError(res);
                    }, () => {
                        super._sendOk(res);
                    });
                }
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
        });
    }

    _getByReferenceToMemberId(memberId, req, res) {
        this.referralsDAL.getByReferenceToId(memberId, () => {
            super._sendInternalServerError(res); 
        },
        (referrals) => {
            res.send(referrals);
        },
        () => {
            super._sendBadRequest(res); 
        });
    }

    _getOpenRefsByReferenceToId(memberId, req, res) {
        this.referralsDAL.getOpenRefsByReferenceToId(memberId, () => {
            super._sendInternalServerError(res); 
        },
        (count) => {
            res.send(String(count));
        });
    }
}
    
module.exports = ReferralRouter;