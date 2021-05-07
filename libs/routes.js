/*
  Routes
*/


// Dependencies.
// const notFoundController  =   require('./controllers/notFound');
// const tokenController     =   require('./controllers/token');

const pingController         =   require('../controllers/ping');
const userController         =   require('../controllers/user');


// Container for routes
const routers = {};

// Ping
routers.ping        = (req, res, arrPath) => pingController(req, res, arrPath);
// User get
routers.me          = (req, res, arrPath) => userController.get(req, res, arrPath);
// User add
routers.useradd     = (req, res, arrPath) => userController.add(req, res, arrPath);
// User update
routers.userupdate  = (req, res, arrPath) => userController.update(req, res, arrPath);
// User delete
routers.userdelete  = (req, res, arrPath) => userController.delete(req, res, arrPath);
// User login
routers.login       = (req, res, arrPath) => userController.login(req, res, arrPath);

// Token
// routers.token = pingController(req, res);

// Export the module.
module.exports = routers;