import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
  
    if (!token) return next(errorHandler(401, "Unauthorized"));
  
    //actually here we use id of the user to verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(403, "Forbidden"));
      //This makes the user information available to any subsequent middleware functions and route handlers.
      req.user = user; // we can use this in update and delete user controllers
      // { id: '6669da0690843450770001f2', iat: 1718306411 }
      // console.log(user, req.user); both are same
      next();
    });
  };
  