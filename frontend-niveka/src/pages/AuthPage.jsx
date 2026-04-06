import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  signUpUser,
  resetPassword,
} from "../store/slices/authSlice";
import AuthForm from "../components/features/auth/AuthForm";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth) || {};
  const { loading, message, error, user } = authState;

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Redirect to home when login is successful
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = () => {
    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(signUpUser({ email, password }));
    }
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
      message={error || message}
      onSubmit={handleSubmit}
      onReset={() => dispatch(resetPassword(email))}
    />
  );
}