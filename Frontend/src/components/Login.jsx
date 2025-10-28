import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/login", { username, password });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen min-w-screen">
      {/* Left side - welcome message */}
      <div className="w-1/2 bg-blue-600 text-white flex items-center justify-center p-10">
        <h1 className="text-5xl font-bold leading-snug">
          Welcome to <br />
          <span className="text-yellow-300">Application Portal</span>
        </h1>
      </div>

      {/* Right side - login form */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg *:text-black">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Login
          </h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>

          {/* <p className="text-sm text-gray-500 mt-4 text-center">
            Forgot password? <a href="#" className="text-blue-600">Click here</a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
