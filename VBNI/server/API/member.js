const Route = require('./route');
const MemberDAL = require('../DAL/DB/memberDAL');

class Member extends Route {
    init() {
        this.memberDAL = new MemberDAL();
        this.addToGroup();
    }

    addToGroup() {
        super.put('members/:memberUserName', (req, res) => {
            try {
                let memberUserName = req.params.memberUserName;
                let groupId = req.body.groupId;

                this.memberDAL.findById(memberUserName, (member) => {
                    this.memberDAL.addToGroup(member.userName, groupId, () => {
                        super._sendBadRequest(res);
                    }, () => {
                        super._sendInternalServerError(res);
                    }, () => {
                        super._sendOk(res);
                    });
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
}

module.exports = Member;