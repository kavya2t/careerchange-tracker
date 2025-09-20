import { useState } from "react";

export default function Profile() {
  const [username, setUsername] = useState("Kavya");
  const [email, setEmail] = useState("kavya@example.com");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    alert("Profile updated ✅");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">👤 Profile Settings</h2>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          className="border p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Change Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
