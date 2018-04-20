const MongoDAL = require('./mongoDAL');
const Member = require('../../Models/member');
const RegisterDAL = require('./registerDAL');
const membersCollectionName = "members";

class MemberDAL extends MongoDAL {
    findById(id, idFoundCallbackFunction, notFoundCallbackFunction, errorCb) {
        super.findById(id, membersCollectionName, (memberDoc) => {
            let member = this._createMember(memberDoc);
            idFoundCallbackFunction(member);
        }, notFoundCallbackFunction, errorCb);
    }

    findByGroup(groupId, wrongIdCb, foundCb, errorCb) {
        try {
            let groupObjectId = super.createObjectId(groupId);
            super.findByProperties({groupId: groupObjectId}, membersCollectionName, foundCb, errorCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    getMembers(errorCb, successCb) {
        super.find(membersCollectionName, (memberDocs) => {
            try {
                let members = this._createMembers(memberDocs);

                if (super._checkIfFunction(successCb)) {
                    successCb(members);
                }
            }
            catch (e) {
                console.error(e);

                if (super._checkIfFunction(errorCb)) {
                    errorCb(e);
                }
            }
        }, errorCb);
    }

    addToGroup(userName, groupId, wrongIdCb, errorCb, successCb) {
        try {
            let groupObjectId = super.createObjectId(groupId);

            let successCallback = (modified) => {
                if (modified == 1) {
                    if (super._checkIfFunction(successCb)) {
                        successCb(modified);
                    }
                }
                else {
                    let registerDal = new RegisterDAL();

                    registerDal.getRegistrationByUserName(userName, wrongIdCb, errorCb, (register) => {
                        let member = new Member(
                            userName, 
                            register.firstName,
                            register.lastName, 
                            groupObjectId, 
                            register.job, 
                            register.details, 
                            register.phone);

                        delete member.userName;
                        member._id = userName;

                        this.addMember(member, errorCb, () => {
                            registerDal.deleteRegistration(userName, wrongIdCb, errorCb, successCb);
                        });
                    });
                }
            }

            super.update(membersCollectionName, {_id:userName}, {groupId:groupObjectId}, errorCb, successCallback);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    addMember(member, errorCb, successCb) {
        try {
            super.insert(member, membersCollectionName, errorCb, successCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(errorCb)) {
                errorCb(e);
            }
        }
    }

    removeFromGroup(userNames, wrongIdCb, errorCb, successCb) {
        try {
            super.unsetMany(membersCollectionName, userNames, {groupId: undefined}, errorCb, successCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    _createMembers(memberDocs) {
        let members = [];
        memberDocs.forEach(memberDoc => {
            members.push(this._createMember(memberDoc));
        });
        return members;
    }

    _createMember(memberDoc) {
        return new Member(
            memberDoc._id, 
            memberDoc.firstName,
            memberDoc.lastName, 
            memberDoc.groupId, 
            memberDoc.job, 
            memberDoc.details,
            memberDoc.phone,
            memberDoc.role,
            memberDoc.profilePicture
        );
    }
}

module.exports = MemberDAL;