const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const referralsDAL = require('../DAL/DB/referralsDAL');

class ReferralRouter extends Route {
    init() {
        this.referralsDAL = new referralsDAL();
        this.getByReferrerId();
        this.getByReferenceToMemberId();
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
}
    
module.exports = ReferralRouter;