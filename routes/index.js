
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'The game', token: req.access_token });
};
