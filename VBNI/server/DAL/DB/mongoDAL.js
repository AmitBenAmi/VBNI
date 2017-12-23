const mongo = require('mongodb');
const DbProperties = require('../Configs/db')

class MongoDAL {
    constructor() {
        this.objectId = mongo.ObjectID;
        this.mongoClient = mongo.MongoClient;
        
        let dbProperties = new DbProperties();
        dbProperties.read();
        this._createUrl(dbProperties);
        this.dbName = dbProperties.dbName;
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

    find(collectionName, foundCallbackFunction) {
        this.findByProperties({}, collectionName, foundCallbackFunction);
    }

    findByProperties(properties, collectionName, foundCallbackFunction) {
        if (this._checkIfParamIsFunction(foundCallbackFunction)) {
            this._getCollection(collectionName, (collection) => {
                collection.find(properties).toArray((error, documents) => {
                    if (error) {
                        console.error(error);
                    }
                    else {
                        foundCallbackFunction(documents);
                    }
                });
            });
        }
    }

    findById(id, collectionName, idFoundCallbackFunction) {
        if (this._checkIfParamIsFunction(idFoundCallbackFunction)) {
            this.findByProperties({_id:id}, collectionName, (documents) => {
                if (documents[0]) {
                    idFoundCallbackFunction(documents[0]);
                }
            });
        }
    }

    insert(documents, collectionName) {
        this._getCollection(collectionName, (collection) => {
            collection.insert(document);
        });
    }
}

module.exports = MongoDAL;