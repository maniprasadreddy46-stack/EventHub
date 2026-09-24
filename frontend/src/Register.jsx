import { useState } from "react";
import axios from "axios";

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/users/register",
        formData
      );

      setMessage("Account created successfully! 🎉");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
      });

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Create Account
        </h1>

        <p style={styles.subtitle}>
          Register as a student
        </p>

        <form onSubmit={handleRegister}>

          <label style={styles.label}>
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={styles.button}
          >
            Create Account
          </button>

        </form>

        {message && (
          <p style={styles.message}>
            {message}
          </p>
        )}

        <button
    type="button"
    onClick={onLogin}
    style={{
      marginTop: "15px",
      background: "none",
      border: "none",
      color: "#6366f1",
       fontSize: "16px",
       fontWeight: "600",
       cursor: "pointer",
     }}
     >
        Already have an account? Login
     </button>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "430px",
    background: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "8px",
    color: "#111827",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "30px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    marginTop: "15px",
    fontWeight: "bold",
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    background: "#6366f1",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  message: {
    textAlign: "center",
    marginTop: "20px",
    color: "#16a34a",
    fontWeight: "bold",
  },
};

export default Register;