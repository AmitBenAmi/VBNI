const MongoDAL = require('./mongoDAL');
const Referral = require('../../Models/referral');
const MemberDAL = require('./memberDAL');
const Promise = require('bluebird');

class RefferalsDAL extends MongoDAL {
    constructor() {
        super();
        this.MemberDAL = new MemberDAL();
        this.collectionName = 'referrals';
    }

    getByReferrerId(userId, errorCb, foundCb, idNotFoundCb) {
        super.findByProperties({referrer : userId}, this.collectionName, (refDocs) => {
            refDocs.length === 0 ? idNotFoundCb() : this._getReferralsDetails(refDocs, foundCb, idNotFoundCb, errorCb);
        }, errorCb);
    }

    getByReferenceToId(userId, errorCb, foundCb, idNotFoundCb) {
        super.findByProperties({referenceTo : userId}, this.collectionName, (refDocs) => {
            refDocs.length === 0 ? idNotFoundCb() : this._getReferralsDetails(refDocs, foundCb, idNotFoundCb, errorCb);
        }, errorCb);
    }

    _getReferralsDetails(referralsDocs, creationCb, memberNotfoundCb, errorCb) {
        let referralPromises = referralsDocs.map((referral) => {
            return this._createReferral(referral, creationCb, memberNotfoundCb, errorCb);
        });

        Promise.all(referralPromises).then((referralsDetailsResponse) => {
            creationCb(referralsDetailsResponse)
        })
    }

    _createReferral(referralDoc, creationCb, memberNotfoundCb, errorCb) {
        return new Promise((resolve) => {
            let memberDetailsPromises = [];

            memberDetailsPromises.push(this._getMemberDetails(referralDoc.referrer, memberNotfoundCb, errorCb));
            memberDetailsPromises.push(this._getMemberDetails(referralDoc.referenceTo, memberNotfoundCb, errorCb));
    
            Promise.all(memberDetailsPromises).then((detailsResponse) => {
                resolve(new Referral(referralDoc._id,
                        `${detailsResponse[0].firstName} ${detailsResponse[0].lastName}`,
                        `${detailsResponse[1].firstName} ${detailsResponse[1].lastName}`,
                        referralDoc.clientName,
                        referralDoc.isGood,
                        referralDoc.amount));
            });
        });
    }

    _getMemberDetails(id, idFoundCallbackFunction, notFoundCallbackFunction, errorCb) {
        return new Promise((resolve) => {
            this.MemberDAL.findById(id, (member) => {
                resolve(member);
               }, notFoundCallbackFunction, errorCb);
        });
    }
}

module.exports = RefferalsDAL;