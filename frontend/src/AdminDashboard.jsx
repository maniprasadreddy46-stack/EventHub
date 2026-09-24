import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard({ onHome }) {
  const handleLogout = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("studentRole");
    window.location.reload();
  };
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
 
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
  });

  // Load events and registrations
  const loadData = async () => {
    try {
      const eventsResponse = await axios.get(
        "http://localhost:8080/api/events"
      );

      setEvents(eventsResponse.data);

      try {
        const registrationsResponse = await axios.get(
          "http://localhost:8080/api/registrations"
        );

        setRegistrations(registrationsResponse.data);
      } catch (error) {
        console.log("Registrations API not available yet.");
        setRegistrations([]);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value,
    });
  };

  // Add new event
  const addEvent = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/events",
        newEvent
      );

      alert("Event added successfully! 🎉");

      setNewEvent({
        name: "",
        description: "",
        date: "",
        time: "",
        venue: "",
      });

      setShowAddForm(false);

      loadData();
    } catch (error) {
      console.error("Error adding event:", error);

      if (error.response?.data) {
        alert("Please check all event details.");
      } else {
        alert("Failed to add event. Make sure Spring Boot is running.");
      }
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/events/${id}`
      );

      alert("Event deleted successfully!");

      loadData();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event.");
    }
  };

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>

          <p style={styles.subtitle}>
            Manage events and student registrations
          </p>
        </div>

        <button
  style={styles.backButton}
  onClick={onHome}
>
  ← Home
</button>
        <button
  style={{
    ...styles.backButton,
    background: "#ef4444",
    marginLeft: "10px",
  }}
  onClick={handleLogout}
>
  Logout
</button>
      </div>

      {/* Statistics */}
      <div style={styles.statsContainer}>

        <div style={styles.statCard}>
          <div style={styles.icon}>📅</div>

          <div>
            <h2 style={styles.number}>
              {events.length}
            </h2>

            <p style={styles.statText}>
              Total Events
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.icon}>👥</div>

          <div>
            <h2 style={styles.number}>
              {registrations.length}
            </h2>

            <p style={styles.statText}>
              Total Registrations
            </p>
          </div>
        </div>

      </div>

      {/* Add Event Button */}
      <div style={styles.addButtonContainer}>

        <button
          style={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm
            ? "✕ Close Form"
            : "＋ Add New Event"}
        </button>

      </div>

      {/* Add Event Form */}
      {showAddForm && (

        <div style={styles.formCard}>

          <h2 style={styles.formTitle}>
            Add New Event
          </h2>

          <form onSubmit={addEvent}>

            <label style={styles.label}>
              Event Name
            </label>

            <input
              type="text"
              name="name"
              value={newEvent.name}
              onChange={handleChange}
              placeholder="Enter event name"
              style={styles.input}
              required
            />

            <label style={styles.label}>
              Description
            </label>

            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleChange}
              placeholder="Enter event description"
              style={styles.textarea}
              required
            />

            <div style={styles.row}>

              <div style={styles.field}>
                <label style={styles.label}>
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={newEvent.time}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

            </div>

            <label style={styles.label}>
              Venue
            </label>

            <input
              type="text"
              name="venue"
              value={newEvent.venue}
              onChange={handleChange}
              placeholder="Enter venue"
              style={styles.input}
              required
            />

            <button
              type="submit"
              style={styles.submitButton}
            >
              Create Event 🎉
            </button>

          </form>

        </div>

      )}

      {/* Manage Events */}
      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          Manage Events
        </h2>

        {events.length === 0 ? (

          <p style={styles.empty}>
            No events available.
          </p>

        ) : (

          <div style={styles.tableContainer}>

            <table style={styles.table}>

              <thead>

                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Event Name</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Venue</th>
                  <th style={styles.th}>Action</th>
                </tr>

              </thead>

              <tbody>

                {events.map((event) => (

                  <tr key={event.id}>

                    <td style={styles.td}>
                      {event.id}
                    </td>

                    <td style={styles.td}>
                      <strong>
                        {event.name}
                      </strong>
                    </td>

                    <td style={styles.td}>
                      {event.date}
                    </td>

                    <td style={styles.td}>
                      {event.time}
                    </td>

                    <td style={styles.td}>
                      {event.venue}
                    </td>

                    <td style={styles.td}>

                      <button
                        style={styles.deleteButton}
                        onClick={() =>
                          deleteEvent(event.id)
                        }
                      >
                        🗑 Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Student Registrations */}
      <div style={styles.section}>

        <h2 style={styles.sectionTitle}>
          Student Registrations
        </h2>

        {registrations.length === 0 ? (

          <p style={styles.empty}>
            No student registrations yet.
          </p>

        ) : (

          <div style={styles.tableContainer}>

            <table style={styles.table}>

              <thead>

                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Student Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Event</th>
                </tr>

              </thead>

              <tbody>

                {registrations.map((registration) => (

                  <tr key={registration.id}>

                    <td style={styles.td}>
                      {registration.id}
                    </td>

                    <td style={styles.td}>
                      {registration.name}
                    </td>

                    <td style={styles.td}>
                      {registration.email}
                    </td>

                    <td style={styles.td}>
                      {registration.phone}
                    </td>

                    <td style={styles.td}>
                      {registration.event
                        ? registration.event.name
                        : "Unknown Event"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 7%",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
  },

  title: {
    margin: "0",
    color: "#111827",
    fontSize: "36px",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
    fontSize: "16px",
  },

  backButton: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },

  statsContainer: {
    display: "flex",
    gap: "25px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },

  statCard: {
    background: "white",
    padding: "25px 30px",
    borderRadius: "14px",
    minWidth: "230px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
  },

  icon: {
    fontSize: "35px",
  },

  number: {
    margin: "0",
    fontSize: "30px",
    color: "#6366f1",
  },

  statText: {
    margin: "5px 0 0",
    color: "#6b7280",
  },

  addButtonContainer: {
    marginBottom: "25px",
  },

  addButton: {
    background: "#6366f1",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  formCard: {
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    marginBottom: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
  },

  formTitle: {
    marginTop: "0",
    marginBottom: "25px",
    color: "#111827",
  },

  label: {
    display: "block",
    marginBottom: "8px",
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

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "100px",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    resize: "vertical",
  },

  row: {
    display: "flex",
    gap: "20px",
  },

  field: {
    flex: 1,
  },

  submitButton: {
    marginTop: "25px",
    width: "100%",
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  section: {
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    marginBottom: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    color: "#111827",
    marginBottom: "20px",
  },

  tableContainer: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    background: "#6366f1",
    color: "white",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  },

  deleteButton: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "9px 14px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  empty: {
    color: "#6b7280",
    padding: "20px 0",
  },
};

export default AdminDashboard;