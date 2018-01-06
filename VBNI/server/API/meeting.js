const Route = require('./route');
const MeetingDAL = require('../DAL/DB/meetingDAL');

class MeetingRouter extends Route {
    init() {
        this.meetingDAL = new MeetingDAL();
        this.getMeetingsByGroup();
        this.getNextMeetingForGroup();
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

    getNextMeetingForGroup() {
        super.get('meetings/getNextMeetingForGroup', (req, res) => {
            let groupId;

            try {
                groupId = req.query.groupId;
                console.log(groupId);
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
                var currentDate = new Date();
                var closestMeeting = undefined;
                if (meetings.length) {
                    var difference =new Date(meetings[0].date) - currentDate;

                    meetings.forEach(function(meeting) {
                        var newDiff = new Date(meeting.date) - currentDate;
                        if (newDiff > 0) {
                            if (difference < 0) {
                                difference = newDiff;
                                closestMeeting = meeting;
                            }
                            else if (newDiff <= difference) {
                                difference = newDiff;
                                closestMeeting = meeting;
                            }
                        }
                    })

                    if (difference >= 0 && closestMeeting) {
                        res.send(closestMeeting);
                        return;
                    }                    
                }
                
                res.send(undefined);
            });
        });
    }
}

module.exports = MeetingRouter;