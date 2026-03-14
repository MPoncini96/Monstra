"use client";

import { useEffect, useMemo, useState } from "react";

type SubscribeButtonProps = {
  botId: string;
};

type StatusResponse = {
  subscribed: boolean;
  monstraBytes: number;
  requiresAuth?: boolean;
};

const readJsonSafe = async <T,>(response: Response): Promise<T | null> => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

export default function SubscribeButton({ botId }: SubscribeButtonProps) {
  const normalizedBotId = useMemo(() => botId.trim().toLowerCase(), [botId]);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [confirmingAction, setConfirmingAction] = useState<"subscribe" | "unsubscribe" | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/subscriptions/${normalizedBotId}`, {
          cache: "no-store",
          credentials: "include",
        });

        if (response.redirected) {
          if (isMounted) setSubscribed(false);
          return;
        }

        if (!response.ok) {
          if (isMounted) setSubscribed(false);
          return;
        }

        const data = await readJsonSafe<StatusResponse>(response);
        if (!data) {
          if (isMounted) setSubscribed(false);
          return;
        }
        if (isMounted) {
          setSubscribed(Boolean(data.subscribed));
          setMessage(null);
        }
      } catch {
        if (isMounted) setSubscribed(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [normalizedBotId]);

  const handleSubscribeConfirm = async () => {
    try {
      setPending(true);
      setMessage(null);
      const response = await fetch(`/api/subscriptions/${normalizedBotId}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.redirected) {
        setMessage("Please sign in to subscribe.");
        return;
      }

      const data = await readJsonSafe<{ subscribed?: boolean; error?: string }>(response);

      if (!response.ok || !data || typeof data.subscribed !== "boolean") {
        if (response.status === 401) {
          setMessage("Please sign in to subscribe.");
          return;
        }
        setMessage(data?.error ?? "Unable to subscribe right now. Please refresh and try again.");
        return;
      }

      setSubscribed(Boolean(data?.subscribed));
      setConfirmingAction(null);
      setMessage(null);
    } catch {
      setMessage("Unable to subscribe right now.");
    } finally {
      setPending(false);
    }
  };

  const handleUnsubscribeConfirm = async () => {
    try {
      setPending(true);
      setMessage(null);
      const response = await fetch(`/api/subscriptions/${normalizedBotId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.redirected) {
        setMessage("Please sign in to unsubscribe.");
        return;
      }

      const data = await readJsonSafe<{ subscribed?: boolean; error?: string }>(response);

      if (!response.ok || !data || typeof data.subscribed !== "boolean") {
        if (response.status === 401) {
          setMessage("Please sign in to unsubscribe.");
          return;
        }
        setMessage(data?.error ?? "Unable to unsubscribe right now. Please refresh and try again.");
        return;
      }

      setSubscribed(Boolean(data?.subscribed));
      setConfirmingAction(null);
      setMessage(null);
    } catch {
      setMessage("Unable to unsubscribe right now.");
    } finally {
      setPending(false);
    }
  };

  const onClick = () => {
    setMessage(null);
    setConfirmingAction(subscribed ? "unsubscribe" : "subscribe");
  };

  const label = loading || pending ? "Please wait..." : subscribed ? "Unsubscribe" : "Subscribe";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        className="rounded-lg bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={onClick}
        disabled={loading || pending}
      >
        {label}
      </button>

      {confirmingAction && !pending && (
        <div className="w-full max-w-md rounded-lg border border-white/15 bg-black/40 p-3 text-center text-sm text-white/85">
          <p className="mb-3">
            {confirmingAction === "subscribe"
              ? "Subscribing costs 1 MonstraBytes. Continue?"
              : "Are you sure you want to unsubscribe from this bot?"}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              className="rounded-md bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
              onClick={() => setConfirmingAction(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
              onClick={confirmingAction === "subscribe" ? handleSubscribeConfirm : handleUnsubscribeConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {message && <p className="text-center text-xs text-red-300">{message}</p>}
    </div>
  );
}
