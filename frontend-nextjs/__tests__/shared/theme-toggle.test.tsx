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

  it("should not render before mounted", () => {
    // Mock useState to return false for mounted state
    const mockSetMounted = jest.fn();
    jest
      .spyOn(require("react"), "useState")
      .mockReturnValueOnce([false, mockSetMounted]); // mounted state

    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      systemTheme: "dark",
      setTheme: jest.fn(),
    });

    const { container } = render(<ThemeToggle />);
    expect(container.firstChild).toBeNull();
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
