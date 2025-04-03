import express, { Request, Response } from "express";
import TodoModel from "../models/Todo";
import Todo from "../models/Todo";

const router = express.Router();

// Add a new To-Do
router.post("/todos", async (req: Request, res: Response) => {
  const { title, description, status,progress } = req.body;


  try {
    const newTodo = new TodoModel({ title, description,status,progress });
    
    const savedTask = await newTodo.save();
    res
      .status(201)
      .json({ message: "Todo created successfully", todo: savedTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to create todo", error });
  }
});

// Get all To-Dos
router.get("/todos", async (req: Request, res: Response) => {
  try {
    const todos = await TodoModel.find().sort({ pinned: -1, createdAt: -1 });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve todos", error });
  }
});


router.delete("/todos/:id", async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const deletedTask = await Todo.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});


// router.put("/todos/:id", async (req: any, res: any) => {
//   const { id } = req.params;
//   const { title, completed } = req.body;

//   try {
//     const updatedTask = await Todo.findByIdAndUpdate(
//       id,
//       { title, completed },
//       { new: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     res.json(updatedTask);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating task", error });
//   }
// });

// Update a To-Do
router.put("/todos/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const { title, description, status, progress } = req.body;  // Make sure all fields are included

  try {
    const updatedTask = await Todo.findByIdAndUpdate(
      id,
      { title, description, status, progress },  // Update all the fields
      { new: true }  // Ensure it returns the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

router.put("/todos/:id/pin", async (req:any, res:any) => {
  try {
    const task = await Todo.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.pinned = !task.pinned; // Toggle the pin status
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
