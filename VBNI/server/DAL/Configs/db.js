const JsonProperties = require('./jsonProperties');

class DbProperties extends JsonProperties {
    constructor() {
        super(__dirname + '/../../../resources/configurations/db/develop.json');
    }

    get dbServerName() {
        return this.data.mongodbServerName;
    }

    get dbServerPort() {
        return this.data.mongodbServerPort;
    }

    get dbUser() {
        return this.data.mongodbUser;
    }

    get dbPassword() {
        return this.data.mongodbPassword;
    }

    get dbName() {
        return this.data.mongodbDbName;
    }
}

module.exports = DbProperties