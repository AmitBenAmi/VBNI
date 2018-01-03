const LoginRouter = require('./login');
const MemberRouter = require('./member');
const GroupRouter = require('./group');
const ReferralRouter = require('./referral');
const MeetingRouter = require('./meeting');

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
        routers.push(new MemberRouter(app));
        routers.push(new GroupRouter(app));
        routers.push(new ReferralRouter(app));
        routers.push(new MeetingRouter(app));

        return routers;
    }
}

module.exports = Api;