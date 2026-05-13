"use client";

import { useEffect, useState } from "react";
import { createSubTodo, fetchSubTodos } from "@/lib/api";
import SubTodoItem from "./SubTodoItem";

export default function SubTodoList({ todo, jwt }) {
  const [subTodos, setSubTodos] = useState(() => todo?.subTodos || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSubTodoTitle, setNewSubTodoTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded || !jwt || !todo?.id) return;

    let ignore = false;

    async function loadSubTodos() {
      setIsLoading(true);
      try {
        const data = await fetchSubTodos(jwt, todo.id);
        if (!ignore) {
          setSubTodos(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("[SubTodoList] Error fetching SubTodos:", error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSubTodos();

    return () => {
      ignore = true;
    };
  }, [isExpanded, jwt, todo?.id]);

  const handleAddSubTodo = async (e) => {
    e.preventDefault();

    if (!newSubTodoTitle.trim()) {
      alert("Please enter a SubTodo title");
      return;
    }

    setIsCreating(true);
    try {
      console.log(
        "[SubTodoList] Creating SubTodo with todoId:",
        todo.id,
        "title:",
        newSubTodoTitle,
      );
      const newSubTodo = await createSubTodo(jwt, todo.id, {
        title: newSubTodoTitle,
      });
      console.log("[SubTodoList] SubTodo created successfully:", newSubTodo);
      setSubTodos((current) => [newSubTodo, ...current]);
      setNewSubTodoTitle("");
    } catch (error) {
      console.error("[SubTodoList] Error creating SubTodo:", error);
      alert("Failed to create SubTodo: " + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubTodoUpdate = (updatedSubTodo) => {
    setSubTodos((current) =>
      current.map((s) => (s.id === updatedSubTodo.id ? updatedSubTodo : s)),
    );
  };

  const handleSubTodoDelete = (deletedId) => {
    setSubTodos((current) => current.filter((s) => s.id !== deletedId));
  };

  const completedCount = subTodos.filter((s) => s?.isCompleted).length;
  const hasSubTodos = subTodos.length > 0;

  return (
    <div className="mt-4 px-4 pb-4 border-t border-gray-100 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-3 transition"
      >
        <span className="text-lg">{isExpanded ? "▼" : "▶"}</span>
        <span className="uppercase tracking-wide">
          Subtasks {hasSubTodos && `(${completedCount}/${subTodos.length})`}
        </span>
      </button>

      {isExpanded && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="space-y-2 py-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : !hasSubTodos ? (
            <p className="py-2 text-xs text-gray-500">No subtasks yet.</p>
          ) : (
            <div className="space-y-2">
              {subTodos.map((subTodo) => (
                <SubTodoItem
                  key={subTodo?.id}
                  subTodo={subTodo}
                  jwt={jwt}
                  onUpdate={handleSubTodoUpdate}
                  onDelete={handleSubTodoDelete}
                />
              ))}
            </div>
          )}

          <form
            onSubmit={handleAddSubTodo}
            className="flex gap-2 mt-4 pt-3 border-t border-blue-100"
          >
            <input
              type="text"
              value={newSubTodoTitle}
              onChange={(e) => setNewSubTodoTitle(e.target.value)}
              placeholder="Add a subtask..."
              disabled={isCreating}
              className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-xs text-black focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 disabled:bg-black transition"
            />
            <button
              type="submit"
              disabled={isCreating || !newSubTodoTitle.trim()}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {isCreating ? "..." : "+"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
