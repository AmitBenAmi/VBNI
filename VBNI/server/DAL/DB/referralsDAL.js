const MongoDAL = require('./mongoDAL');
const Referral = require('../../Models/referral');
const referralsCollectionName = "referrals";
const MemberDAL = require('./memberDAL');

class RefferalsDAL extends MongoDAL {
    find(foundCallbackFunction) {
        super.find(referralsCollectionName, (refDocs) => {
            this._createReferral(refDocs, foundCallbackFunction);
        });
    }

    getReferralsByMember(userId) {
        try {
            super.findByProperties({referrer : userId}, referralsCollectionName , (refDocs) => {
                if (this._checkIfFunction(successCb)) {
                    try {
                        let referrals = this._createReferral(refDocs);
                    }
                    catch (e) {
                        console.error(e);

                        if (this._checkIfFunction(errorCb)) {
                            errorCb(e);
                        }
                    }
                }
            });
        }
        catch (e) {
            console.error(e);

            if (this._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    _detailsCallback(referrals, ref, referralsCount, field, cb) {
        return (details) => {
            ref[field] = `${details.firstName} ${details.lastName}`;

            if (ref.referrer && ref.referenceTo) {
                referrals.push(ref);
                referralsCount--;

                if (referralsCount === 0 && super._checkIfFunction(cb)) {
                    cb(referrals);
                }
            }

        };
    }

    _createReferral(referralsDocs, creationCb) {
        let referrals = [];
        
        for (let index = 0; index < referralsDocs.length; index++) {
            let referralDoc = referralsDocs[index];

            let referral = new Referral(referralDoc._id,
                undefined,
                undefined,
                referralDoc.clientName, 
                referralDoc.isGood, 
                referralDoc.amount)
                
            this._getMemberDetails(referralDoc.referrer, this._detailsCallback(referrals, referral, referralsDocs.length, 'referrer', creationCb));
            this._getMemberDetails(referralDoc.referenceTo, this._detailsCallback(referrals, referral, referralsDocs.length, 'referenceTo', creationCb));
        }
    }

    _getMemberDetails(id, idFoundCallbackFunction, notFoundCallbackFunction) {
       new MemberDAL().findById(id, idFoundCallbackFunction, notFoundCallbackFunction, (member) => {
        idFoundCallbackFunction(member);
       });
    }
}

module.exports = RefferalsDAL;