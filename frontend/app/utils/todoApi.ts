
import API from "./api";
import { getToken } from "./auth";

export async function fetchTodos() {
  try {
    const token = getToken();
    const res = await API.get("/todos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return [];
  }
}

export async function addTodo(title: string, userId: string) {
  try {
    const token = getToken();
    const res = await API.post(
      "/todos",
      { title, user: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.todo;
  } catch (error) {
    console.error("Error adding todo:", error);
    return null;
  }
}

export async function updateTodo(
  todoId: string,
  title: string,
  userId: string
) {
  try {
    const token = getToken();
    const res = await API.put(
      `/todos/${todoId}`,
      { title, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.todo;
  } catch (error) {
    console.error("Error updating todo:", error);
    return null;
  }
}

export async function deleteTodo(todoId: string, userId: string) {
  try {
    const token = getToken();
    await API.delete(`/todos/${todoId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { userId },
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}
