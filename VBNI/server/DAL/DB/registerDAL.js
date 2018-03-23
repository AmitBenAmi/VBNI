const MongoDAL = require('./mongoDAL');
const Member = require('../../Models/register');

class RegisterDAL extends MongoDAL {
    constructor() {
        super();
        this.collectionName = 'joinRequests';
    }

    createRegistration(registerDoc, errorCb, successCb) {
        super.insert(registerDoc, this.collectionName, errorCb, successCb);
    }

}

module.exports = RegisterDAL;