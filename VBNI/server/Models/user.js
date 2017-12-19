class User {
    constructor() {
        const Mongo = require('../DAL/DB/mongo');
        this.mongo = new Mongo();
    }

    login(userName, callback) {
        this._checkIfUserExist(userName, callback);
    }

    _checkIfUserExist(userName, callback) {
        this.mongo.findOne(userName,'users', (user) => {
            callback(user);
        })
    }
}

module.exports = User;