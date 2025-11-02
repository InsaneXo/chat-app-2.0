import { NextFunction, Request, Response } from "express";
import ErrorHandler, { decodedJWTToken } from "../utils/helper";
import user from "../models/user";
import { JwtPayload } from "jsonwebtoken";

// Extend Express Request to include custom properties
declare module "express-serve-static-core" {
  interface Request {
    email?: string;
    userId?: string;
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.headers["token"] as string | undefined;

    if (!authHeader) {
     return res.status(401).json({ message: "Unauthorized access. Token missing." });
      
    }

    const decodedToken = decodedJWTToken(authHeader) as JwtPayload | null;

    if (!decodedToken) {
     return res.status(401).json({ message: "Session expired. Please log in again." });
      
    }

    const userFind = await user.findOne({ "sessions.loginUser": decodedToken.sessionId });

    if (!userFind) {
     return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
      
    }

    req.email = userFind.email;
    req.userId = userFind._id.toString();

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};
const socketMiddleware = async (socket: any, next: any) => {
  try {

    const token = socket.handshake.auth.token

    if (!token) {
      return next(new ErrorHandler("Please login to access this route", 401));
    }

    const decodedToken = decodedJWTToken(token) as JwtPayload | null;

    if (!decodedToken) {
      return next(new ErrorHandler("Session expired. Please log in again.", 401))
    }

    const userFind = await user.findOne({ "sessions.loginUser": decodedToken.sessionId });

    if (!userFind) {
      return next(new ErrorHandler("Invalid or expired session. Please log in again.", 401))
    }

    socket.userId = userFind._id

    return next();
  } catch (error) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }
}

export { authMiddleware, socketMiddleware }
