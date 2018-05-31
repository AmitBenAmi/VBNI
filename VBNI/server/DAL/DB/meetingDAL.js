const MongoDAL = require('./mongoDAL');
const Meetings = require('../../Models/meeting');
const meetingsCollectionName = 'meetings';

class MeetingDAL extends MongoDAL {
    findByGroup(groupId, wrongIdCb, errorCb, foundCb) {
        try {
            let groupObjectId = super.createObjectId(groupId);
            super.findByProperties({groupId:groupObjectId}, meetingsCollectionName, foundCb, errorCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }

    addMeeting(groupId, presentor, date, wrongIdCb, successCb, errorCb) {
        try {
            let groupObjectId = super.createObjectId(groupId);
            let meeting = {
                groupId: groupObjectId,
                presentor: presentor,
                date: date
            };

            super.insert(meeting, meetingsCollectionName, errorCb, successCb);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }
    }
}

module.exports = MeetingDAL;