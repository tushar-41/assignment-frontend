"use client";

import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete, isLoading }) {
  const pending = todos.filter((t) => !t.isCompleted);
  const completed = todos.filter((t) => t.isCompleted);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-700 mb-1">No tasks yet</p>
        <p className="text-sm text-gray-500">
          Create your first task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Total Tasks",
            value: todos.length,
            color: "blue",
            icon: "📊",
          },
          {
            label: "Pending",
            value: pending.length,
            color: "yellow",
            icon: "⏳",
          },
          {
            label: "Completed",
            value: completed.length,
            color: "green",
            icon: "✓",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-${stat.color}-50 rounded-lg border border-${stat.color}-200 p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold text-${stat.color}-700 mt-1`}>
                  {stat.value}
                </p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Tasks */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Pending Tasks ({pending.length})
          </h3>
          <ul className="space-y-2">
            {pending.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Completed Tasks ({completed.length})
          </h3>
          <ul className="space-y-2">
            {completed.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
