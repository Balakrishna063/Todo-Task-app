
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import passport from "../src/config/passport";
// import authRoutes from "./routes/authRoutes";
// import todoRoutes from "./routes/todoRoutes";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;
// app.use(express.json());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(cookieParser());

// // Express Session Middleware with a secret
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET as string, // provide secret here
//     resave: false,
//     saveUninitialized: false,
//     cookie: {secure: process.env.NODE_ENV === "production",
//     httpOnly: true,
//     maxAge: 24*60*60*1000,
//     }
//   })
// );

// // Initialize Passport Middleware
// app.use(passport.initialize());
// app.use(passport.session());
// // app.use("/api", authRoutes);

// app.use("/api", todoRoutes);
// app.use("/auth", authRoutes);
// app.use("/api/auth", authRoutes);
// const port = process.env.PORT || 5000;
// mongoose.connect(process.env.MONGO_URI as string)
//    .then(() => console.log("MongoDB connected"))
//    .catch(err => console.log(err));
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
 


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "../src/config/passport";
import authRoutes from "./routes/authRoutes";
import todoRoutes from "./routes/todoRoutes";
import imageRoutes from "./routes/imageRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Express Session Middleware with a secret
app.use(
  session({
    secret: process.env.SESSION_SECRET as string, // provide secret here
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
// app.use("/api", authRoutes);
app.use("/api", imageRoutes);
app.use("/api", todoRoutes);
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
 