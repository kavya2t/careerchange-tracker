import useLocalStorage from "../hooks/useLocalStorage";
import { useState } from "react";

export default function MockTests() {
  const [tests, setTests] = useLocalStorage("mockTestScores", []);
  const [score, setScore] = useState("");

  const addTest = () => {
    if (score.trim()) {
      setTests([...tests, score]);
      setScore("");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📝 Mock Tests</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          className="border p-2 rounded flex-1"
          placeholder="Enter score..."
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <button
          onClick={addTest}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {tests.map((t, i) => (
          <li key={i} className="bg-white p-3 rounded shadow">
            Test {i + 1}: {t} marks
          </li>
        ))}
      </ul>
    </div>
  );
}
