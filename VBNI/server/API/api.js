class Api {
    register(app) {
        const LoginRouter = require('./login');
        let loginRouter = new LoginRouter();
        loginRouter.init(app);
    }
}

module.exports = Api;