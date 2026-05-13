"use client";

import SubTodoList from "./SubTodoList";

export default function TodoItem({ todo, onToggle, onDelete, jwt }) {
  const { title, isCompleted } = todo;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-4 px-4 py-3.5 group">
        {/* Checkbox toggle */}
        <button
          onClick={() => onToggle(todo)}
          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
            isCompleted
              ? "bg-green-500 border-green-500 shadow-sm"
              : "border-gray-300 hover:border-blue-400 hover:scale-110"
          }`}
          aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
        >
          {isCompleted && (
            <svg
              className="w-3.5 h-3.5 text-white"
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
          className={`flex-1 text-sm transition-all ${
            isCompleted
              ? "line-through text-gray-500"
              : "text-gray-900 font-medium"
          }`}
        >
          {title}
        </span>

        {/* Status badge */}
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isCompleted ? "✓ Done" : "◯ Pending"}
        </span>

        {/* Delete button */}
        <button
          onClick={() => onDelete(todo.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          aria-label="Delete task"
        >
          <svg
            className="w-5 h-5"
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

      {/* SubTodoList */}
      {jwt && <SubTodoList todo={todo} jwt={jwt} />}
    </div>
  );
}
