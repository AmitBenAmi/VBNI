const MongoDAL = require('./mongoDAL');
const Referral = require('../../Models/referral');
const referralsCollectionName = "referrals";
const MemberDAL = require('./memberDAL');

class RefferalsDAL extends MongoDAL {
    constructor() {
        super();
        this.MemberDAL = new MemberDAL();
    }

    find(foundCallbackFunction) {
        super.find(referralsCollectionName, (refDocs) => {
            this._createReferral(refDocs, foundCallbackFunction);
        });
    }

    getByReferrerId(userId, errorCb, foundCb) {
        super.findByProperties({referrer : userId}, referralsCollectionName, (refDocs) => {
            this._createReferral(refDocs, foundCb);
        }, errorCb);
    }

    getByReferenceToId(userId, errorCb, foundCb) {
        super.findByProperties({referenceTo : userId}, referralsCollectionName, (refDocs) => {
            this._createReferral(refDocs, foundCb);
        }, errorCb);
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
        if (referralsDocs.length == 0) {
            creationCb(referrals);
        }

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
       this.MemberDAL.findById(id, idFoundCallbackFunction, notFoundCallbackFunction, (e) => {
            console.error(`Couldn't find member details for ID: ${id}`);
            throw (e);
       });
    }
}

module.exports = RefferalsDAL;