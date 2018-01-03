const MongoDAL = require('./mongoDAL');
const Group = require('../../Models/group');
const groupsCollectionName = "groups";

class GroupDAL extends MongoDAL {
    find(foundCallbackFunction, notFoundCallbackFunction) {
        super.find(groupsCollectionName, (groupDocs) => {
            let groups = this._createGroups(groupDocs);
            foundCallbackFunction(groups);
        }, notFoundCallbackFunction);
    }

    findById(id, foundCallbackFunction, notFoundCallbackFunction) {
        super.findById(id, groupsCollectionName, (group) => {
            foundCallbackFunction(group);
        }, notFoundCallbackFunction);
    }

    getMembers(groupId, wrongIdCb, errorCb, successCb, notFoundCb) {
        try {
            let id = super.createObjectId(groupId);
            super.findById(id, groupsCollectionName, (group) => {
                if (this._checkIfFunction(successCb)) {
                    try {
                        successCb(group.members);
                    }
                    catch (e) {
                        console.error(e);

                        if (this._checkIfFunction(errorCb)) {
                            errorCb(e);
                        }
                    }
                }
            }, notFoundCb);
        }
        catch (e) {
            console.error(e);

            if (this._checkIfFunction(wrongIdCb)) {
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