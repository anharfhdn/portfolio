"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import {Moon, Sun, Menu, X, Wallet} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { address, isConnected } = useAccount()
    const { connect, connectors, isPending } = useConnect()
    const { disconnect } = useDisconnect()

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
        { name: "Blog", href: "/#blog" },
        { name: "Philosophy", href: "/#philosophy" },
        { name: "Contact", href: "/#contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <div className="relative h-10 w-10 overflow-hidden border-emerald-500/20 bg-emerald-500/5 p-1">
                            <Image
                                src="/favicon512.png"
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
                                className="hidden dark:block object-contain object-left"
                                priority
                            />
                            <Image
                                src="/logo-light.png"
                                alt="Anhar Fahrudin"
                                fill
                                className="block dark:hidden object-contain object-left"
                                priority
                            />
                        </div>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-emerald-500 transition-all flex items-center gap-1 group"
                            >
                                {link.name}
                                <span className="w-1 h-3 bg-emerald-500 hidden group-hover:inline-block animate-pulse ml-1" />
                            </Link>
                        ))}
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="flex items-center gap-2">
                            {isConnected ? (
                                <>
                                    <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-full text-muted-foreground font-mono border">
                                        {address?.slice(0, 6)}...{address?.slice(-4)}
                                    </span>

                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => disconnect()}
                                    >
                                        <Wallet size={18} />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => connect({ connector: connectors[0] })}
                                    disabled={isPending}
                                >
                                    <Wallet size={18} />
                                    {isPending ? 'Connecting...' : 'Connect'}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="md:hidden flex items-center gap-2 p-1">
                        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {isConnected ? (
                            <>
            <span className="text-xs bg-muted/50 px-1 rounded font-mono">
                {address?.slice(0, 4)}...
            </span>
                                <button
                                    onClick={() => disconnect()}
                                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-xs h-8 w-8 flex items-center justify-center"
                                >
                                    <Wallet size={14} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                        toast("Desktop Recommended", {
                                            description: "Open on desktop for full wallet experience!",
                                            duration: 4000,
                                        });
                                        return;
                                    }

                                    try {
                                        connect({ connector: connectors[0] });
                                    } catch (error) {
                                        toast("Wallet Required", {
                                            description: "Please install MetaMask or Phantom browser extension!",
                                            duration: 5000,
                                        });
                                    }
                                }}
                                className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium h-8 flex items-center justify-center"
                            >
                                <Wallet size={14} className="mr-1" />
                                Connect
                            </button>
                        )}

                        <button onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                <>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-background border-b border-border"
                        >
                            <div className="px-4 pt-2 pb-6 space-y-1">
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
                </>
            </AnimatePresence>
        </nav>
    );
}
