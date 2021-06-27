/*
  HTML response routes
*/


// Controllers
const indexController        =     require('../controllers/html/index');

// Container for routes
const htmlRoutes             =     {};

// Index page
htmlRoutes.index             =     (req, res, arrPath) => indexController.index(req, res, arrPath);

// Export the module
module.exports = htmlRoutes;