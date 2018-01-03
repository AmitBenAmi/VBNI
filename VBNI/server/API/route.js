const HttpStatusCodes = require('http-status-codes');

class Route {
    constructor(app) {
        this.app = app;
    }
    
    _init(routingName, method, routingFunction) {
        this.app[method]('/' + routingName, routingFunction);
    }

    _sendResponse(statusCode, res) {
        res.sendStatus(statusCode);
    }

    _sendOk(res) {
        this._sendResponse(HttpStatusCodes.OK, res);
    }

    _sendInternalServerError(res) {
        this._sendResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, res);
    }

    _sendBadRequest(res) {
        this._sendResponse(HttpStatusCodes.BAD_REQUEST, res);
    }

    get(routingName, routingFunction) {
        this._init(routingName, 'get', routingFunction);
    }

    post(routingName, routingFunction) {
        this._init(routingName, 'post', routingFunction);
    }

    delete(routingName, routingFunction) {
        this._init(routingName, 'delete', routingFunction);
    }
}

module.exports = Route;