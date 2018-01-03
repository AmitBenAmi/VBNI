const Route = require('./route');
const MeetingDAL = require('../DAL/DB/meetingDAL');

class MeetingRouter extends Route {
    init() {
        this.meetingDAL = new MeetingDAL();
        this.getMeetingsByGroup();
    }

    getMeetingsByGroup() {
        super.get('meetings', (req, res) => {
            let groupId;

            try {
                groupId = req.query.groupId;
            }
            catch (e) {
                console.error(e);

                super._sendBadRequest(res);
            }

            this.meetingDAL.findByGroup(groupId, () => {
                super._sendBadRequest(res);
            }, () => {
                super._sendInternalServerError(res);
            }, (meetings) => {
                res.send(meetings);
            });
        });
    }
}

module.exports = MeetingRouter;