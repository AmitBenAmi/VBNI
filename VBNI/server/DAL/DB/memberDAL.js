const MongoDAL = require('./mongoDAL');
const Member = require('../../Models/member');
const membersCollectionName = "members";

class MemberDAL extends MongoDAL {
    findById(id, idFoundCallbackFunction, notFoundCallbackFunction) {
        super.findById(id, membersCollectionName, (memberDoc) => {
            let member = this._createMember(memberDoc);
            idFoundCallbackFunction(member);
        }, notFoundCallbackFunction);
    }

    addToGroup(member, groupId, wrongIdCb, errorCb, successCb) {
        try {
            let id = super.createObjectId(groupId);
            super.update(membersCollectionName, {_id:member.userName}, member, errorCb, successCb);
        }
        catch (e) {
            console.error(e);

            if (this._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    _createMember(memberDoc) {
        return new Member(memberDoc._id, memberDoc.firstName, memberDoc.lastName, memberDoc.groupId);
    }
}

module.exports = MemberDAL;