import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);

    let raw = JSON.stringify({
      name: username,
      pass: password,
    });
    fetch(
      "https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site/user/login?_format=json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/vnd.api+json",
        },
        body: raw,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("csrf_token", data.csrf_token);
        localStorage.setItem("logout_token", data.logout_token);
        localStorage.setItem("username", data.current_user.name);
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex justify-center items-center min-h-screen  px-4">
      <div className="flex max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Right Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-pink-700 to-pink-500 items-center justify-center">
          <img
            src="https://live.templately.com/wp-content/uploads/2021/02/56468664-image_.png"
            alt="Login Illustration"
            className="w-4/5"
          />
        </div>

        {/* Left Panel */}
        <div className="w-full lg:w-1/2 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-lg font-medium hover:scale-105 transform transition"
            >
              Sign In
            </button>
            <div className="text-center">
              <a href="/signup" className="text-pink-500 hover:underline">
                Don't have an account? Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
