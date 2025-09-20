import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Habits from "./pages/Habits";
import MockTests from "./pages/MockTests";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 p-4 text-white flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/schedule">Schedule</Link>
          <Link to="/habits">Habits</Link>
          <Link to="/mocktests">Mock Tests</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/mocktests" element={<MockTests />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
