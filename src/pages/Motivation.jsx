const quotes = [
  "Discipline beats motivation. Start now. ✅",
  "Small steps every day lead to big results 🚀",
  "Push yourself, because no one else is going to do it for you 💪",
  "Your dream job needs your best version 🌟",
];

export default function Motivation() {
  const today = new Date().getDay();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🌈 Daily Motivation</h2>
      <p className="bg-yellow-100 p-4 rounded shadow text-lg font-semibold">
        {quotes[today % quotes.length]}
      </p>
    </div>
  );
}
