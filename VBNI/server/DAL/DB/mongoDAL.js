const mongo = require('mongodb');
const DbProperties = require('../Configs/db')
const mongoPushField = '$push';
const mongoPullField = '$pull';
const mongoAddToSet = '$addToSet';
const mongoEachField = '$each';
const mongoInField = '$in';

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
        try {
            return new this.objectId(id);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    }

    _updateCallback(collectionName, field, errorCb, successCb) {
        return (err, results) => {
            if (err) {
                console.error(err);
                
                if (this._checkIfParamIsFunction(errorCb)) {
                    errorCb();
                }
            }
            else {
                console.log(`There are ${results.result.nModified} modifications for collection: '${collectionName}' on field: '${field}'`);

                if (this._checkIfParamIsFunction(successCb)) {
                    successCb();
                }
            }
        };
    }

    _update(collection, query, operation, field, errorCb, successCb) {
        collection.update(
            query, 
            operation, 
            this._updateCallback(collection.collectionName, field, errorCb, successCb));
    }

    push(query, field, values, collectionName, errorCb, successCb) {
        this._getCollection(collectionName, (collection) => {
            let updateOperation = {
                [mongoPushField]: {
                    [field]: {
                        [mongoEachField]: values
                    }
                }
            };
            
            this._update(collection, query, updateOperation, field, errorCb, successCb);
        });
    }

    pushUnique(query, field, values, collectionName, errorCb, successCb) {
        this._getCollection(collectionName, (collection) => {
            let updateOperation = {
                [mongoAddToSet]: {
                    [field]: {
                        [mongoEachField]: values
                    }
                }
            };
            
            this._update(collection, query, updateOperation, field, errorCb, successCb);
        });
    }
    
    pull(query, field, values, collectionName, errorCb, successCb) {
        this._getCollection(collectionName, (collection) => {
            let updateOperation = {
                [mongoPullField]: {
                    [field]: {
                        [mongoInField]: values
                    }
                }
            };

            this._update(collection, query, updateOperation, field, errorCb, successCb);
        });
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