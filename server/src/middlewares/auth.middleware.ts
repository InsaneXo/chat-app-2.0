import { NextFunction, Request, Response } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
    
    try {
        // Check for token in headers
        const authHeader = req.headers["token"];

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        console.log("Token received:", authHeader);

        // Later you can verify the token with jwt.verify(authHeader, secret)
        next();
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export default auth;
