
/*
 * GET home page.
 */

exports.index = function(req, res){
    var access_token = req.query.access_token;
    var options = {
        host: 'api.cbssports.com',
        port: 80,
        path: 'fantasy/league/teams?access_token=' + access_token + '&response_format=json'
    };

    http.get(options, function(res) {
        var data = '';
        
        res.on('data', function  (chunk) {
            data += chunk;
        });
        res.on('end', function  () {
            var obj = JSON.parse(data);
            res.render('index', { title: 'The game', teams: JSON.stringify(obj.body.teams) });
        });
    });
};
