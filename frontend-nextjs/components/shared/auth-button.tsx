"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthButton() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session;

  const signOutHandler = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  // show loading state while session is pending
  // this is useful for the initial load when the session is being fetched
  if (isPending) {
    return (
      <Button variant="secondary" className="w-full md:w-24" disabled>
        Loading...
      </Button>
    );
  }

  // if the user is authenticated, show the sign out button
  if (isAuthenticated) {
    return (
      <>
        <div className="hidden md:flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-7 h-7">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={session.user.image || undefined} />
                  <AvatarFallback>
                    <CircleUserRound />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOutHandler}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button className="w-full md:hidden" onClick={signOutHandler}>
          Sign Out
        </Button>
      </>
    );
  }

  // if the user is not authenticated, show the sign in button
  return (
    <Button
      className="w-full md:w-24"
      onClick={() => {
        router.push("/login");
      }}
    >
      Sign In
    </Button>
  );
}
