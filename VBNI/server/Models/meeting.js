class Meeting {
    constructor(id, presentor, date, summary, groupId) {
        this._id = id;
        this.presentor = presentor;
        this.date = date;
        this.summary = summary;
        this.groupId = groupId;
    }
}

module.exports = Meeting;