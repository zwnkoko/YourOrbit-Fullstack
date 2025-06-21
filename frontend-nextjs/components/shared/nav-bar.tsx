import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

interface NavBarProps {
  title?: string;
  links: {
    href: string;
    label: string;
  }[];
  showThemeToggle?: boolean;
}

export function NavBar({ title, links, showThemeToggle = true }: NavBarProps) {
  return (
    <>
      {/* Medium and above view port normal nav bar*/}
      <nav className="hidden size-full grid-cols-12 md:grid">
        <div className="col-span-7 flex flex-col justify-center">
          <p> {title} </p>
        </div>
        <div className="col-span-5 flex flex-row items-center justify-end gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-opacity hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}

          {/* Reserve space for theme toggle - Prevent layout shift on first load*/}
          <div className="flex h-10 w-10 items-center justify-center">
            {showThemeToggle && <ThemeToggle />}
          </div>
        </div>
      </nav>
    </>
  );
}
