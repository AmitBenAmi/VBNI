const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const referralsDAL = require('../DAL/DB/referralsDAL');
const cookieName = 'user';

class ReferralRouter extends Route {
    init() {
        this.referralsDAL = new referralsDAL();
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

    createReferral() {
        super.post('references', (req, res) => {
            try {
                let referrer = JSON.parse(req.cookies[cookieName]).userName;
                let referenceTo = req.body.referenceTo;
                let clientName = req.body.clientName;
                this.referralsDAL.createReferral(referrer, referenceTo, clientName, () => {
                    super._sendInternalServerError(res);
                }, () => {
                    super._sendOk(res);
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