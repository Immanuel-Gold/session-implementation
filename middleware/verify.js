export const verifyUser = (req, res, next) => {
    if (!req.session.user) {
      return res.status(409).json({ err: "UnAuthorized!" });
    }
  
    next();
  };
  