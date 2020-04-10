function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports.getData = (userContext, events, done) => {
  let username = makeid(8);
  userContext.vars.login = JSON.stringify({
    gameID: 1,
    username: username
  });
  userContext.vars.answer = JSON.stringify({
    gameID: 1,
    username: username,
    questionID: '1',
    score: 29,
  });
  done();
};