class JsonProperties {
    constructor(path) {
        this.configFilePath = path;
        this.fs = require('fs');
    }

    read(propertiesLoadedCallback) {
        this.data = JSON.parse(this.fs.readFileSync(this.configFilePath));
    }
}

module.exports = JsonProperties