class Mongo {
    constructor() {
        let mongo = require('mongodb');
        this.objectId = mongo.ObjectID;
        this.mongoClient = mongo.MongoClient;

        let Properties = require('./properties');
        let properties = new Properties();
        properties.read();
        this._createUrl(properties);
        this.dbName = properties.dbName;
    }

    _createUrl(properties) {
        this.url =
            'mongodb://' +
            properties.dbUser + ':' +
            properties.dbPassword + '@' +
            properties.dbServerName + ':' +
            properties.dbServerPort + '/' +
            properties.dbName;
    }

    _checkIfParamIsFunction(param) {
        return typeof (param) === 'function';
    }

    _connect(collectionName, connectionSucceedCallback) {
        this.mongoClient.connect(this.url, ((error, db) => {
            if (this._checkIfParamIsFunction(connectionSucceedCallback)) {
                connectionSucceedCallback(db.db(this.dbName));
            }

            db.close();
        }).bind(this));
    }

    _getCollection(collectionName, collectionFoundCallback) {
        if (this._checkIfParamIsFunction(collectionFoundCallback)) {
            this._connect(collectionName, (db) => {
                let collection = db.collection(collectionName);
                collectionFoundCallback(collection);
            });
        }
    }

    createObjectId(id) {
        return new this.objectId(id);
    }

    findOne(id, collectionName, idFoundCallbackFunction) {
        if (this._checkIfParamIsFunction(idFoundCallbackFunction)) {
            this._getCollection(collectionName, (collection) => {
                collection.find({
                    _id: id
                }, (cursorError, cursor) => {
                    if (cursorError) {
                        console.error(cursorError);
                    }
                    else {
                        cursor.toArray((arrayError, documents) => {
                            if (arrayError) {
                                console.error(arrayError);
                            }
                            else {
                                idFoundCallbackFunction(documents[0]);
                            }
                        });
                    }
                });
        });
    }
}

insert(documents, collectionName) {
    this._getCollection(collectionName, (collection) => {
        collection.insert(document);
    });
}
}

module.exports = Mongo;