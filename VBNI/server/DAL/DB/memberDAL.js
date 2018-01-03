const MongoDAL = require('./mongoDAL');
const Member = require('../../Models/member');
const membersCollectionName = "members";

class MemberDAL extends MongoDAL {
    findById(id, idFoundCallbackFunction) {
        super.findById(id, membersCollectionName, (memberDoc) => {
            let member = this._createMember(memberDoc);
            idFoundCallbackFunction(member);
        });
    }

    _createMember(memberDoc) {
        return new Member(memberDoc._id, memberDoc.firstName, memberDoc.lastName);
    }
}

module.exports = MemberDAL;