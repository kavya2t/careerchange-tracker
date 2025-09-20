import useLocalStorage from "../hooks/useLocalStorage";
import { useState } from "react";

export default function Habits() {
  const [habits, setHabits] = useLocalStorage("habitsList", []);
  const [newHabit, setNewHabit] = useState("");

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, { name: newHabit, done: false }]);
      setNewHabit("");
    }
  };

  const toggleHabit = (index) => {
    const updated = [...habits];
    updated[index].done = !updated[index].done;
    setHabits(updated);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🧩 Habits</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded flex-1"
          placeholder="Add new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <button
          onClick={addHabit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {habits.map((habit, index) => (
          <li
            key={index}
            className={`p-3 rounded shadow flex justify-between ${
              habit.done ? "bg-green-200" : "bg-white"
            }`}
          >
            {habit.name}
            <button
              onClick={() => toggleHabit(index)}
              className="text-blue-600"
            >
              {habit.done ? "✅ Done" : "Mark Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
