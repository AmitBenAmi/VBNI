const MongoDAL = require('./mongoDAL');
const Register = require('../../Models/register');

class RegisterDAL extends MongoDAL {
    constructor() {
        super();
        this.collectionName = 'joinRequests';
    }

    findById(id, idFoundCallbackFunction, notFoundCallbackFunction, errorCb) {
        super.findById(id, this.collectionName, (regDoc) => {
            idFoundCallbackFunction(
                new Register(
                    regDoc._id, 
                    regDoc.firstName, 
                    regDoc.lastName, 
                    regDoc.groupId, 
                    regDoc.job, 
                    regDoc.details, 
                    regDoc.phone, 
                    regDoc.website));
        }, notFoundCallbackFunction, errorCb);
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