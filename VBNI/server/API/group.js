const Route = require('./route');
const GroupDAL = require('../DAL/DB/groupDAL');

class GroupRouter extends Route {
    init() {
        this.groupDAL = new GroupDAL();
        this.getGroups();
        this.getGroup();
    }

    getGroups() {
        super.get('group', (req, res) => {
            this.groupDAL.find((groups) => {
                res.send(groups);
            });
        });
    }

    getGroup() {
        super.get('group/:name', (req, res) => {
            this.groupDAL.findByName(req.params.name, (groups) => {
                res.send(groups);
            });
        });
    }
}

module.exports = GroupRouter;