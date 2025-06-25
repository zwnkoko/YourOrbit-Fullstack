import { render, screen, cleanup } from "@testing-library/react";
import { NavBar } from "@/components/shared/nav-bar";

// TODO: Add test for AuthButton after implementing it

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
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: "Test" })).toHaveAttribute(
      "href",
      "/test"
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
});
