import { render, screen, fireEvent } from "@testing-library/react";
import { AuthButton } from "@/components/shared/auth-button";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Mock the external dependencies
jest.mock("@/lib/auth-client", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the UI components to avoid complex rendering
jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
  AvatarImage: ({ src }: { src?: string }) => (
    <img data-testid="avatar-image" src={src} alt="avatar" />
  ),
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div data-testid="dropdown-menu-item" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-label">{children}</div>
  ),
  DropdownMenuSeparator: () => <div data-testid="dropdown-menu-separator" />,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu-trigger">{children}</div>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  CircleUserRound: () => <div data-testid="circle-user-round-icon" />,
}));

describe("Validation Tests - These should FAIL to prove tests work", () => {
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (signOut as jest.Mock).mockImplementation(mockSignOut);
  });

  // This test should FAIL - testing wrong text
  it("Should FAIL: Wrong text expectation", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<AuthButton />);

    // This should fail because the button says "Sign In" not "Log In"
    expect(() => screen.getByRole("button", { name: /log in/i })).toThrow();
  });

  // This test should FAIL - testing wrong navigation
  it("Should FAIL: Wrong navigation expectation", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
    });

    render(<AuthButton />);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(signInButton);

    // This should fail because it navigates to "/login" not "/signin"
    expect(mockPush).toHaveBeenCalledWith("/signin");
  });

  // This test should FAIL - testing wrong loading state
  it("Should FAIL: Wrong loading state expectation", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      isPending: true,
    });

    render(<AuthButton />);

    // This should fail because the loading button says "Loading..." not "Please wait"
    expect(() =>
      screen.getByRole("button", { name: /please wait/i })
    ).toThrow();
  });
});
