export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📊 Dashboard</h2>
      <p className="text-gray-700">
        Welcome back! Track your daily schedule, habits, and progress towards your career goals. 🚀
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white shadow p-4 rounded">✅ Tasks Completed: 12</div>
        <div className="bg-white shadow p-4 rounded">🔥 Current Streak: 7 Days</div>
        <div className="bg-white shadow p-4 rounded">📚 Mock Tests Taken: 5</div>
        <div className="bg-white shadow p-4 rounded">🌟 Motivation Level: High</div>
      </div>
    </div>
  );
}
