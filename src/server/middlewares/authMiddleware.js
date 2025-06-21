export const adminOnly = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
      next();
    } else {
      res.redirect('/login');
    }
  };
  