"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConfirmDeleteAccountPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/user/delete-account", { method: "DELETE" });
      if (res.ok) {
        // Redirect to home after successful deletion
        router.push("/");
      } else {
        alert("Failed to delete account");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account");
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-dark pt-32 px-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-dark/50 border border-white/10 p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Delete Account</h1>
          <p className="text-white/80 mb-6">
            Are you sure you want to delete your account? This action cannot be undone. All your data, including your Monstra Bytes balance, will be permanently deleted.
          </p>

          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 text-sm text-white border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 text-sm text-red-400 border border-red-400/50 rounded-lg hover:border-red-400 hover:bg-red-400/10 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
