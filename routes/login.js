function login(req, res, next){
res.render('login.ejs')
  }

module.exports = {
    render: login
}
