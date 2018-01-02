class Route {
    constructor(app) {
        this.app = app;
    }
    
    _init(routingName, method, routingFunction) {
        this.app[method]('/' + routingName, routingFunction);
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