"use client";

import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export function useAuthGuard() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      console.log("isPending:", isPending, "session:", session);
      setShowAuthModal(true);
    }
  }, []);

  const requireAuth = (callback: () => void) => {
    if (isPending) {
      return; // Prevent action while session is loading. Let calling component handle loading state.
    }
    if (!session) {
      setShowAuthModal(true);
      return;
    }
    callback();
  };

  return {
    isPending,
    showAuthModal,
    setShowAuthModal,
    requireAuth,
  };
}
