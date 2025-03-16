"use client";

import { useAuthStore } from "@/lib/store/index";

export const AuthDemo = () => {
  const { username, isLoggedIn, login, logout } = useAuthStore();

  const handleLogin = () => login("JohnDoe");
  const handleLogout = () => logout();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-2xl font-bold">Please log in</h2>
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Login"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h2 className="text-2xl font-bold">Welcome, {username}!</h2>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  );
};
