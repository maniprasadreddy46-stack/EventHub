import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import AdminDashboard from "./AdminDashboard";
import Register from "./Register";
import Login from "./Login";
import StudentDashboard from "./StudentDashboard";


function App() {
  const studentRole = localStorage.getItem("studentRole");
  const [showAdmin, setShowAdmin] = useState(false);
  const [forceHome, setForceHome] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  // Load events from Spring Boot
  const loadEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/events"
      );

      setEvents(response.data);
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Open event registration form
  const openRegistration = (event) => {
    setSelectedEvent(event);
    setMessage("");

    setFormData({
      name: "",
      email: "",
      phone: "",
    });
  };

  // Close event registration form
  const closeRegistration = () => {
    setSelectedEvent(null);
    setMessage("");
  };

  // Handle form input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit event registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEvent) {
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/registrations/event/${selectedEvent.id}`,
        formData
      );

      setMessage("Registration successful! 🎉");

      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
    }
  };

  // Show Login page
  if (showLogin) {
    return <Login />;
  }

  if (showRegister) {
  return (
    <Register
      onLogin={() => {
        setShowRegister(false);
        setShowLogin(true);
      }}
      />
      );
      }

  if (studentRole === "STUDENT") {
    return <StudentDashboard />;
  }

  if (!forceHome && (studentRole === "ADMIN" || showAdmin)) {
    return <AdminDashboard onHome={() => setForceHome(true)} />;
  }

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          Event<span>Hub</span>
        </div>

        <div className="nav-links">

          <a href="#home">Home</a>

          <a href="#events">Events</a>

          <a href="#about">About</a>

          {/* Login Button */}
          <button
            className="login-btn"
            onClick={() => {
              setShowLogin(true);
              setShowRegister(false);
              setShowAdmin(false);
            }}
          >
            Login
          </button>

          {/* Register Button */}
          <button
            className="login-btn"
            onClick={() => {
              setShowRegister(true);
              setShowLogin(false);
              setShowAdmin(false);
            }}
          >
            Register
          </button>

        </div>

      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">

        <div className="hero-content">

          <p className="small-title">
            WELCOME TO EVENTHUB
          </p>

          <h1>
            Discover & Experience
            <br />
            <span>Amazing Events</span>
          </h1>

          <p className="hero-text">
            Explore exciting college events, technical fests,
            workshops and activities all in one place.
          </p>

          <a
            href="#events"
            className="explore-btn"
          >
            Explore Events →
          </a>

        </div>

      </section>

      {/* Events Section */}
      <section
        className="events-section"
        id="events"
      >

        <div className="section-heading">

          <p>UPCOMING EVENTS</p>

          <h2>
            Discover Events
          </h2>

          <span>
            Find events that interest you and register
            to participate.
          </span>

        </div>

        <div className="events-container">

          {events.length === 0 ? (

            <p className="no-events">
              No events available.
            </p>

          ) : (

            events.map((event) => (

              <div
                className="event-card"
                key={event.id}
              >

                {/* Event Image Area */}
                <div className="event-image">

                  <div className="event-date">

                    <strong>
                      {new Date(event.date).getDate()}
                    </strong>

                    <small>
                      {new Date(event.date).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                        }
                      )}
                    </small>

                  </div>

                </div>

                {/* Event Details */}
                <div className="event-content">

                  <h3>
                    {event.name}
                  </h3>

                  <p className="description">
                    {event.description}
                  </p>

                  <div className="event-info">

                    <p>
                      📅 {event.date}
                    </p>

                    <p>
                      ⏰ {event.time}
                    </p>

                    <p>
                      📍 {event.venue}
                    </p>

                  </div>

                  <button
                    className="register-btn"
                    onClick={() =>
                      openRegistration(event)
                    }
                  >
                    Register Now
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

      {/* About Section */}
      <section
        className="about-section"
        id="about"
      >

        <div>

          <p className="small-title">
            ABOUT US
          </p>

          <h2>
            One Platform for
            <br />
            <span>Every Event</span>
          </h2>

          <p>
            EventHub is an Event Management System designed
            to help students discover events, view event
            information and register for upcoming activities.
          </p>

        </div>

        <div className="about-box">

          <div>

            <h3>🎓</h3>

            <h4>
              Student Friendly
            </h4>

            <p>
              Easy event discovery and registration.
            </p>

          </div>

          <div>

            <h3>📅</h3>

            <h4>
              Event Management
            </h4>

            <p>
              Organize and manage events efficiently.
            </p>

          </div>

          <div>

            <h3>⚡</h3>

            <h4>
              Easy to Use
            </h4>

            <p>
              Simple and modern user interface.
            </p>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer>

        <h3>
          Event<span>Hub</span>
        </h3>

        <p>
          Event Management System
        </p>

        <p>
          © 2026 EventHub. All Rights Reserved.
        </p>

      </footer>

      {/* Event Registration Modal */}
      {selectedEvent && (

        <div className="modal-overlay">

          <div className="registration-modal">

            <button
              className="close-btn"
              onClick={closeRegistration}
            >
              ×
            </button>

            <h2>
              Register for Event
            </h2>

            <p className="selected-event">
              {selectedEvent.name}
            </p>

            <form onSubmit={handleSubmit}>

              <label>
                Student Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="submit-registration"
              >
                Submit Registration
              </button>

            </form>

            {message && (

              <p className="registration-message">
                {message}
              </p>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default App;