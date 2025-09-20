import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Habits from "./pages/Habits";
import MockTests from "./pages/MockTests";
import Profile from "./pages/profile"; // ✅ Corrected import (uppercase)

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/schedule">Schedule</Link>
          <Link to="/habits">Habits</Link>
          <Link to="/mock-tests">Mock Tests</Link> {/* consistent with Route */}
          <Link to="/profile">Profile</Link>
        </nav>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/mock-tests" element={<MockTests />} /> {/* consistent */}
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

