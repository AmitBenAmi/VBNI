class Meeting {
    constructor(id, host, date, summary, groupId) {
        this._id = id;
        this.host = host;
        this.date = date;
        this.summary = summary;
        this.groupId = groupId;
    }
}

module.exports = Meeting;