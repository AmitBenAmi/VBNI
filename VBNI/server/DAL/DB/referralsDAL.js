const MongoDAL = require('./mongoDAL');
const Referral = require('../../Models/referral');
const referralsCollectionName = "referrals";
const MemberDAL = require('./memberDAL');

class RefferalsDAL extends MongoDAL {
    constructor() {
        super();
        this.MemberDAL = new MemberDAL();
    }

    getByReferrerId(userId, errorCb, foundCb, idNotFoundCb) {
        super.findByProperties({referrer : userId}, referralsCollectionName, (refDocs) => {
            this._createReferral(refDocs, foundCb, idNotFoundCb);
        }, errorCb);
    }

    getByReferenceToId(userId, errorCb, foundCb, idNotFoundCb) {
        super.findByProperties({referenceTo : userId}, referralsCollectionName, (refDocs) => {
            this._createReferral(refDocs, foundCb, idNotFoundCb);
        }, errorCb);
    }

    _detailsCallback(referrals, ref, referralsCount, refInedx, field, cb) {
        return (details) => {
            ref[field] = `${details.firstName} ${details.lastName}`;

            if (ref.referrer && ref.referenceTo) {
                referrals.push(ref);
                if ((refInedx+1) ===  referralsCount && super._checkIfFunction(cb)) {
                    cb(referrals);
                }
            }

        };
    }

    _createReferral(referralsDocs, creationCb, memberNotfoundCb) {
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
                
            this._getMemberDetails(referralDoc.referrer, 
                this._detailsCallback(referrals, referral, referralsDocs.length,index, 'referrer', creationCb), 
                memberNotfoundCb);
            this._getMemberDetails(referralDoc.referenceTo, 
                this._detailsCallback(referrals, referral, referralsDocs.length, index,'referenceTo', creationCb),
                memberNotfoundCb);
        }
    }

    _getMemberDetails(id, idFoundCallbackFunction, notFoundCallbackFunction, errorCb) {
       this.MemberDAL.findById(id, (member) => {
        idFoundCallbackFunction(member);
       }, notFoundCallbackFunction, errorCb);
    }
}

module.exports = RefferalsDAL;