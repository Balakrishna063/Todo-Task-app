import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any; // Attach user property to request
}

const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer Token
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as {
      id: string;
    };
    req.user = decoded; // Attach user data to request
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
    return;
  }
};

export default authMiddleware;
