const Referral = require('./referral');

class NewReferral extends Referral {
    constructor(referrer, referenceTo, clientName, creationDate) {
        super(undefined, referrer, referenceTo, clientName, undefined, 0, creationDate, undefined);
    }
}

module.exports = NewReferral;