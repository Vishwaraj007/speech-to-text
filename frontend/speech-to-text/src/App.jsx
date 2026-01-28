// frontend/src/App.jsx
import { useState, useEffect } from "react";
import './App.css';


function App() {
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);

  // ✅ Use env variable for backend URL
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch previous transcriptions
  const fetchHistory = async () => {
    if (!API_URL) return console.error("API_URL not defined!");
    try {
      const res = await fetch(`${API_URL}/transcriptions`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  // Load history once on mount
  useEffect(() => {
  const fetchData = async () => {
    if (!API_URL) return;
    try {
      const res = await fetch(`${API_URL}/transcriptions`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  fetchData();
}, [API_URL]);


  // Upload audio & transcribe
  const handleUpload = async () => {
    if (!audio) {
      alert("Please select an audio file!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audio);

    setLoading(true);
    setText("");

    try {
      const res = await fetch(`${API_URL}/transcribe`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setText(data.transcription || "No transcription found");

      // Refresh history after successful upload
      fetchHistory();
    } catch (err) {
      alert("Upload failed!");
      console.error("Upload error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Speech to Text 🎙️</h1>

        {/* File input */}
        <input
          type="file"
          accept="audio/*"
          className="mb-4 w-full"
          onChange={(e) => setAudio(e.target.files[0])}
        />

        {/* Upload button */}
        <button
          onClick={handleUpload}
          className="bg-blue-600 px-4 py-2 rounded w-full"
        >
          {loading ? "Transcribing..." : "Upload & Transcribe"}
        </button>

        {/* Latest transcription */}
        {text && (
          <div className="mt-4 bg-gray-700 p-3 rounded">
            <strong>Latest Transcription:</strong>
            <p className="mt-2 text-sm">{text}</p>
          </div>
        )}

        {/* History section */}
{/* History section */}
{/* History section */}
<div className="mt-6 overflow-x-auto">
  <h2 className="font-semibold mb-4 text-xl text-center">Transcription History</h2>

  {history.length === 0 ? (
    <p className="text-sm text-gray-400 text-center">No transcriptions yet</p>
  ) : (
    <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg">
      <thead className="bg-gray-800 border-b border-gray-700">
        <tr>
          <th className="px-4 py-3 text-left text-gray-200 uppercase text-xs">#</th>
          <th className="px-4 py-3 text-left text-gray-200 uppercase text-xs">Filename</th>
          <th className="px-4 py-3 text-left text-gray-200 uppercase text-xs">Audio</th>
          <th className="px-4 py-3 text-left text-gray-200 uppercase text-xs">Date</th>
          <th className="px-4 py-3 text-left text-gray-200 uppercase text-xs">Time</th>
          <th className="px-4 py-3 text-left text-gray-200 uppercase text-xs">Length</th>
          <th className="px-4 py-3 text-left text-gray-200 uppercase text-xs">Transcription</th>
        </tr>
      </thead>
      <tbody>
        {history.map((item, index) => {
          const createdAt = new Date(item.createdAt);
          const date = createdAt.toLocaleDateString();
          const time = createdAt.toLocaleTimeString();

          return (
            <tr
              key={item._id}
              className={`border-b border-gray-700 hover:bg-gray-800 transition-all duration-200`}
            >
              <td className="px-4 py-2 text-gray-200">{index + 1}</td>
              <td className="px-4 py-2 text-gray-100 font-medium">{item.filename}</td>
              <td className="px-4 py-2">
                <audio controls className="w-40 rounded bg-gray-700">
                  <source src={`${API_URL}/uploads/${item.filename}`} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </td>
              <td className="px-4 py-2 text-gray-200">{date}</td>
              <td className="px-4 py-2 text-gray-200">{time}</td>
              <td className="px-4 py-2 text-gray-200">{item.duration || "N/A"}</td>
              <td className="px-4 py-2">
                <details className="bg-gray-700 p-2 rounded cursor-pointer hover:bg-gray-600 transition-colors">
                  <summary className="font-semibold text-sm text-gray-100">View</summary>
                  <p className="mt-1 text-xs text-gray-300">{item.transcription}</p>
                </details>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )}
</div>



      </div>
    </div>
  );
}

export default App;
