'use strict';


var IndexModel = require('../models/index');


module.exports = function (router) {

    var model = new IndexModel();

    router.get('/', function (req, res) {
        res.render(req.url, model);
    });

    router.get('/server', function(req, res) {
        res.render('server', model);
    });

};
