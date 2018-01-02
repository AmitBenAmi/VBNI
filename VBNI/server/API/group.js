const HttpStatusCodes = require('http-status-codes');
const Route = require('./route');
const GroupDAL = require('../DAL/DB/groupDAL');

class GroupRouter extends Route {
    init() {
        this.groupDAL = new GroupDAL();
        this.getGroup();
        this.getGroups();
        this.addMember();
        this.removeMember();
    }
    
    getGroup() {
        super.get('group/:name', (req, res) => {
            this.groupDAL.findByName(req.params.name, (group) => {
                res.send(group);
            });
        });
    }
    
    getGroups() {
        super.get('group', (req, res) => {
            this.groupDAL.find((groups) => {
                res.send(groups);
            });
        });
    }

    addMember() {
        super.post('group/member', (req, res) => {
            this.groupDAL.addMembersToGroup(req.body.group.id, req.body.members, () => {
                res.sendStatus(HttpStatusCodes.BAD_REQUEST);
            }, () => {
                res.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            }, () => {
                res.sendStatus(HttpStatusCodes.OK);
            });
        });
    }

    removeMember() {
        super.delete('group/member', (req, res) => {
            this.groupDAL.removeMemberFromGroup(req.body.group.id, req.body.members, () => {
                res.sendStatus(HttpStatusCodes.BAD_REQUEST);
            }, () => {
                res.sendStatus(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            }, () => {
                res.sendStatus(HttpStatusCodes.OK);
            })
        });
    }
}

module.exports = GroupRouter;