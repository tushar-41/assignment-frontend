"use client";

import { useState } from "react";
import { toggleSubTodo, deleteSubTodo } from "@/lib/api";

export default function SubTodoItem({ subTodo, jwt, onUpdate, onDelete }) {
  const [isLoading, setIsLoading] = useState(false);

  // Handle missing fields gracefully
  const id = subTodo?.id;
  const title = subTodo?.title || "Untitled SubTask";
  const isCompleted = subTodo?.isCompleted || false;

  if (!id) {
    return null; // Skip rendering if no ID
  }

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const updatedSubTodo = await toggleSubTodo(jwt, id, !isCompleted);
      onUpdate(updatedSubTodo);
    } catch (error) {
      console.error("Error toggling SubTodo:", error);
      alert("Failed to toggle SubTodo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this subtask?")) return;

    setIsLoading(true);
    try {
      await deleteSubTodo(jwt, id);
      onDelete(id);
    } catch (error) {
      console.error("Error deleting SubTodo:", error);
      alert("Failed to delete SubTodo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-blue-50 rounded-lg border border-blue-100 px-3 py-2.5 group hover:border-blue-200 hover:shadow-sm transition-all">
      {/* Checkbox toggle */}
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
          isCompleted
            ? "bg-green-500 border-green-500 shadow-sm"
            : "border-gray-300 hover:border-blue-400 hover:scale-110"
        } disabled:opacity-50`}
        aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
      >
        {isCompleted && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
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
        className={`flex-1 text-xs transition-all ${
          isCompleted
            ? "line-through text-gray-400"
            : "text-gray-700 font-medium"
        }`}
      >
        {title}
      </span>

      {/* Status badge */}
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all whitespace-nowrap ${
          isCompleted
            ? "bg-green-100 text-green-700"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        {isCompleted ? "✓" : "○"}
      </span>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-all disabled:opacity-50"
        aria-label="Delete subtask"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
