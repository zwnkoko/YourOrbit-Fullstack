"use client";
import { useEffect, useState } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const simulateAuth = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simulate successful authentication
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    simulateAuth();
  }, []);

  return { isAuthenticated, isLoading };
}
