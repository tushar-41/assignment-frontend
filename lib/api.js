const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL;

// Auth //

export async function signUp({ username, email, password }) {
  const res = await fetch(`${STRAPI}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Sign up failed");
  return data; // { jwt, user }
}

export async function signIn({ identifier, password }) {
  const res = await fetch(`${STRAPI}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Sign in failed");
  return data; // { jwt, user }
}

// Todos //

export async function fetchTodos(jwt, userId) {
  console.log("jwt:", jwt);
  console.log("userId:", userId);
  const res = await fetch(`${STRAPI}/api/todos?sort=createdAt:desc`, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to fetch todos");
  return data.data; // array of todo objects
}

export async function createTodo(jwt, { title, userId }) {
  const res = await fetch(`${STRAPI}/api/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      data: {
        title,
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Failed to create todo");
  console.log("createTodo response:", data.data);
  return data.data;
}

export async function toggleTodo(jwt, id, isCompleted) {
  const res = await fetch(`${STRAPI}/api/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ data: { isCompleted } }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Failed to update todo");
  console.log("toggleTodo response:", data.data);
  return data.data;
}

export async function deleteTodo(jwt, id) {
  const res = await fetch(`${STRAPI}/api/todos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${jwt}` },
  });

  // 204 No Content is a successful response with no body
  if (res.status === 204) {
    console.log("deleteTodo response: success (204 No Content)");
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Failed to delete todo");
  console.log("deleteTodo response:", data);
}
