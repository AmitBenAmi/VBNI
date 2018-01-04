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
        let groupObjectId;

        try {
            groupObjectId = super.createObjectId(groupId);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }

        super.findByProperties({groupId: groupObjectId}, membersCollectionName, foundCb, errorCb);
    }

    addToGroup(member, groupId, wrongIdCb, errorCb, successCb) {
        try {
            let groupObjectId = super.createObjectId(groupId);
            member.groupId = groupObjectId;

            super.update(membersCollectionName, {_id:member.userName}, member, errorCb, successCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    _createMember(memberDoc) {
        return new Member(memberDoc._id, memberDoc.firstName, memberDoc.lastName, memberDoc.groupId);
    }
}

module.exports = MemberDAL;