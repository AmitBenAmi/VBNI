class Properties {
    constructor() {
        this.configFilePath = __dirname + '/../../resources/configurations/develop.json';
        this.fs = require('fs')
    }

    read(propertiesLoadedCallback) {
        this.data = JSON.parse(this.fs.readFileSync(this.configFilePath));
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

module.exports = Properties