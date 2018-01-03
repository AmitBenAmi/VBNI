const MongoDAL = require('./mongoDAL');
const Referral = require('../../Models/referral');
const referralsCollectionName = "referrals";

class RefferalsDAL extends MongoDAL {
    find(foundCallbackFunction) {
        super.find(referralsCollectionName, (refDocs) => {
            let referrals = this._createReferral(refDocs);
            foundCallbackFunction(referrals);
        });
    }

    getReferralsByUser(userId) {
        try {
            super.findByProperties({referrer : userId}, referralsCollectionName , (refDocs) => {
                if (this._checkIfParamIsFunction(successCb)) {
                    try {
                        let referrals = this._createReferral(refDocs);
                    }
                    catch (e) {
                        console.error(e);

                        if (this._checkIfParamIsFunction(errorCb)) {
                            errorCb(e);
                        }
                    }
                }
            });
        }
        catch (e) {
            console.error(e);

            if (this._checkIfParamIsFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    _createReferral(referralsDocs) {
        let referrals = [];
        
        for (let index = 0; index < referralsDocs.length; index++) {
            let referralDoc = referralsDocs[index];
            referrals.push(new Referral(referralDoc._id,
                referralDoc.referrer,
                referralDoc.referenceTo,
                referralDoc.clientName, 
                referralDoc.isGood, 
                referralDoc.amount));
        }

        return referrals;
    }
}

module.exports = RefferalsDAL;