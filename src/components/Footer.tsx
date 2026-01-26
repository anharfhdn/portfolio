import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <Link href="/" className="flex items-center h-12 w-60 relative shrink-0">
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
                        </Link>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Built with Next.js & Tailwind CSS
                        </p>
                    </div>

                    <div className="flex gap-6">
                        <a href="https://github.com/anharfhdn" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github size={20} />
                        </a>
                        <a href="https://www.linkedin.com/in/anhar-fahrudin/" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin size={20} />
                        </a>
                        <a href="mailto:anharfahrudin21@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Mail size={20} />
                        </a>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Anhar Fahrudin. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
