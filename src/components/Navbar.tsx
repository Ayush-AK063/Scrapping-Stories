"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [toastMessage, setToastMessage] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-gray-900">
          HN Stories
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className={`rounded px-3 py-1.5 ${
              isActive("/") ? "bg-gray-900 text-white" : "text-gray-700"
            }`}
          >
            Stories
          </Link>

          <button
            onClick={() => {
              if (!user) {
                setToastMessage("Please login to view bookmarks.");
                setTimeout(() => setToastMessage(""), 3000);
                router.push("/login");
              } else {
                router.push("/bookmarks");
              }
            }}
            type="button"
            className={`rounded px-3 py-1.5 ${
              isActive("/bookmarks")
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Bookmarks
          </button>

          {!user ? (
            <Link
              href="/login"
              className={`rounded px-3 py-1.5 ${
                isActive("/login") || isActive("/register")
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Login/Register
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-3 py-1.5 text-white"
              type="button"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white shadow-lg transition-opacity">
          {toastMessage}
        </div>
      )}
    </header>
  );
}
