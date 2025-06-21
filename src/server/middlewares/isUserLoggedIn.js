// export const isUserLoggedIn = (req, res, next) => {
//   if (req.session && req.session.isUser && req.session.userData) {
//     return next();
//   }
//   res.redirect('/user/login'); // bukan /userRegister
// };


export const isUserLoggedIn = (req, res, next) => {
  if (req.session && req.session.isUser) {
    next();
  } else {
    res.redirect('/userRegister');
  }
};
