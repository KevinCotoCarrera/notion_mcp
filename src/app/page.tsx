"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@components/ui/shadcn/button";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gray-50 transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/75 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-2xl font-semibold text-primary">
            Notion MCP
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <Link href="/notion/sprint-dashboard" className="hover:text-primary">
              Sprint Dashboard
            </Link>
            <Link href="/notion/table-viewer" className="hover:text-primary">
              Table Viewer
            </Link>
            <Link href="/notion/llm-suggestions" className="hover:text-primary">
              LLM Suggestions
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-gray-100 to-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
            Notion Workflow Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Manage your Notion databases, sprints, and tasks with AI-powered suggestions using DeepSeek LLM.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/notion/sprint-dashboard">
              <Button size="lg">Sprint Dashboard</Button>
            </Link>
            <Link href="/notion/table-viewer">
              <Button variant="outline" size="lg">Table Viewer</Button>
            </Link>
            <Link href="/notion/llm-suggestions">
              <Button variant="outline" size="lg">LLM Suggestions</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sprint Management</h3>
            <p className="text-gray-600">Track sprints, backlogs, and epics with Kanban boards and dashboards.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Database Integration</h3>
            <p className="text-gray-600">Connect to Notion workspaces and manipulate databases seamlessly.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Suggestions</h3>
            <p className="text-gray-600">Get intelligent task suggestions powered by DeepSeek LLM.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Notion MCP Workflow Manager</p>
        </div>
      </footer>
    </div>
  );
}
