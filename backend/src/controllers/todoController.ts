import { Request, Response } from "express";
import Todo from "../models/Todo";
import { AuthRequest } from "../middleware/authMiddleware"; 

export const createTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    
    const newTodo = new Todo({
      title,
      user: req.user.id, 
    });

    await newTodo.save();

    res.status(201).json({ success: true, todo: newTodo });
  } catch (error) {
    console.error("Error creating To-Do:", error);
    res.status(500).json({
      message: "Server error",
      errorDetails: error instanceof Error ? error.message : error,
    });
  }
};

export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    console.log("hello");
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todos = await Todo.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    console.log("✅ Todos Fetched:", todos);
    res.json(todos);
  } catch (error) {
    console.error("Error fetching To-Dos:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const putTodos = async(req: Request, res:Response) => {
  
}

export const togglePin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await Todo.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.pinned = !task.pinned;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};