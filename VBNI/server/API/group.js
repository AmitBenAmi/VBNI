const Route = require('./route');
const GroupDAL = require('../DAL/DB/groupDAL');

class GroupRouter extends Route {
    init() {
        this.groupDAL = new GroupDAL();
        this.getGroup();
        this.getGroups();
        this.getMembers();
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
}

module.exports = GroupRouter;