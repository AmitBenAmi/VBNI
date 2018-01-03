const Route = require('./route');
const MemberDAL = require('../DAL/DB/memberDAL');

class Member extends Route {
    init() {
        this.memberDAL = new MemberDAL();
        this.addToGroup();
    }

    addToGroup() {
        super.put('members', (req, res) => {
            let memberUserName
            let groupId;

            try {
                memberUserName = req.body.memberUserName;
                groupId = req.body.groupId;
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }

            this.memberDAL.findById(memberUserName, (member) => {
                member.groupId = groupId;

                this.memberDAL.addToGroup(member, groupId, () => {
                    super._sendBadRequest(res);
                }, () => {
                    super._sendInternalServerError(res);
                }, () => {
                    super._sendOk(res);
                });
            }, () => {
                super._sendNotFound(res);
            });
        })
    }

    removeFromGroup() {
        super.put('members', (req, res) => {
            let memberUserName

            try {
                memberUserName = req.body.memberUserName;
            }
            catch (e) {
                console.error(e);
                super._sendBadRequest(res);
            }

            this.memberDAL.findById(memberUserName, (member) => {
                member.groupId = undefined;

                this.memberDAL.addToGroup(member, groupId, () => {
                    super._sendBadRequest(res);
                }, () => {
                    super._sendInternalServerError(res);
                }, () => {
                    super._sendOk(res);
                });
            }, () => {
                super._sendNotFound(res);
            });
        })
    }
}

module.exports = Member;