const Route = require('./route');
const GroupDAL = require('../DAL/DB/groupDAL');

class GroupRouter extends Route {
    init() {
        this.groupDAL = new GroupDAL();
        this.getGroup();
        this.getGroups();
        this.getMembers();
        this.addMemberToGroup();
        this.deleteMembersFromGroup();
    }

    getGroup() {
        super.get('groups/:id', (req, res) => {
            try {
                let groupId = req.params.id;

                this.groupDAL.findById(groupId, (group) => {
                    res.send(group);
                }, () => {
                    super._sendNotFound(res);
                }, () => {
                    super._sendInternalServerError(res);
                });
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
        });
    }
    
    getGroups() {
        super.get('groups', (req, res) => {
            this.groupDAL.find((groups) => {
                res.send(groups);
            }, () => {
                super._sendNotFound(res);
            });
        });
    }

    getMembers() {
        super.get('groups/:id/members', (req, res) => {
            try {
                let groupId = req.params.id;
                
                this.groupDAL.getMembers(groupId, () => {
                    super._sendBadRequest(res);
                }, () => {
                    super._sendInternalServerError(res);
                }, (members) => {
                    res.send(members);
                }, () => {
                    super._sendNotFound(res);
                });
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
        })
    }

    addMemberToGroup() {
        super.post('group/:groupId/members/:memberId', (req, res) => {
            try {
                let groupId = req.params.groupId;
                let memberId = req.params.memberId;
                this.groupDAL.addMember(groupId, memberId, () => {
                    super._sendNotFound(res);
                }, () => {
                    super._sendInternalServerError(res);
                }, () => {
                    res.send();
                });
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
        });
    }

    deleteMembersFromGroup() {
        super.delete('group/:id/members', (req, res) => {
            try {
                let groupId = req.params.id;
                let memberIds = req.body.memberIds;
                this.groupDAL.deleteMembers(groupId, memberIds, () => {
                    super._sendNotFound(res);
                }, () => {
                    super._sendInternalServerError(res);
                }, () => {
                    res.send();
                })
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }
        });
    }
}

module.exports = GroupRouter;