const MongoDAL = require('./mongoDAL');
const Group = require('../../Models/group');
const groupsCollectionName = "groups";

class GroupDAL extends MongoDAL {
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

    getMembers(groupId, wrongIdCb, errorCb, successCb) {
        try {
            let id = super.createObjectId(groupId);
            super.findById(id, groupsCollectionName, (group) => {
                if (this._checkIfParamIsFunction(successCb)) {
                    try {
                        successCb(group.members);
                    }
                    catch (e) {
                        console.error(e);

                        if (this._checkIfParamIsFunction(errorCb)) {
                            errorCb(e);
                        }
                    }
                }
            });
        }
        catch (e) {
            console.error(e);

            if (this._checkIfParamIsFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }
    
    addMembersToGroup(groupId, members, wrongIdCb, errorCb, successCb) {
        try {
            let id = super.createObjectId(groupId);
            super.pushUnique({_id: id}, "members", members, groupsCollectionName, errorCb, successCb);
        }
        catch (e) {
            console.error(e);

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
            console.error(e);
            
            if (this._checkIfParamIsFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
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