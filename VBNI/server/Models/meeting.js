class Meeting {
    constructor(id, host, date, summary) {
        this._id = id;
        this.host = host;
        this.date = date;
        this.summary = summary;
    }
}

module.exports = Meeting;