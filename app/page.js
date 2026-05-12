"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchTodos, createTodo, toggleTodo, deleteTodo } from "@/lib/api";

export default function Dashboard() {
  const { user, jwt, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [fetching, setFetching] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
    try {
      const data = await fetchTodos(jwt, user.id);
      setTodos(data);
    } catch {
      setError("Could not load your todos. Please refresh.");
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
    } catch {
      setError("Failed to add todo.");
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(todo) {
    const optimistic = todos.map((t) =>
      t.id === todo.id
        ? {
            ...t,
            attributes: {
              ...t.attributes,
              isCompleted: !t.attributes.isCompleted,
            },
          }
        : t,
    );
    setTodos(optimistic);
    try {
      await toggleTodo(jwt, todo.id, !todo.attributes.isCompleted);
    } catch {
      setTodos(todos); // revert on failure
      setError("Failed to update todo.");
    }
  }

  async function handleDelete(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(jwt, id);
    } catch {
      loadTodos(); // reload on failure
      setError("Failed to delete todo.");
    }
  }

  function handleLogout() {
    logout();
    router.push("/signin");
  }

  if (authLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pending = todos.filter((t) => !t.attributes?.isCompleted);
  const completed = todos.filter((t) => t.attributes?.isCompleted);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">My Tasks</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.username}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
            <button onClick={() => setError("")} className="ml-2 underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Add todo form */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new task…"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="submit"
            disabled={adding || !newTitle.trim()}
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {adding ? "…" : "Add"}
          </button>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total", value: todos.length },
            { label: "Pending", value: pending.length },
            { label: "Completed", value: completed.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-100 p-4 text-center"
            >
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Todo list */}
        {todos.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm mt-1">Add your first task above</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => {
              const { title, isCompleted } = todo.attributes;
              return (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3 group"
                >
                  {/* Checkbox toggle */}
                  <button
                    onClick={() => handleToggle(todo)}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      isCompleted
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                    aria-label={
                      isCompleted ? "Mark as pending" : "Mark as completed"
                    }
                  >
                    {isCompleted && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Title */}
                  <span
                    className={`flex-1 text-sm ${
                      isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {title}
                  </span>

                  {/* Status badge */}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {isCompleted ? "Done" : "Pending"}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                    aria-label="Delete task"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 9h8l1-9"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
