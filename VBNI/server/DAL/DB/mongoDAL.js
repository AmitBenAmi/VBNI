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

    _checkIfFunction(variable) {
        return typeof (variable) === 'function';
    }

    _connect(collectionName, connectionSucceedCallback) {
        this.mongoClient.connect(this.url, ((error, db) => {
            if (this._checkIfFunction(connectionSucceedCallback)) {
                connectionSucceedCallback(db.db(this.dbName));
            }

            db.close();
        }).bind(this));
    }

    _getCollection(collectionName, collectionFoundCallback) {
        if (this._checkIfFunction(collectionFoundCallback)) {
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
                
                if (this._checkIfFunction(errorCb)) {
                    errorCb();
                }
            }
            else {
                console.log(`There are ${results.result.nModified} modifications for collection: '${collectionName}' ${field ? 'on field' + field : ''}`);

                if (this._checkIfFunction(successCb)) {
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

    update(collectionName, query, updateDoc, errorCb, successCb) {
        this._getCollection(collectionName, (collection) => {
            this._update(collection, query, updateDoc, undefined, errorCb, successCb);
        });
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

    find(collectionName, foundCallbackFunction, notFoundCallbackFunction) {
        this.findByProperties({}, collectionName, foundCallbackFunction, notFoundCallbackFunction);
    }

    findByProperties(properties, collectionName, foundCallbackFunction, notFoundCallbackFunction) {
        if (this._checkIfFunction(foundCallbackFunction)) {
            this._getCollection(collectionName, (collection) => {
                collection.find(properties).toArray((error, documents) => {
                    if (error) {
                        console.error(error);

                        if (this._checkIfFunction(notFoundCallbackFunction)) {
                            notFoundCallbackFunction(error);
                        }
                    }
                    else if (foundCallbackFunction) {
                        foundCallbackFunction(documents);
                    }
                });
            });
        }
    }

    findById(id, collectionName, idFoundCallbackFunction, idNotFoundCallbackFunction) {
        if (this._checkIfFunction(idFoundCallbackFunction)) {
            this.findByProperties({_id:id}, collectionName, (documents) => {
                if (documents[0]) {
                    if (this._checkIfFunction(idFoundCallbackFunction)) {
                        idFoundCallbackFunction(documents[0]);
                    }
                }
            }, (error) => {
                if (this._checkIfFunction(idNotFoundCallbackFunction)) {
                    idNotFoundCallbackFunction(error);
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