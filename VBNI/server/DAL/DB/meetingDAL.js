const MongoDAL = require('./mongoDAL');
const Meetings = require('../../Models/meeting');
const meetingsCollectionName = 'meetings';

class MeetingDAL extends MongoDAL {
    findByGroup(groupId, wrongIdCb, errorCb, foundCb) {
        let groupObjectId;

        try {
            groupObjectId = super.createObjectId(groupId);
        }
        catch (e) {
            console.error(e);

            if (super._checkIfFunction(wrongIdCb)) {
                wrongIdCb(e);
            }
        }

        super.findByProperties({groupId:groupObjectId}, meetingsCollectionName, foundCb, errorCb);
    }
}

module.exports = MeetingDAL;