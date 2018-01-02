const MongoDAL = require('./mongoDAL');
const Group = require('../../Models/group');
const groupsCollectionName = "groups";

class GroupDAL extends MongoDAL {
    addMembersToGroup(groupId, members, wrongIdCb, errorCb, successCb) {
        try {
            let id = super.createObjectId(groupId);
            super.pushUnique({_id: id}, "members", members, groupsCollectionName, errorCb, successCb);
        }
        catch (e) {
            if (this._checkIfParamIsFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    removeMemberFromGroup(groupId, members, wrongIdCb, errorCb, successCb) {
        try {
            let id = super.createObjectId(groupId);
            super.pull({_id: id}, "members", members, groupsCollectionName, errorCb, successCb);
        }
        catch (e) {
            if (this._checkIfParamIsFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    find(foundCallbackFunction) {
        super.find(groupsCollectionName, (groupDocs) => {
            let groups = this._createGroups(groupDocs);
            foundCallbackFunction(groups);
        });
    }

    findByName(name, foundCallbackFunction) {
        super.findByProperties({name: name}, groupsCollectionName, (groupDocs) => {
            let groups = this._createGroups(groupDocs);
            foundCallbackFunction(groups);
        });
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