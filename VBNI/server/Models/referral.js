class Referral {
    constructor(id, referrer, referenceTo, clientName, isGood, amount, creationDate, endDate) {
        {
            this._id = id;
            this.referrer = referrer;
            this.referenceTo =  referenceTo; 
            this.clientName = clientName;
            this.isGood = isGood;
            this.amount = amount;
            this.creationDate = creationDate;
            this.endDate = endDate;
        }
    }
}

module.exports = Referral;