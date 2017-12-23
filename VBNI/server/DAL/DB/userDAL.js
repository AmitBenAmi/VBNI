const MongoDAL = require('./mongoDAL');
const User = require('../../Models/user');
const usersCollectionName = "users";

class UserDAL extends MongoDAL {
    findById(id, idFoundCallbackFunction) {
        super.findById(id, usersCollectionName, (userDoc) => {
            let user = this._createUser(userDoc);
            idFoundCallbackFunction(user);
        });
    }

    _createUser(userDoc) {
        return new User(userDoc._id, userDoc.firstName, userDoc.lastName);
    }
}

module.exports = UserDAL;