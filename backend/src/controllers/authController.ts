import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

// **User Signup**
export const signup = async (req: any, res: any) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // const existingUser = await User.findOne({ email });
    // if (existingUser)
    //   return res.status(400).json({ message: "User already exists" });
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail)
      return res
        .status(400)
        .json({ message: "User already exists with this email" });

    // Check if user already exists by username
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername)
      return res.status(400).json({ message: "Username already taken" });


    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// **User Login**
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    // if (!email || !password) {
    //   return res
    //     .status(400)
    //     .json({ message: "Email and password are required" });
    // }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found in db");
      return res.status(400).json({ message: "user not found" });
    }

    if (!user.password) {
      console.log("Google user attempting password login");
      return res.status(400).json({ message: "Please log in with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password Mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ UserId: user._id ,username: user.username, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
    // console.log("Login Successful, Token generated",token);
    res.json({ message: "Login succesfully", token, user: {username: user.username, email: user.email} });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: " Internal Server error", error: err.message });
  }
};

// export const googleAuthCallback = async (req: any, res: any) => {
//   console.log("🚀 Google Auth Callback triggered");
//   console.log("Received user from Google:", req.user);

//   if (!req.user) {
//     console.error("❌ Google authentication failed.");
//     return res.status(401).json({ message: "Google authentication failed" });
//   }

//   const googleUser = req.user as any;
//   console.log("✅ Extracted Google User:", googleUser);

//   let user = await User.findOne({ email: googleUser.email });

//   if (!user) {
//     user = new User({
//       username: googleUser.displayName,
//       email: googleUser.email,
//       googleId: googleUser.id,
//       profilePicture: googleUser.photos?.[0]?.value || "",
//     });

//     await user.save();
//     console.log("🆕 New user created:", user);
//   }

//   console.log("🔍 User found or created:", user);

//   const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
//   if (!jwtSecret) {
//     console.error("❌ JWT secret is missing");
//     return res.status(500).json({ message: "Server error" });
//   }

//   const token = jwt.sign(
//     { id: user._id, username: user.username, email: user.email },
//     jwtSecret,
//     { expiresIn: "1h" }
//   );

//   console.log("🔑 Generated Token:", token);
//   res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
// };
