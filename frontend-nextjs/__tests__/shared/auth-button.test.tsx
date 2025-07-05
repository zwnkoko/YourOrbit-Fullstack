import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
} from "@testing-library/react";
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

describe("AuthButton", () => {
  const mockPush = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (signOut as jest.Mock).mockImplementation(mockSignOut);
  });

  afterEach(() => {
    cleanup();
  });

  describe("when session is pending", () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        isPending: true,
      });
    });

    it("should render loading state", () => {
      render(<AuthButton />);

      const loadingButton = screen.getByRole("button", { name: /loading/i });
      expect(loadingButton).toBeInTheDocument();
      expect(loadingButton).toBeDisabled();
    });
  });

  describe("when user is not authenticated", () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        isPending: false,
      });
    });

    it("should render sign in button", () => {
      render(<AuthButton />);

      const signInButton = screen.getByRole("button", { name: /sign in/i });
      expect(signInButton).toBeInTheDocument();
      expect(signInButton).not.toBeDisabled();
    });

    it("should navigate to login page when sign in button is clicked", () => {
      render(<AuthButton />);

      const signInButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(signInButton);

      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  describe("when user is authenticated", () => {
    const mockSession = {
      user: {
        id: "123",
        name: "John Doe",
        email: "john@example.com",
        image: "https://example.com/avatar.jpg",
      },
    };

    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        isPending: false,
      });
    });

    it("should render dropdown menu for desktop", () => {
      render(<AuthButton />);

      expect(screen.getByTestId("dropdown-menu")).toBeInTheDocument();
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
      expect(screen.getByTestId("avatar-image")).toBeInTheDocument();
    });

    it("should render mobile sign out button", () => {
      render(<AuthButton />);

      const mobileSignOutButton = screen.getByRole("button", {
        name: /sign out/i,
      });
      expect(mobileSignOutButton).toBeInTheDocument();
    });

    it("should render user avatar with image", () => {
      render(<AuthButton />);

      const avatarImage = screen.getByTestId("avatar-image");
      expect(avatarImage).toHaveAttribute("src", mockSession.user.image);
    });

    it("should render user avatar fallback when no image", () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            id: "123",
            name: "John Doe",
            email: "john@example.com",
            image: null,
          },
        },
        isPending: false,
      });

      render(<AuthButton />);

      expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
      expect(screen.getByTestId("circle-user-round-icon")).toBeInTheDocument();
    });

    it("should call signOut when dropdown menu item is clicked", async () => {
      mockSignOut.mockResolvedValue(undefined);

      render(<AuthButton />);

      const dropdownMenuItem = screen.getByTestId("dropdown-menu-item");
      fireEvent.click(dropdownMenuItem);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledWith({
          fetchOptions: {
            onSuccess: expect.any(Function),
          },
        });
      });
    });

    it("should call signOut when mobile sign out button is clicked", async () => {
      mockSignOut.mockResolvedValue(undefined);

      render(<AuthButton />);

      const mobileSignOutButton = screen.getByRole("button", {
        name: /sign out/i,
      });
      fireEvent.click(mobileSignOutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalledWith({
          fetchOptions: {
            onSuccess: expect.any(Function),
          },
        });
      });
    });

    it("should navigate to login page after successful sign out", async () => {
      mockSignOut.mockImplementation(({ fetchOptions }) => {
        fetchOptions.onSuccess();
        return Promise.resolve();
      });

      render(<AuthButton />);

      const signOutButton = screen.getByRole("button", { name: /sign out/i });
      fireEvent.click(signOutButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/login");
      });
    });

    it("should render dropdown menu content", () => {
      render(<AuthButton />);

      expect(screen.getByTestId("dropdown-menu-content")).toBeInTheDocument();
      expect(screen.getByTestId("dropdown-menu-label")).toBeInTheDocument();
      expect(screen.getByTestId("dropdown-menu-separator")).toBeInTheDocument();
      expect(screen.getByText("My Account")).toBeInTheDocument();
    });

    it("should verify user session structure", () => {
      const mockSession = {
        user: {
          id: "test-123",
          name: "Test User",
          email: "test@example.com",
          image: "https://example.com/test.jpg",
        },
        expires: "2024-12-31T23:59:59.999Z",
      };

      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        isPending: false,
      });

      render(<AuthButton />);

      const avatarImage = screen.getByTestId("avatar-image");
      expect(avatarImage).toHaveAttribute("src", mockSession.user.image);
    });
  });
});
