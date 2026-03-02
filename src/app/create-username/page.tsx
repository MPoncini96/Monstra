"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function CreateUsernamePage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
      setError("Username must be 3-20 characters, alphanumeric or underscores.");
      return;
    }
    // TODO: Send username to backend API
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Create your username</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          className="border rounded px-3 py-2"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">Submit</button>
      </form>
    </div>
  );
}
