const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const GroupDAL = require('../DAL/DB/groupDAL');

class GroupRouter extends Route {
    init() {
        this.groupDAL = new GroupDAL();
        this.getGroup();
        this.getGroups();
        this.getMembers();
        this.addMember();
        this.removeMember();
    }

    getGroup() {
        super.get('groups/:name', (req, res) => {
            try {
                let groupName = req.params.name;

                this.groupDAL.findByName(groupName, (group) => {
                    res.send(group);
                });
            }
            catch (e) {
                console.error(e);
                this._sendBadRequest(res);
            }
        });
    }
    
    getGroups() {
        super.get('groups', (req, res) => {
            this.groupDAL.find((groups) => {
                res.send(groups);
            });
        });
    }

    getMembers() {
        super.get('groups/:id/members', (req, res) => {
            try {
                let groupId = req.params.id;
                
                this.groupDAL.getMembers(groupId, () => {
                    this._sendBadRequest(res);
                }, () => {
                    this._sendInternalServerError(res);
                }, (members) => {
                    res.send(members);
                });
            }
            catch (e) {
                console.error(e);
                this._sendBadRequest(res);
            }
        })
    }

    addMember() {
        super.post('groups/members', (req, res) => {
            try {
                let groupId = req.body.group.id;
                let members = req.body.members;

                this.groupDAL.addMembersToGroup(groupId, members, () => {
                    this._sendBadRequest(res);
                }, () => {
                    this._sendInternalServerError(res);
                }, () => {
                    this._sendOk(res);
                });
            }
            catch (e) {
                console.error(e);
                this._sendBadRequest(res);
            }
        });
    }

    removeMember() {
        super.delete('groups/members', (req, res) => {
            try {
                let groupId = req.body.group.id;
                let members = req.body.members;

                this.groupDAL.removeMemberFromGroup(groupId, members, () => {
                    this._sendBadRequest(res);
                }, () => {
                    this._sendInternalServerError(res);
                }, () => {
                    this._sendOk(res);
                });
            }
            catch (e) {
                console.error(e);
                this._sendBadRequest(res);
            }
        });
    }
}

module.exports = GroupRouter;