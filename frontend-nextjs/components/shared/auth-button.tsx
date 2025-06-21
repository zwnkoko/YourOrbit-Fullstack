"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function AuthButton() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Button variant="secondary" className="w-full md:w-24" disabled>
        Loading...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button variant="secondary" className="w-full md:w-24" onClick={() => {}}>
        Sign Out
      </Button>
    );
  }
}
