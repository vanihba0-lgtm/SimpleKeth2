"use client";

import { Navbar } from "@/components/navbar";
import { ServiceWorkerRegistrar } from "@/components/sw-registrar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerRegistrar />
      <Navbar />
      {/* Main content area with sidebar offset on desktop */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
}
