import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useTheme } from "next-themes";

// Mock the useTheme hook
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly after mounting (hydration test)", () => {
    const mockSetTheme = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      systemTheme: "dark",
      setTheme: mockSetTheme,
    });

    const { container } = render(<ThemeToggle />);

    // The component should render the button with proper attributes
    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Toggle theme");

    // Check that the icons are present
    const sunIcon = container.querySelector("svg.lucide-sun");
    const moonIcon = container.querySelector("svg.lucide-moon");
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
  });

  it("renders after mounted and toggles theme correctly (light to dark)", () => {
    const setThemeMock = jest.fn();

    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      systemTheme: "light",
      setTheme: setThemeMock,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("resolves system theme and toggles correctly", () => {
    const setThemeMock = jest.fn();

    (useTheme as jest.Mock).mockReturnValue({
      theme: "system",
      systemTheme: "dark",
      setTheme: setThemeMock,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith("light");
  });
});
