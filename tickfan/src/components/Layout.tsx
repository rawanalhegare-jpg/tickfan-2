import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Ticket, ShieldCheck, TrendingUp, Trophy, MapPin, Search, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Trophy },
  { href: "/matches", label: "Matches", icon: MapPin },
  { href: "/teams", label: "Teams", icon: ShieldCheck },
  { href: "/marketplace", label: "Marketplace", icon: Ticket },
  { href: "/intelligence", label: "Intelligence", icon: TrendingUp },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-glass transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
                <Ticket className="h-6 w-6 text-white transform -rotate-12" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-foreground">
                Tick<span className="text-primary">Fan</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/50 dark:bg-black/20 p-1.5 rounded-2xl border border-border/50">
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center gap-2",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute inset-0 bg-primary/10 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <link.icon className="w-4 h-4" />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted">
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/fan-id"
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-accent text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Fan ID
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Dashboard
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-background/95 backdrop-blur-xl z-40 overflow-y-auto"
        >
          <div className="flex flex-col p-6 gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl font-bold text-lg",
                  location === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link
              href="/fan-id"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl font-bold bg-accent text-accent-foreground"
            >
              Fan ID System
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-4 rounded-2xl font-bold bg-primary text-primary-foreground"
            >
              My Dashboard
            </Link>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-muted py-12 mt-auto border-t-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="font-display text-2xl font-black text-white">TickFan</span>
            </div>
            <p className="text-muted-foreground max-w-sm mb-6">
              The ultimate gateway to the Saudi football experience. Buy tickets, verify authenticity, check stadium entry predictions, and join the fan community.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/matches" className="hover:text-primary transition-colors">Find Matches</Link></li>
              <li><Link href="/teams" className="hover:text-primary transition-colors">Saudi Pro League</Link></li>
              <li><Link href="/marketplace" className="hover:text-primary transition-colors">Fan Marketplace</Link></li>
              <li><Link href="/stadium-entry" className="hover:text-primary transition-colors">Stadium Entry</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Fan ID Guide</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
