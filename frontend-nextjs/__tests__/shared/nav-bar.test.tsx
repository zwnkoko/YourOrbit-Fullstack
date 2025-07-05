import { render, screen, cleanup } from "@testing-library/react";
import { NavBar } from "@/components/shared/nav-bar";

// Mock the AuthButton component to avoid auth-client import issues
jest.mock("@/components/shared/auth-button", () => ({
  AuthButton: () => <div data-testid="auth-button">Mock Auth Button</div>,
}));

// Mock the MobileNav component to avoid any potential import issues
jest.mock("@/components/shared/mobile-nav", () => ({
  MobileNav: ({ links }: { links: Array<{ href: string; label: string }> }) => (
    <div data-testid="mobile-nav">
      {links.map((link) => (
        <a key={link.href} href={link.href} data-testid="mobile-nav-link">
          {link.label}
        </a>
      ))}
    </div>
  ),
}));

// Mock next/link to avoid Next.js dependency issues in tests
jest.mock("next/link", () => {
  return function MockLink({ href, children, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe("NavBar", () => {
  beforeEach(() => {
    render(
      <NavBar
        title="testTitle"
        links={[
          { href: "/", label: "Home" },
          { href: "/test", label: "Test" },
        ]}
        showThemeToggle={true}
      />
    );
  });

  it("Should show title", () => {
    const titles = screen.getAllByText("testTitle");
    // one for Desktop and one for Mobile - Hidden according to view port but exist in DOM
    expect(titles).toHaveLength(2);
    expect(titles[0]).toBeInTheDocument();
    expect(titles[1]).toBeInTheDocument();
  });

  it("renders the NavBar with correct links and labels", () => {
    // Check that links exist (there will be multiple because of desktop and mobile views)
    const homeLinks = screen.getAllByText("Home");
    const testLinks = screen.getAllByText("Test");

    expect(homeLinks).toHaveLength(2); // one desktop, one mobile
    expect(testLinks).toHaveLength(2); // one desktop, one mobile

    // Check that all links are in the document
    homeLinks.forEach((link) => expect(link).toBeInTheDocument());
    testLinks.forEach((link) => expect(link).toBeInTheDocument());

    // Check href attributes - use getAllByRole to get all links
    const allHomeLinks = screen.getAllByRole("link", { name: "Home" });
    const allTestLinks = screen.getAllByRole("link", { name: "Test" });

    allHomeLinks.forEach((link) => expect(link).toHaveAttribute("href", "/"));
    allTestLinks.forEach((link) =>
      expect(link).toHaveAttribute("href", "/test")
    );
  });

  it("Should show theme toggle button when showThemeToggle is true", () => {
    // Should find 2 theme toggle buttons (one for desktop, one for mobile)
    const themeToggleButtons = screen.getAllByRole("button", {
      name: /toggle theme/i,
    });
    expect(themeToggleButtons).toHaveLength(2);
    expect(themeToggleButtons[0]).toBeInTheDocument();
    expect(themeToggleButtons[1]).toBeInTheDocument();
  });

  it("Should not show theme toggle button when showThemeToggle is false", () => {
    // Clear the DOM first
    cleanup();

    // Re-render with showThemeToggle=false
    render(
      <NavBar
        title="testTitle"
        links={[
          { href: "/", label: "Home" },
          { href: "/test", label: "Test" },
        ]}
        showThemeToggle={false}
      />
    );

    const themeToggleButtons = screen.queryAllByRole("button", {
      name: /toggle theme/i,
    });
    expect(themeToggleButtons).toHaveLength(0);
  });

  it("renders AuthButton component", () => {
    // Check that the AuthButton is properly integrated
    const authButton = screen.getByTestId("auth-button");
    expect(authButton).toBeInTheDocument();
    expect(authButton).toHaveTextContent("Mock Auth Button");
  });

  it("renders MobileNav component with correct props", () => {
    // Check that MobileNav is rendered with correct links
    const mobileNav = screen.getByTestId("mobile-nav");
    expect(mobileNav).toBeInTheDocument();

    // Check that mobile nav links are rendered
    const mobileNavLinks = screen.getAllByTestId("mobile-nav-link");
    expect(mobileNavLinks).toHaveLength(2);

    // Check href attributes of mobile nav links
    expect(mobileNavLinks[0]).toHaveAttribute("href", "/");
    expect(mobileNavLinks[1]).toHaveAttribute("href", "/test");

    // Check text content
    expect(mobileNavLinks[0]).toHaveTextContent("Home");
    expect(mobileNavLinks[1]).toHaveTextContent("Test");
  });
});
