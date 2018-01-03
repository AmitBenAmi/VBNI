const LoginRouter = require('./login');
const GroupRouter = require('./group');
const ReferralRouter = require('./referral');

class Api {
    register(app) {
        let routers = this._createRouters(app);

        for (let index = 0; index < routers.length; index++) {
            routers[index].init();
        }
    }

    _createRouters(app) {
        let routers = [];
        routers.push(new LoginRouter(app));
        routers.push(new GroupRouter(app));
        routers.push(new ReferralRouter(app));

        return routers;
    }
}

module.exports = Api;