import { motion } from "framer-motion";

export default function AuthForm({
  isLogin,
  setIsLogin,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  message,
  onSubmit,
  onReset,
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white px-3 sm:px-6 lg:px-8">

      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950 to-black opacity-90"></div>

      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl flex bg-black/60 border border-red-500/20 rounded-2xl overflow-hidden backdrop-blur-2xl">

        <motion.div className="w-full md:w-1/2 p-5 sm:p-7 md:p-8 lg:p-10 xl:p-12">

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
            {isLogin ? "Welcome Back 🎬" : "Create Account 🍿"}
          </h2>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2.5 sm:p-3 md:p-3.5 lg:p-4 mb-3 md:mb-4 rounded-lg bg-black/40 border border-gray-600 
                       text-sm sm:text-base md:text-lg lg:text-xl outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2.5 sm:p-3 md:p-3.5 lg:p-4 mb-3 md:mb-4 rounded-lg bg-black/40 border border-gray-600 
                       text-sm sm:text-base md:text-lg lg:text-xl outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            className="w-full bg-red-600 py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-lg font-bold mb-2 md:mb-3
                       text-sm sm:text-base md:text-lg lg:text-xl"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>

          {/* Forgot Password */}
          <button
            onClick={onReset}
            className="text-red-400 text-xs sm:text-sm md:text-base lg:text-lg"
          >
            Forgot Password?
          </button>

          {/* Switch Login/Signup */}
          <p className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg">
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Switch to Sign Up" : "Switch to Login"}
            </button>
          </p>

          {/* Message */}
          {message && (
            <p className="text-yellow-300 mt-2 md:mt-3 text-xs sm:text-sm md:text-base lg:text-lg">
              {message}
            </p>
          )}

        </motion.div>
      </div>
    </div>
  );
}

