import { useState } from "react";
import API from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgot = async () => {
    if (!email) return alert("Enter email");
    try {
      const res = await API.post("/forgot-password", { email });
      setMessage(res.data.message);
    } catch {
      setMessage("Error sending reset link");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgot}>Send Reset Link</button>
      {message && <p className="text-green-400 mt-2">{message}</p>}
    </div>
  );
}
