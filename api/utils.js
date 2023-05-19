function requireUser(req, res, next) {
  //td what does passing in this obj in next do/lead to?
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }

  next();
}

module.exports = {
  requireUser,
};
