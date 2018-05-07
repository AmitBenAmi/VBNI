const MongoDAL = require('./mongoDAL');
const Member = require('../../Models/register');

class RegisterDAL extends MongoDAL {
    constructor() {
        super();
        this.collectionName = 'joinRequests';
    }

    createRegistration(registerDoc, errorCb, successCb) {
        if (!super.checkIfObjectId(registerDoc.groupId)) {
            let groupObjectId = super.createObjectId(registerDoc.groupId);
            registerDoc.groupId = groupObjectId;
        }
        
        super.insert(registerDoc, this.collectionName, errorCb, successCb);
    }

    getRegistrationByUserName(userName, notFoundCb, errorCb, foundCb) {
        try {
            super.findById(userName, this.collectionName, foundCb, notFoundCb, errorCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(errorCb)) {
                errorCb(e);
            }
        }
    }

    getRegistrationsByGroup(groupId, wrongIdCb, errorCb, foundCb) {
        try {
            let groupObjectId = super.createObjectId(groupId);
            super.findByProperties({groupId:groupObjectId}, this.collectionName, foundCb, errorCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    deleteRegistration(userName, wrongIdCb, errorCb, successCb) {
        try {
            super.deleteById(userName, this.collectionName, errorCb, successCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }
}

module.exports = RegisterDAL;