"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";

interface Image {
  _id: string;
  imageData: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "Start" | "In Progress" | "Completed";
  progress: number;
  pinned?: boolean;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [imageList, setImageList] = useState<Image[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Omit<Task, "_id">>({
    title: "",
    description: "",
    status: "Start",
    progress: 0,
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
        }
      };
    }
    setImage("");
  };

  const uploadImage = async () => {
    if (!image) return alert("Please select an image");

    try {
      await axios.post("http://localhost:5000/api/upload", {
        imageData: image,
      });
      alert("Image uploaded successfully!");
      setImage("");
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      console.log("Deleting image with ID:", id);
      const response = await axios.delete(
        `http://localhost:5000/api/images/${id}`
      );
      console.log(response.data);
      setImageList(imageList.filter((img) => img._id !== id));
    } catch (error) {
      console.error("Error deleting image", error);
    }
  };

  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    fetchTasks();
    const storedUser = localStorage.getItem("user");
    // console.log("Stored User:", storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }
  }, []);

  const viewImages = async () => {
    setShowImages((prev) => !prev);
    console.log("showImages updated to:", !showImages); // Debugging log

    if (!showImages) {
      try {
        const { data } = await axios.get("http://localhost:5000/api/images");
        setImageList(data);
      } catch (error) {
        console.error("Error fetching images", error);
      }
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/todos");
      console.log("Fetched todos:", response.data);
      // setTasks(response.data);
      setTasks(
        response.data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        const updatedTask = { ...newTask, _id: editingTask._id };

        const response = await axios.put(
          `http://localhost:5000/api/todos/${editingTask._id}`,
          updatedTask
        );

        if (response.status === 200) {
          // Update the local state with the updated task
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === editingTask._id ? response.data : task
            )
          );
        } else {
          alert("Failed to update task on the server.");
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/todos",
          newTask
        );

        if (response.status === 200) {
          // setTasks((prevTasks) => [...prevTasks, response.data]);
          console.log("tasks", tasks);
          const createdTask: Task = response.data;
          setTasks((prevTasks) => {
            const updatedTasks = [...prevTasks, createdTask];

            return updatedTasks.sort(
              (a: any, b: any) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
          });
        } else {
          alert("Refresh the page to see the added task.");
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error saving task", error);
      alert("An error occurred while saving the task.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setNewTask({ ...task });
    } else {
      setEditingTask(null);
      setNewTask({ title: "", description: "", status: "Start", progress: 0 });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const togglePin = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}/pin`);
      fetchTasks();
    } catch (error) {
      console.error("Error toggling pin status", error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {loading ? (
        <h3>Loading...</h3> // Display loading while fetching user
      ) : (
        <h3 className="text-primary">
          Welcome Back, {user?.username || "Guest"}! 👋
        </h3>
      )}
      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={() => openModal()}>
            Add Task
          </button>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 mb-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="form-control w-50"
        />
        <button className="btn btn-success" onClick={uploadImage}>
          Upload Image
        </button>
        <button className="btn btn-info" onClick={viewImages}>
          {showImages ? "Hide Images" : "View Images"}
        </button>
      </div>

      {showImages && imageList.length > 0 && (
        <div className="image-gallery my-3">
          {imageList.map((img) => (
            <div key={img._id} className="image-item ">
              <img
                src={img.imageData}
                alt="Uploaded"
                className="uploaded-image"
              />
              <button
                className="btn btn-danger btn-sm m-2"
                onClick={() => deleteImage(img._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingTask ? "Edit Task" : "Add Task"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <select
                  className="form-select mb-2"
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value as Task["status"],
                    })
                  }
                >
                  <option value="Start">Start</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={newTask.progress}
                  onChange={(e) => {
                    const progress = Number(e.target.value);
                    // Clamp the progress between 0 and 100
                    if (progress >= 0 && progress <= 100) {
                      setNewTask({ ...newTask, progress });
                    } else if (progress > 100) {
                      setNewTask({ ...newTask, progress: 100 });
                    } else {
                      setNewTask({ ...newTask, progress: 0 });
                    }
                  }}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleSaveTask}>
                  {editingTask ? "Update" : "Add"} Task
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ul className="todo-list">
        {tasks
          .filter(
            (task) =>
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              task.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((task) => (
            <li key={task._id} className="todo-item position-relative mb-3">
              <button
                className={`btn position-absolute top-0 end-0 m-2 ${
                  task.pinned ? "btn-success" : "btn-light"
                }`}
                onClick={() => togglePin(task._id)}
              >
                {task.pinned ? "📌" : "📌"}
              </button>
              <h5>{task.title}</h5>
              <p>{task.description}</p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <p>
                <strong>Progress:</strong> {task.progress}%
              </p>
              <button
                className="btn btn-warning me-2"
                onClick={() => openModal(task)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
