const Referral = require('./referral');

class NewReferral extends Referral {
    constructor(referrer, referenceTo, clientName) {
        super(undefined, referrer, referenceTo, clientName, undefined, 0);
    }
}

module.exports = NewReferral;