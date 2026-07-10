/**
 * Helper to get authorization headers for backend API requests.
 */
export const getAuthHeaders = (isPostOrPut = false) => {
  const savedUser = localStorage.getItem("current_user");
  const headers = {};

  if (isPostOrPut) {
    headers["Content-Type"] = "application/json";
  }

  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed && parsed.token) {
        headers["Authorization"] = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error("Failed to parse user for auth headers", e);
    }
  }

  return headers;
};
