class Referral {
    constructor(id, referrer, referenceTo, clientName, isGood, amount) {
        {
            this._id = id;
            this.referrer = referrer;
            this.referenceTo =  referenceTo; 
            this.clientName = clientName;
            this.isGood = isGood;
            this.amount = amount;
        }
    }
}

module.exports = Referral;