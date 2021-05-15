/*
  Routes
*/


// Controllers
const pingController        =     require('../controllers/ping');
const userController        =     require('../controllers/user');
const productController     =     require('../controllers/product');
const shopcartController    =     require('../controllers/shopcart');
const orderController       =     require('../controllers/order');
const paymentController     =     require('../controllers/payment');

// Container for routes
const routers               =     {};

// Ping
routers.ping                =     (req, res, arrPath) => pingController.ping(req, res, arrPath);
// User get
routers.me                  =     (req, res, arrPath) => userController.get(req, res, arrPath);
// User add
routers.user_add            =     (req, res, arrPath) => userController.add(req, res, arrPath);
// User update
routers.user_update         =     (req, res, arrPath) => userController.update(req, res, arrPath);
// User delete
routers.user_delete         =     (req, res, arrPath) => userController.delete(req, res, arrPath);
// User login
routers.login               =     (req, res, arrPath) => userController.login(req, res, arrPath);
// Product list
routers.menu                =     (req, res, arrPath) => productController.controller.menu(req, res, arrPath);
// Shopcart view
routers.shopcart_view       =     (req, res, arrPath) => shopcartController.view(req, res, arrPath);
// Shopcart add
routers.shopcart_add        =     (req, res, arrPath) => shopcartController.add(req, res, arrPath);
// Shopcart update
routers.shopcart_update     =     (req, res, arrPath) => shopcartController.add(req, res, arrPath);
// Shopcart delete
routers.shopcart_delete     =     (req, res, arrPath) => shopcartController.delete(req, res, arrPath);
// Order view
routers.order_view          =     (req, res, arrPath) => orderController.view(req, res, arrPath);
// Order add
routers.order_add           =     (req, res, arrPath) => orderController.add(req, res, arrPath);
// Paymento
routers.payment             =     (req, res, arrPath) => paymentController.pay(req, res, arrPath);

// Export the module
module.exports = routers;