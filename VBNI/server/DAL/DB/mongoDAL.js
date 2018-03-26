const mongo = require('mongodb');
const DbProperties = require('../Configs/db')
const mongoPushField = '$push';
const mongoPullField = '$pull';
const mongoSetField = '$set';
const mongoUnsetField = '$unset';
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
        var userString = "";
        if (properties.dbUser) {
            userString = properties.dbUser + ':' +
                         properties.dbPassword + '@';
        }

        this.url =
            'mongodb://' +
            userString +
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

    checkIfObjectId(id) {
        return typeof(id) === 'object' && id._bsontype && id._bsontype === 'ObjectID';
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
                    successCb(results.result.nModified);
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

    _updateMany(collection, query, operation, field, errorCb, successCb) {
        collection.update(
            query,
            operation,
            {multi: true},
            this._updateCallback(collection.collectionName, field, errorCb, successCb));
    }

    update(collectionName, query, updateDoc, errorCb, successCb) {
        this._getCollection(collectionName, (collection) => {
            let updateOperation = {
                [mongoSetField]: updateDoc
            }
            this._update(collection, query, updateOperation, undefined, errorCb, successCb);
        });
    }

    unsetMany(collectionName, ids, updateDoc, errorCb, successCb) {
        this._getCollection(collectionName, (collection) => {
            let updateOperation = {
                [mongoUnsetField]: updateDoc
            };

            this._updateMany(collection, {_id: {[mongoInField]: ids}}, updateOperation, undefined, errorCb, successCb);
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

    find(collectionName, foundCallbackFunction, errorCb) {
        this.findByProperties({}, collectionName, foundCallbackFunction, errorCb);
    }

    deleteById(id, collectionName, errorCb, successCb) {
        this._getCollection(collectionName, (collection) => {
            try {
                collection.deleteOne({_id: id});

                if (this._checkIfFunction(successCb)) {
                    successCb();
                }
            }
            catch (e) {
                console.error(e);

                if (this._checkIfFunction(errorCb)) {
                    errorCb(e);
                }
            }
        });
    }

    findByProperties(properties, collectionName, foundCallbackFunction, errorCb) {
        if (this._checkIfFunction(foundCallbackFunction)) {
            this._getCollection(collectionName, (collection) => {
                collection.find(properties).toArray((error, documents) => {
                    if (error) {
                        console.error(error);

                        if (this._checkIfFunction(errorCb)) {
                            errorCb(error);
                        }
                    }
                    else if (this._checkIfFunction(foundCallbackFunction)) {
                        foundCallbackFunction(documents);
                    }
                });
            });
        }
    }

    countByProperties(properties, collectionName, foundCallbackFunction, errorCb) {
        if (this._checkIfFunction(foundCallbackFunction)) {
            this._getCollection(collectionName, (collection) => {
                collection.find(properties).count(function (error, count) {
                    if (error) {
                        console.error(error);

                        if (this._checkIfFunction(errorCb)) {
                            errorCb(error);
                        }
                    }
                    else {
                        foundCallbackFunction(count);
                    }
                });
            });
        }
    }

    findById(id, collectionName, idFoundCallbackFunction, idNotFoundCallbackFunction, erroCb) {
        if (this._checkIfFunction(idFoundCallbackFunction)) {
            this.findByProperties({_id:id}, collectionName, (documents) => {
                if (documents[0]) {
                    if (this._checkIfFunction(idFoundCallbackFunction)) {
                        idFoundCallbackFunction(documents[0]);
                    }
                }
                else if (this._checkIfFunction(idNotFoundCallbackFunction)) {
                    idNotFoundCallbackFunction();
                }
            }, (error) => {
                if (this._checkIfFunction(idNotFoundCallbackFunction)) {
                    errorCb(error);
                }
            });
        }
    }

    insert(documents, collectionName, errorCb, successCb) {
        this._getCollection(collectionName, (collection) => {
            try {
                collection.insert(documents);

                if (this._checkIfFunction(successCb)) {
                    successCb();
                }
            }
            catch (e) {
                console.error(e);

                if (this._checkIfFunction(errorCb)) {
                    errorCb(e);
                }
            }
        });
    }
}

module.exports = MongoDAL;