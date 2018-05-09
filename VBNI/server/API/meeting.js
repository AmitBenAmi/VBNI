const Route = require('./route');
const MeetingDAL = require('../DAL/DB/meetingDAL');

class MeetingRouter extends Route {
    init() {
        this.meetingDAL = new MeetingDAL();
        this.addMeetingToGroup();
        this.getMeetingsByGroup();
        this.getNextMeetingForGroup();
    }

    addMeetingToGroup() {
        super.post('meetings/:groupId', (req, res) => {
            try {
                let groupId = req.params.groupId;
                let host = req.body.host;
                let date = req.body.date;
                this.MeetingDAL.addMeeting(groupId, host, date, (err) => {
                    this._sendBadRequest(res);
                }, () => {
                    this._sendOk(res);
                }, (err) => {
                    this._sendInternalServerError(res);
                });
            }
            catch (e) {
                console.error(e);

                super._sendBadRequest(res);
            }
        });
    }

    getMeetingsByGroup() {
        super.get('meetings', (req, res) => {
            try {
                let groupId = req.query.groupId;

                this.meetingDAL.findByGroup(groupId, () => {
                    super._sendBadRequest(res);
                }, () => {
                    super._sendInternalServerError(res);
                }, (meetings) => {
                    res.send(meetings);
                });
            }
            catch (e) {
                console.error(e);

                super._sendBadRequest(res);
            }
        });
    }

    getNextMeetingForGroup() {
        super.get('meetings/getNextMeetingForGroup', (req, res) => {
            try {
                let groupId = req.query.groupId;

                this.meetingDAL.findByGroup(groupId, () => {
                    super._sendBadRequest(res);
                }, () => {
                    super._sendInternalServerError(res);
                }, (meetings) => {
                    var currentDate = new Date();
                    var closestMeeting = undefined;
                    if (meetings.length) {
                        var difference = new Date(meetings[0].date) - currentDate;

                        meetings.forEach(function (meeting) {
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
            }
            catch (e) {
                console.error(e);

                super._sendBadRequest(res);
            }
        });
    }
}

module.exports = MeetingRouter;