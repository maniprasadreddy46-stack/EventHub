import { useState } from "react";
import axios from "axios";
import "./App.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        formData
      );

      const user = response.data;

      // Save logged-in user details
      localStorage.setItem("studentName", user.name);
      localStorage.setItem("studentEmail", user.email);
      localStorage.setItem("studentRole", user.role);

      setMessage("Login successful! 🎉");

      // Open the correct dashboard
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data ||
        "Invalid email or password."
      );
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-content">

          <h1>Welcome Back</h1>

          <p className="register-subtitle">
            Login to your EventHub account
          </p>

          <form onSubmit={handleSubmit}>

            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="submit-registration"
            >
              Login
            </button>

          </form>

          {message && (
            <p className="registration-message">
              {message}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default Login;