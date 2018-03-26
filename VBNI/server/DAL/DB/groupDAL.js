const MongoDAL = require('./mongoDAL');
const MemberDAL = require('./memberDAL');
const Group = require('../../Models/group');
const groupsCollectionName = "groups";

class GroupDAL extends MongoDAL {
    find(foundCallbackFunction, notFoundCallbackFunction) {
        super.find(groupsCollectionName, (groupDocs) => {
            let groups = this._createGroups(groupDocs);
            foundCallbackFunction(groups);
        }, notFoundCallbackFunction);
    }

    findById(id, foundCallbackFunction, notFoundCallbackFunction, errorCb) {
        super.findById(id, groupsCollectionName, (group) => {
            foundCallbackFunction(group);
        }, notFoundCallbackFunction, errorCb);
    }

    getMembers(groupId, wrongIdCb, errorCb, successCb) {
        let membersDAL = new MemberDAL();
        membersDAL.findByGroup(groupId, wrongIdCb, successCb, errorCb);
    }

    addMember(groupId, memberId, wrongIdCb, errorCb, successCb) {
        let membersDAL = new MemberDAL();
        membersDAL.addToGroup(memberId, groupId, wrongIdCb, errorCb, successCb);
    }

    deleteMembers(groupId, memberIds, wrongIdCb, errorCb, successCb) {
        let membersDAL = new MemberDAL();
        membersDAL.removeFromGroup(memberIds, wrongIdCb, errorCb, successCb);
    }

    _createGroups(groupDocs) {
        let groups = [];
        
        for (let index = 0; index < groupDocs.length; index++) {
            let groupDoc = groupDocs[index];
            groups.push(new Group(groupDoc._id, groupDoc.name));
        }

        return groups;
    }
}

module.exports = GroupDAL;