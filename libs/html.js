/*
  HTML response routes
*/


// Controllers
const engineController        =     require('../controllers/html/engine');

// Container for routes
const htmlRoutes             =     {};

// Pages
htmlRoutes.index             =     (req, res, arrPath) => engineController.index(req, res, arrPath);
htmlRoutes.account           =     (req, res, arrPath) => engineController.account(req, res, arrPath);
htmlRoutes.signup            =     (req, res, arrPath) => engineController.signup(req, res, arrPath);
htmlRoutes.login             =     (req, res, arrPath) => engineController.login(req, res, arrPath);
htmlRoutes.logout            =     (req, res, arrPath) => engineController.logout(req, res, arrPath);
htmlRoutes.shopcart          =     (req, res, arrPath) => engineController.shopcart(req, res, arrPath);

// Export the module
module.exports = htmlRoutes;