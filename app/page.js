"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { fetchTodos, createTodo, toggleTodo, deleteTodo } from "@/lib/api";
import Navbar from "@/components/Navbar";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

export default function Dashboard() {
  const { user, jwt, loading: authLoading } = useAuth();
  const router = useRouter();

  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);

  // Load todos after auth is ready
  useEffect(() => {
    if (authLoading) return;
    if (!user || !jwt) {
      router.push("/signin");
      return;
    }
    loadTodos();
  }, [authLoading, user, jwt]);

  async function loadTodos() {
    setFetching(true);
    try {
      const data = await fetchTodos(jwt);
      setTodos(data);
      console.log(data);
    } catch (err) {
      toast.error("Could not load your todos. Please refresh.");
    } finally {
      setFetching(false);
    }
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const todo = await createTodo(jwt, {
        title: newTitle.trim(),
        userId: user.id,
      });
      setTodos((prev) => [todo, ...prev]);
      setNewTitle("");
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to add todo.");
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(todo) {
    try {
      await toggleTodo(jwt, todo.id, !todo.isCompleted);

      await loadTodos();

      toast.success("Task updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update todo.");
    }
  }

  async function handleDelete(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(jwt, id);
      toast.success("Task deleted!");
    } catch (err) {
      loadTodos(); // reload on failure
      toast.error(err.message || "Failed to delete todo.");
    }
  }

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction Section */}
        <div className="mb-12">
          <div className="bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 sm:p-12 text-white">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Welcome to TaskFlow
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 max-w-2xl">
              Your personal task management companion designed to help you stay
              organized, focused, and productive. Plan your day, track your
              progress, and accomplish your goals with ease.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl mb-2">📝</div>
                <h3 className="font-semibold mb-1">Create Tasks</h3>
                <p className="text-sm text-blue-100">
                  Add unlimited tasks and stay on top of your responsibilities
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-2xl mb-2">✓</div>
                <h3 className="font-semibold mb-1">Track Progress</h3>
                <p className="text-sm text-blue-100">
                  Mark tasks as complete and celebrate your wins
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Todo Management Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Manage Your Tasks
          </h2>

          {/* Form Section */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Add a New Task
            </h3>
            <TodoForm
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              onSubmit={handleAddTodo}
              isLoading={adding}
            />
          </div>

          {/* Todo List Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Your Tasks
            </h3>
            <TodoList
              todos={todos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              isLoading={false}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
