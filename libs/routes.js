/*
  Routes
*/


// Controllers
const pingController         =   require('../controllers/ping');
const userController         =   require('../controllers/user');
const productController      =   require('../controllers/product');
const shopcartController     =   require('../controllers/shopcart');


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

// Product list
routers.menu        = (req, res, arrPath) => productController.menu(req, res, arrPath);

// Shopcart
routers.shopadd     = (req, res, arrPath) => shopcartController.add(req, res, arrPath);


// Export the module
module.exports = routers;