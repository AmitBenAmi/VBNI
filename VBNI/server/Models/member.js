class Member {
    constructor(userName, firstName, lastName, groupId, job, details, phone, role) {
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.groupId = groupId;
        this.job =job;
        this.details = details;
        this.phone = phone;
        this.role = role;
    }
}

module.exports = Member;