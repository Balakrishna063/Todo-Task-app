import express from "express";
import { signup, login } from "../controllers/authController";
import Todo from "../models/Todo";
import authMiddleware from "../middleware/middleware"; // ✅ Protect Route
import passport from "passport";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/User";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const { title } = req.body;
    
    const newTodo = new Todo({ title, userId: req.user.id }); // ✅ Save To-Do with User ID
    await newTodo.save();
    res.status(201).json({ message: "To-Do added", todo: newTodo });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/", authMiddleware, async (req: any, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }); // ✅ Fetch todos only for the logged-in user
    res.status(200).json(todos);
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    if (req.user) {
      const { user, token } = req.user as any;
      
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    } else {
      res.redirect("/auth/failure");
    }
  }
);

// Authentication failure route
router.get("/failure", (req, res) => {
  res.status(401).json({ message: "Google Authentication Failed" });
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});


export default router;


// import express from "express";
// import { signup, login } from "../controllers/authController";
// import Todo from "../models/Todo";
// import authMiddleware from "../middleware/middleware";
// import passport from "passport";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);

// // ✅ Secure Route for Adding a Todo
// router.post("/", authMiddleware, async (req: any, res) => {
//   try {
//     const { title } = req.body;
//     const newTodo = new Todo({ title, userId: req.user.id });
//     await newTodo.save();
//     res.status(201).json({ message: "To-Do added", todo: newTodo });
//   } catch (err: any) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ✅ Secure Route for Fetching Todos
// router.get("/", authMiddleware, async (req: any, res) => {
//   try {
//     const todos = await Todo.find({ userId: req.user.id });
//     res.status(200).json(todos);
//   } catch (err: any) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

// // ✅ Google OAuth Authentication Route
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // ✅ Google OAuth Callback Route (Fix)
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/auth/failure" }),
//   (req, res) => {
//     if (!req.user) {
//       return res.redirect("/auth/failure");
//     }

//     // Extract user details
//     const user = req.user as any;

//     // ✅ Generate JWT Token
//     const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
//     const token = jwt.sign(
//       { id: user.id, email: user.email, username: user.username },
//       jwtSecret,
//       { expiresIn: "1d" }
//     );

//     // ✅ Redirect to Frontend with Token
//     const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
//     res.redirect(`${frontendURL}/auth/success?token=${token}`);
//   }
// );

// // ✅ Authentication Failure Route
// router.get("/auth/failure", (req, res) => {
//   res.status(401).json({ message: "Google Authentication Failed" });
// });

// // ✅ Logout Route
// router.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) return res.status(500).json({ message: "Logout failed" });
//     res.json({ message: "Logged out successfully" });
//   });
// });

// export default router;
