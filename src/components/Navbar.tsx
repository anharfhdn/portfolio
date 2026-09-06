"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Menu, X, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/#projects" },
    { name: "Experience", href: "/#experience" },
    { name: "Blog", href: "/#blog" },
    { name: "Philosophy", href: "/#philosophy" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto rounded-2xl bg-background/50 backdrop-blur-xl border border-border/60 shadow-lg shadow-black/[0.04] dark:shadow-black/30 px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative h-10 w-10 overflow-hidden p-1">
              <Image
                src="/favicon.png"
                alt="Logo Icon"
                width={40}
                height={40}
                className="object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="h-12 w-48 relative">
              <Image
                src="/logo-dark.png"
                alt="Anhar Fahrudin"
                fill
                sizes="192px"
                className="hidden dark:block object-contain object-left"
                priority
              />
              <Image
                src="/logo-light.png"
                alt="Anhar Fahrudin"
                fill
                sizes="192px"
                className="block dark:hidden object-contain object-left"
                priority
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted: rbMounted,
              }) => {
                const ready = rbMounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <Button
                            onClick={openConnectModal}
                            size="sm"
                            className="bg-foreground text-background hover:bg-foreground/90 gap-2 font-medium"
                          >
                            <Wallet size={16} />
                            Connect
                          </Button>
                        );
                      }
                      if (chain.unsupported) {
                        return (
                          <Button
                            onClick={openChainModal}
                            variant="destructive"
                            size="sm"
                            className="rounded-full"
                          >
                            Wrong Network
                          </Button>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={openChainModal}
                            variant="outline"
                            size="sm"
                            className="px-2 rounded-full"
                          >
                            {chain.hasIcon && (
                              <div className="w-5 h-5">
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? "Chain icon"}
                                    src={chain.iconUrl}
                                    className="w-5 h-5 rounded-full"
                                  />
                                )}
                              </div>
                            )}
                          </Button>

                          <Button
                            onClick={openAccountModal}
                            variant="outline"
                            size="sm"
                            className="font-mono text-xs rounded-full"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              {account.displayName}
                            </div>
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <ConnectButton
              label="Connect"
              accountStatus="avatar"
              chainStatus="none"
            />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="max-w-5xl mx-auto mt-2 rounded-2xl bg-background/70 backdrop-blur-xl border border-border/60 shadow-lg shadow-black/[0.04] dark:shadow-black/30 px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
