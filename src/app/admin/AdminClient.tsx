"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getAllBlogPostsLengthAdmin } from "@/lib/blog";

export default function AdminClient({
  adminAddresses = [],
}: {
  adminAddresses?: string[];
}) {
  const { address, isConnected } = useAccount();
  const [postsLength, setPostsLength] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const isAdmin = useMemo(() => {
    if (!isConnected || !address) return false;
    return adminAddresses.some(
      (admin) => admin.toLowerCase() === address.toLowerCase(),
    );
  }, [address, isConnected, adminAddresses]);

  useEffect(() => {
    if (isAdmin) {
      const fetchStats = async () => {
        try {
          const length = await getAllBlogPostsLengthAdmin();
          setPostsLength(length);
        } catch (e) {
          console.error("Failed to load admin stats", e);
        }
      };
      fetchStats();
    }
  }, [isAdmin]);

  if (!mounted) return null;

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

  if (!isAdmin) {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/blog">
              <Card className="p-6 hover:border-emerald-500/50 transition-colors cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Blog Posts</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage and create blog posts
                    </p>
                  </div>
                  <h3 className="text-4xl font-bold text-emerald-600">
                    {postsLength}
                  </h3>
                </div>
                <Button variant="outline" className="w-full">
                  Manage Posts
                </Button>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="p-6 hover:border-emerald-500/50 transition-colors cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Projects</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage portfolio projects
                    </p>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-300">0</h3>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="p-6 hover:border-emerald-500/50 transition-colors cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      View site analytics and stats
                    </p>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-300">0</h3>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="p-6 hover:border-emerald-500/50 transition-colors cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure admin panel settings
                    </p>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-300">0</h3>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="p-6 hover:border-emerald-500/50 transition-colors cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">System Status</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor system health and status
                    </p>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-300">0</h3>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="p-6 hover:border-emerald-500/50 transition-colors cursor-pointer h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Logs</h3>
                    <p className="text-sm text-muted-foreground">
                      View system and error logs
                    </p>
                  </div>
                  <h3 className="text-4xl font-bold text-gray-300">0</h3>
                </div>
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
