import { useState } from "react";
import AuthForm from "../components/features/auth/AuthForm";
import useAuth from "../hooks/useAuth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, message, handleLogin, handleSignUp, handleReset } = useAuth();

  const handleSubmit = () => {
    isLogin
      ? handleLogin(email, password)
      : handleSignUp(email, password);
  };

  return (
    <AuthForm
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      loading={loading}
      message={message}
      onSubmit={handleSubmit}
      onReset={() => handleReset(email)}
    />
  );
}
