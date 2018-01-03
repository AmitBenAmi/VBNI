const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const referralsDAL = require('../DAL/DB/referralsDAL');

class ReferralRouter extends Route {
    init() {
        this.referralsDAL = new referralsDAL();
        this.getReferrals();
        this.getByReferrerId();
        this.getByReferenceToMemberId();
    }

    getReferrals() {
        super.get('referrals', (req, res) => {
            this.referralsDAL.find((referrals) => {
                res.send(referrals);
            });
        });
    }

    getByReferrerId() {
        super.get('referrals/:memberId', (req, res) => {
            let memberId;
    
            try {
                memberId = req.params.memberId;
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
    
            this.referralsDAL.getByReferrerId(memberId, () => {
                super._sendInternalServerError(res); 
            },
            (referrals) => {
                res.send(referrals);
            });
        });
    }

    getByReferenceToMemberId() {
        super.get('references/:memberId', (req, res) => {
            let memberId;
    
            try {
                memberId = req.params.memberId;
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
    
            this.referralsDAL.getByReferenceToId(memberId, () => {
                super._sendInternalServerError(res); 
            },
            (referrals) => {
                res.send(referrals);
            });
        });
    }
}
    
module.exports = ReferralRouter;