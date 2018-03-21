const MongoDAL = require('./mongoDAL');
const Member = require('../../Models/member');
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
            super.update(membersCollectionName, {_id:userName}, {groupId:groupObjectId}, errorCb, successCb);
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
            memberDoc.role);
    }
}

module.exports = MemberDAL;