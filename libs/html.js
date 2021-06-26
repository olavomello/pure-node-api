/*
  HTML response routes
*/


// Controllers
const indexController        =     require('../controllers/html/index');

// Container for routes
const htmlRoutes                  =     {};

// Ping
htmlRoutes.index                   =     (req, res, arrPath) => indexController.index(req, res, arrPath);

// Export the module
module.exports = htmlRoutes;