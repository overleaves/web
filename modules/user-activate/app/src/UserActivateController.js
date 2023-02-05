const Path = require('path')
const UserGetter = require('../../../../app/src/Features/User/UserGetter')
const ErrorController = require('../../../../app/src/Features/Errors/ErrorController')

module.exports = {
  ssoAccountPage(req, res, next) {
    // An 'activation' is actually just a password reset on an account that
    // was set with a random password originally.
    if (req.query.user_email == null || req.query.token == null) {
      return ErrorController.notFound(req, res)
    }

    if (typeof req.query.user_email !== 'string') {
      return ErrorController.forbidden(req, res)
    }

    UserGetter.getUserByMainEmail(
      req.query.user_email,
      { email: 1, loginCount: 1 },
      (error, user) => {
        if (error != null) {
          return next(error)
        }
        if (!user) {
          // Create user
        }
        if (user.loginCount > 0) {
          // Already seen this user, so account must be activate
          // This lets users keep clicking the 'activate' link in their email
          // as a way to log in which, if I know our users, they will.
          res.redirect(`/login`)
        } else {
          req.session.doLoginAfterPasswordReset = true
          res.render(Path.resolve(__dirname, '../views/user/activate'), {
            title: 'activate_account',
            email: user.email,
            token: req.query.token,
          })
        }
      }
    )
  },
  activateAccountPage(req, res, next) {
    // An 'activation' is actually just a password reset on an account that
    // was set with a random password originally.
    if (req.query.user_id == null || req.query.token == null) {
      return ErrorController.notFound(req, res)
    }

    if (typeof req.query.user_id !== 'string') {
      return ErrorController.forbidden(req, res)
    }

    UserGetter.getUser(
      req.query.user_id,
      { email: 1, loginCount: 1 },
      (error, user) => {
        if (error != null) {
          return next(error)
        }
        if (!user) {
          return ErrorController.notFound(req, res)
        }
        if (user.loginCount > 0) {
          // Already seen this user, so account must be activate
          // This lets users keep clicking the 'activate' link in their email
          // as a way to log in which, if I know our users, they will.
          res.redirect(`/login`)
        } else {
          req.session.doLoginAfterPasswordReset = true
          res.render(Path.resolve(__dirname, '../views/user/activate'), {
            title: 'activate_account',
            email: user.email,
            token: req.query.token,
          })
        }
      }
    )
  },
}
