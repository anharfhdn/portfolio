"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
    const { address, isConnected } = useAccount();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [mounted, setMounted] = useState(false);

    const ADMIN_ADDRESSES = [
        "0x44468A6c5bcC923d8337024675AC75b8fAFCF008",
        "0x8bE640069ffbB3434cC6C2E744bf53e670D23a8a"
    ];

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            const isAdmin = ADMIN_ADDRESSES.some(
                (adminAddr) => adminAddr.toLowerCase() === address.toLowerCase()
            );
            setIsAuthorized(isAdmin);
        }
    }, [address, isConnected]);

    if (!mounted) {
        return null;
    }

    if (!isConnected || !address) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center pt-32 pb-24">
                    <Card className="w-full max-w-md p-8">
                        <div className="text-center space-y-6">
                            <h1 className="text-2xl font-bold">Admin Panel</h1>
                            <p className="text-muted-foreground">
                                Please connect your wallet to access the admin panel.
                            </p>
                            <Link href="/">
                                <Button variant="outline" className="w-full">
                                    <Home size={18} className="mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <main className="flex-grow flex items-center justify-center pt-32 pb-24">
                    <Card className="w-full max-w-md p-8">
                        <div className="text-center space-y-6">
                            <h1 className="text-2xl font-bold">Access Denied</h1>
                            <p className="text-muted-foreground">
                                Your wallet address is not authorized to access the admin panel.
                            </p>
                            <p className="text-xs font-mono text-muted-foreground bg-muted p-2 rounded">
                                {address}
                            </p>
                            <Link href="/">
                                <Button variant="outline" className="w-full">
                                    <Home size={18} className="mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
                            <Link href="/">
                                <Button variant="outline" size="sm">
                                    <Home size={18} className="mr-2" />
                                    Home
                                </Button>
                            </Link>
                        </div>
                        <p className="text-muted-foreground">
                            Welcome back, {address.slice(0, 6)}...{address.slice(-4)}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="p-6 hover:border-emerald-500/50 transition-colors">
                            <h3 className="text-lg font-bold mb-2">Blog Posts</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Manage and create blog posts
                            </p>
                            <Button variant="outline" className="w-full" disabled>
                                Coming Soon
                            </Button>
                        </Card>

                        <Card className="p-6 hover:border-emerald-500/50 transition-colors">
                            <h3 className="text-lg font-bold mb-2">Projects</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Manage portfolio projects
                            </p>
                            <Button variant="outline" className="w-full" disabled>
                                Coming Soon
                            </Button>
                        </Card>

                        <Card className="p-6 hover:border-emerald-500/50 transition-colors">
                            <h3 className="text-lg font-bold mb-2">Analytics</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                View site analytics and stats
                            </p>
                            <Button variant="outline" className="w-full" disabled>
                                Coming Soon
                            </Button>
                        </Card>

                        <Card className="p-6 hover:border-emerald-500/50 transition-colors">
                            <h3 className="text-lg font-bold mb-2">Settings</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Configure admin panel settings
                            </p>
                            <Button variant="outline" className="w-full" disabled>
                                Coming Soon
                            </Button>
                        </Card>

                        <Card className="p-6 hover:border-emerald-500/50 transition-colors">
                            <h3 className="text-lg font-bold mb-2">System Status</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Monitor system health and status
                            </p>
                            <Button variant="outline" className="w-full" disabled>
                                Coming Soon
                            </Button>
                        </Card>

                        <Card className="p-6 hover:border-emerald-500/50 transition-colors">
                            <h3 className="text-lg font-bold mb-2">Logs</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                View system and error logs
                            </p>
                            <Button variant="outline" className="w-full" disabled>
                                Coming Soon
                            </Button>
                        </Card>
                    </div>

                    <Card className="mt-12 p-6 bg-muted/50">
                        <h3 className="text-lg font-bold mb-4">Connected Wallet</h3>
                        <div className="space-y-2">
                            <p className="text-sm">
                                <span className="text-muted-foreground">Address:</span>
                                <span className="font-mono ml-2">{address}</span>
                            </p>
                            <p className="text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <span className="ml-2 inline-block px-2 py-1 bg-emerald-500/20 text-emerald-500 rounded text-xs font-medium">
                                    Connected
                                </span>
                            </p>
                        </div>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}
