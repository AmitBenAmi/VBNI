const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const referralsDAL = require('../DAL/DB/referralsDAL');

class ReferralRouter extends Route {
    init() {
        this.referralsDAL = new referralsDAL();
        this.getReferrals();
    }

    getReferrals() {
        super.get('referrals', (req, res) => {
            this.referralsDAL.find((referrals) => {
                res.send(referrals);
            });
        });
    }
}
    
module.exports = ReferralRouter;