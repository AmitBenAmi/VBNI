class Route {
    _init(app, routingName, method, routingFunction) {
        app[method]('/' + routingName, routingFunction);
    }

    get(app, routingName, routingFunction) {
        this._init(app, routingName, 'get', routingFunction);
    }

    post(app, routingName, routingFunction) {
        this._init(app, routingName, 'post', routingFunction);
    }
}

module.exports = Route;