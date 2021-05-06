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
routers.ping    = (req, res, arrPath) => pingController(req, res, arrPath);
// User get
routers.user    = (req, res, arrPath) => userController.get(req, res, arrPath);
// User add
routers.useradd = (req, res, arrPath) => userController.add(req, res, arrPath);

// Token
// routers.token = pingController(req, res);

// Export the module.
module.exports = routers;