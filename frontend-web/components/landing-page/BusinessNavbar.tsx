"use client";

import { useRouter } from "next/navigation";

// Dark Theme
import { ThemeProvider } from "@/components/theme-provider";
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

//User Context
import { useUser } from "@/context/UserContext";

import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function BusinessNavbar() {
  const { setTheme } = useTheme()
  const router = useRouter()
  const { role } = useUser();

  const isGuest = role === "guest";
  const buttonText = isGuest ? "Login" : "Dashboard";
  const redirectPath = isGuest ? "/login" : "/app";

  return <nav className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur-xl border-border">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">

      {/*Left Side Top Navbar*/}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/donor-sync-icon-rounder.svg"
            alt="Icon"
            className="w-8 h-8 rounded-md"
          />
          <span className="text-xl font-semibold hide-text">DonorSync</span>
        </Link>
      </div>



      {/*Right Side Top Navbar*/}
      <div className="flex items-center gap-4">

        {/*GitHub Repo Button*/}
        <Button variant="outline" size="icon" asChild>
          <a
            href="https://github.com/saad2134/donor-sync"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-[1.2rem] w-[1.2rem] transition-all hover:scale-110"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.287-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.495.998.108-.775.42-1.305.763-1.605-2.665-.303-5.467-1.335-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.653.243 2.873.12 3.176.77.84 1.232 1.91 1.232 3.22 0 4.61-2.807 5.624-5.48 5.92.431.372.815 1.102.815 2.222 0 1.606-.015 2.898-.015 3.293 0 .323.216.7.825.58C20.565 21.795 24 17.303 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </Button>


        {/*UI Theme Changer button*/}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>




        <button
          onClick={() => router.push(redirectPath)}
          className="relative inline-flex h-[2.2rem] overflow-hidden rounded-md p-[1px] 
        focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          {/* Border effect layer */}
          <span className="absolute inset-[-1000%] rounded-md animate-[spin_2s_linear_infinite] 
        bg-[conic-gradient(from_90deg_at_50%_50%,#FF8787_0%,#f31818_50%,#FF8787_100%)]" />

          {/* Inner button with shimmer effect */}
          <span className="relative inline-flex h-full w-full items-center justify-center rounded-md 
        dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] 
        bg-[linear-gradient(110deg,#FFFFFF,45%,#E6E6E6,55%,#FFFFFF)] 
        bg-[length:200%_100%] animate-shimmer px-6 font-medium text-slate-800 
        dark:text-slate-400 transition-colors"
          >
            {buttonText}
          </span>
        </button>

      </div>
    </div>
  </nav>;
}