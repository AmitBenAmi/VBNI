const MongoDAL = require('./mongoDAL');
const Referral = require('../../Models/referral');
const NewReferral = require('../../Models/newReferral');
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
            this._getReferralsDetails(refDocs, foundCb, idNotFoundCb, errorCb);
        }, errorCb);
    }

    getOpenRefsByReferenceToId(userId, errorCb, foundCb) {
        super.countByProperties({referenceTo : userId, isGood : null}, this.collectionName, (count) => {
           foundCb(count);
        }, errorCb);
    }

    setBadReferral(referralId, wrongIdCb, errorCb, successCb) {
        this._updateReferral(referralId, {isGood:false,amount:0,endDate:new Date().toString()}, wrongIdCb, errorCb, successCb);
    }

    setGoodReferral(referralId, amount, wrongIdCb, errorCb, successCb) {
        this._updateReferral(referralId, {isGood:true,amount:amount,endDate:new Date().toString()}, wrongIdCb, errorCb, successCb);
    }

    _updateReferral(referralId, updateDoc, wrongIdCb, errorCb, successCb) {
        try {
            let referralObjectId = super.createObjectId(referralId);
            super.update(this.collectionName, {_id:referralObjectId}, updateDoc, errorCb, successCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    _getReferralsDetails(referralsDocs, creationCb, memberNotfoundCb, errorCb) {
        let referralPromises = referralsDocs.map((referral) => {
            return this._createReferral(referral, memberNotfoundCb, errorCb);
        });

        Promise.all(referralPromises).then((referralsDetailsResponse) => {
            creationCb(referralsDetailsResponse)
        })
    }

    createReferral(referrer, referenceTo, clientName, errorCb, successCb) {
        let newReferral = new NewReferral(referrer, referenceTo, clientName, new Date().toString());
        super.insert(newReferral, this.collectionName, errorCb, successCb);
    }

    _createReferral(referralDoc, memberNotfoundCb, errorCb) {
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

    _getMemberDetails(id, notFoundCallbackFunction, errorCb) {
        return new Promise((resolve) => {
            this.MemberDAL.findById(id, (member) => {
                resolve(member);
               }, notFoundCallbackFunction, errorCb);
        });
    }
}

module.exports = RefferalsDAL;