
/*
 * GET game page
 */

exports.game = function(req, res){
  res.render('gameMod', { title: 'The Eco.Sys game' });
};