import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isReady, setIsReady] = useState(false); // session established?
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash.
    // onAuthStateChange fires with event "PASSWORD_RECOVERY" when it detects it.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsReady(true); // session is now active, safe to call updateUser
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (!isReady) {
      setMessage("Reset session not detected. Please use the link from your email.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully 🎉");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950 to-black opacity-90"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-black/70 border border-red-500/20 backdrop-blur-2xl p-10 rounded-2xl"
      >
        <h2 className="text-3xl font-bold mb-4 text-center">Reset Password 🔐</h2>

        {!isReady && (
          <p className="text-center text-sm text-gray-400 mb-4">
            Waiting for reset session from email link...
          </p>
        )}

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 mb-4 rounded-lg bg-black/40 border border-gray-600 focus:border-red-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          disabled={!isReady}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 py-3 rounded-lg font-bold transition"
        >
          Update Password
        </button>

        {message && (
          <p className="text-center text-sm text-yellow-300 mt-4">{message}</p>
        )}
      </motion.div>
    </div>
  );
}
