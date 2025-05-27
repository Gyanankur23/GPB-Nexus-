import { useState } from "react";
import { auth, provider } from "../lib/firebase";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-black rounded-lg shadow-lg p-8 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">{isRegister ? "Register" : "Login"}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-accent text-white py-2 rounded hover:opacity-90"
        >
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-2 border border-accent py-2 rounded hover:bg-accent hover:text-white transition"
      >
        <img src="/images/logo.png" alt="Google" className="w-5 h-5" />
        Sign in with Google
      </button>
      <p className="text-sm text-center">
        {isRegister ? "Already have an account?" : "No account?"}{" "}
        <button
          onClick={() => setIsRegister(r => !r)}
          className="text-accent underline"
        >
          {isRegister ? "Login" : "Register"}
        </button>
      </p>
    </div>
  );
}
