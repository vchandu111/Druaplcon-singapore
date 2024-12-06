import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, email, password);

    let raw = JSON.stringify({
      data: {
        type: "user--user",
        attributes: {
          name: username,
          mail: email,
          pass: password,
        },
      },
    });

    fetch(
      "https://main-bvxea6i-dzghxlrwlqmsu.us-2.platformsh.site/jsonapi/user/user",
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
        alert("Signup Successful");
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="flex max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Panel */}
        <div className="w-full lg:w-1/2 p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username*"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="email"
              placeholder="Email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <input
              type="password"
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-lg font-medium hover:scale-105 transform transition"
            >
              Sign Up
            </button>
            <div className="text-center">
              <a href="/login" className="text-pink-500 hover:underline">
                Already have an account? Log In
              </a>
            </div>
          </form>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-pink-500 to-pink-700 items-center justify-center">
          <img
            src="https://live.templately.com/wp-content/uploads/2021/02/56468664-image_.png"
            alt="Signup Illustration"
            className="w-4/5"
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
