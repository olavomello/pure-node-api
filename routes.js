/*
  Routes
*/


// Dependencies.
// const notFoundController  =   require('./controllers/notFound');
// const tokenController     =   require('./controllers/token');

const pingController         =   require('./controllers/ping');
const userController         =   require('./controllers/user');


// Container for routes
const routers = {};

// Ping
routers.ping    = (req, res) => pingController(req, res);
// User get
routers.user    = (req, res) => userController.get(req, res);
// User add
routers.useradd = (req, res) => userController.add(req, res);

// Token
// routers.token = pingController(req, res);

// Export the module.
module.exports = routers;