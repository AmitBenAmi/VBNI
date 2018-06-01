class Meeting {
    constructor(id, presentor, date, summary, groupId, location) {
        this._id = id;
        this.presentor = presentor;
        this.date = date;
        this.summary = summary;
        this.groupId = groupId;
        this.location = location;
    }
}

module.exports = Meeting;