import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, pass);
        alert("Account created!");
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-orange-600">
          {isSignup ? "Create an Account" : "Login to Kaamigo"}
        </h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          type="email"
        />
        <input
          placeholder="Password"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-orange-500 text-white px-4 py-2 w-full rounded hover:bg-orange-600"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          onClick={() => setIsSignup(!isSignup)}
          className="text-sm mt-4 text-blue-500 text-center cursor-pointer"
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Create one"}
        </p>

        <div className="my-4 text-center text-sm text-gray-400">or</div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 border px-4 py-2 w-full rounded hover:bg-gray-100"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
