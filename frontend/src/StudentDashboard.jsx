import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState("");

  const studentName =
    localStorage.getItem("studentName") || "Student";

  const studentEmail =
    localStorage.getItem("studentEmail") || "";

  // Load all events
  const loadEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/events"
      );

      setEvents(response.data);
    } catch (error) {
      console.error("Error loading events:", error);
      setMessage("Unable to load events.");
    }
  };

  // Load student's registrations
  const loadRegistrations = async () => {
    try {
      if (!studentEmail) {
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/registrations/student/${encodeURIComponent(
          studentEmail
        )}`
      );

      setRegistrations(response.data);
    } catch (error) {
      console.error(
        "Error loading registrations:",
        error
      );
    }
  };

  // Load data when dashboard opens
  useEffect(() => {
    loadEvents();
    loadRegistrations();
  }, []);

  // Register for an event
  const registerForEvent = async (event) => {
    try {
      await axios.post(
        `http://localhost:8080/api/registrations/event/${event.id}`,
        {
          name: studentName,
          email: studentEmail,
          phone: "Not provided",
        }
      );

      setMessage(
        `Successfully registered for ${event.name}! 🎉`
      );

      // Refresh registrations
      loadRegistrations();

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setMessage(
        error.response?.data ||
        "Registration failed. Please try again."
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("studentRole");

    window.location.reload();
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          Event<span>Hub</span>
        </div>

        <div className="nav-links">

          <span style={{ marginRight: "15px" }}>
            Welcome, {studentName}
          </span>

          <button
            className="login-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Dashboard */}
      <section className="events-section">

        {/* Heading */}
        <div className="section-heading">

          <p>STUDENT DASHBOARD</p>

          <h2>
            Welcome, {studentName}! 👋
          </h2>

          <span>
            Browse upcoming events and register to participate.
          </span>

        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              textAlign: "center",
              margin: "20px auto",
              padding: "15px",
              maxWidth: "600px",
              background: "#eef2ff",
              borderRadius: "10px",
              color: "#4f46e5",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}

        {/* My Registrations */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "40px auto",
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >

          <h2
            style={{
              textAlign: "center",
              marginBottom: "25px",
              color: "#111827",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            My Registrations
          </h2>

          {registrations.length === 0 ? (

            <p
              style={{
                textAlign: "center",
                color: "#777",
              }}
            >
              You have not registered for any events yet.
            </p>

          ) : (

            <div
              style={{
                overflowX: "auto",
              }}
            >

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >

                <thead>

                  <tr
                    style={{
                      background: "#6366f1",
                      color: "white",
                    }}
                  >

                    <th style={tableHeaderStyle}>
                      Event
                    </th>

                    <th style={tableHeaderStyle}>
                      Date
                    </th>

                    <th style={tableHeaderStyle}>
                      Time
                    </th>

                    <th style={tableHeaderStyle}>
                      Venue
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {registrations.map(
                    (registration) => (

                      <tr key={registration.id}>

                        <td style={tableCellStyle}>
                          {registration.event?.name ||
                            "Event"}
                        </td>

                        <td style={tableCellStyle}>
                          {registration.event?.date ||
                            "-"}
                        </td>

                        <td style={tableCellStyle}>
                          {registration.event?.time ||
                            "-"}
                        </td>

                        <td style={tableCellStyle}>
                          {registration.event?.venue ||
                            "-"}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* Available Events */}
        <div className="section-heading">

          <p>UPCOMING EVENTS</p>

          <h2>
            Available Events
          </h2>

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

                {/* Event Image */}
                <div className="event-image">

                  <div className="event-date">

                    <strong>
                      {new Date(
                        event.date
                      ).getDate()}
                    </strong>

                    <small>
                      {new Date(
                        event.date
                      ).toLocaleString(
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

                  {/* Registration Button */}
                  {registrations.some(
                    (registration) =>
                      registration.event?.id === event.id
                  ) ? (

                    <button
                      className="register-btn"
                      disabled
                      style={{
                        background: "#22c55e",
                        cursor: "not-allowed",
                        opacity: "0.9",
                      }}
                    >
                      ✓ Already Registered
                    </button>

                  ) : (

                    <button
                      className="register-btn"
                      onClick={() =>
                        registerForEvent(event)
                      }
                    >
                      Register Now
                    </button>

                  )}

                </div>

              </div>

            ))

          )}

        </div>

      </section>

      {/* Footer */}
      <footer>

        <h3>
          Event<span>Hub</span>
        </h3>

        <p>
          Student Dashboard
        </p>

        <p>
          © 2026 EventHub. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

// Table styles
const tableHeaderStyle = {
  padding: "15px",
  textAlign: "left",
};

const tableCellStyle = {
  padding: "15px",
  borderBottom: "1px solid #eee",
};

export default StudentDashboard;