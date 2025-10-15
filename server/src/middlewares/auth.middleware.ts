import { NextFunction, Request, Response } from "express";
import { decodedJWTToken } from "../utils/helper";
import user from "../models/user";
import { JwtPayload } from "jsonwebtoken";

// Extend Express Request to include custom properties
declare module "express-serve-static-core" {
  interface Request {
    email?: string;
    userId?: string;
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers["token"] as string | undefined;

    if (!authHeader) {
      res.status(401).json({ message: "Unauthorized access. Token missing." });
      return;
    }

    const decodedToken = decodedJWTToken(authHeader) as JwtPayload | null;

    if (!decodedToken) {
      res.status(401).json({ message: "Session expired. Please log in again." });
      return;
    }

    const userFind = await user.findOne({ "sessions.loginUser": decodedToken.sessionId });

    if (!userFind) {
      res.status(401).json({ message: "Invalid or expired session. Please log in again." });
      return;
    }

    req.email = userFind.email;
    req.userId = userFind._id.toString();

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
// const socketMiddleware = async (err:any, socket:any, next:any)=>{
//   try {
//     if(err) return next(err);

//     const authToken = socket.headers['token']

    
//   } catch (error) {
    
//   }
// }

export {authMiddleware}
