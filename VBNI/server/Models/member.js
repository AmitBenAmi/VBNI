class Member {
    constructor(userName, firstName, lastName, groupId, job, details, phone, role, profPic, website) {
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.groupId = groupId;
        this.job =job;
        this.details = details;
        this.phone = phone;
        this.role = role;
        this.profilePicture = profPic;
        this.website = website;
    }
}

module.exports = Member;