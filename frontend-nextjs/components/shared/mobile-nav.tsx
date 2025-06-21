"use client";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { AuthButton } from "@/components/shared/auth-button";
import { useState } from "react";

interface MobileNavProps {
  href: string;
  label: string;
}

export function MobileNav({ links }: { links: MobileNavProps[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DrawerTrigger asChild>
        <Menu />
      </DrawerTrigger>
      <DrawerContent onClick={() => setOpen(false)}>
        <DrawerHeader className="sr-only">
          <DrawerTitle> Menu </DrawerTitle>
          <DrawerDescription> Select an option to navigate </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col space-y-3 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center rounded-md px-4 py-2"
            >
              {link.label}
            </Link>
          ))}

          <AuthButton />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
