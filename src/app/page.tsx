import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Navbar */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <span className="text-white font-bold text-lg">HelpDesk</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-blue-200 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-8">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          Support Ticketing System
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Resolve Issues{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Faster
          </span>
          <br />
          Together
        </h1>

        <p className="text-xl text-blue-200/70 mb-10 max-w-2xl mx-auto leading-relaxed">
          A modern helpdesk platform that streamlines support requests,
          tracks issues, and keeps your team and customers in sync.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-blue-500 transition-colors text-base shadow-lg shadow-blue-600/25"
          >
            Start for Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-white/20 transition-colors text-base"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              ),
              title: "Smart Ticketing",
              description: "Create tickets with priorities, descriptions, and file attachments. Track every issue from open to resolved.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              ),
              title: "Role-Based Access",
              description: "Separate dashboards for users and admins. Admins can assign, update, and manage all tickets.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              ),
              title: "Real-Time Notifications",
              description: "Instant notifications when tickets are updated or replied to. Never miss an important update.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              ),
              title: "Comments & Replies",
              description: "Threaded conversations on every ticket. Admins can also leave internal notes invisible to users.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              ),
              title: "File Attachments",
              description: "Upload screenshots, documents, and files directly to tickets. Drag and drop supported.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              ),
              title: "Filters & Search",
              description: "Filter tickets by status and priority. Admins get a powerful table view with quick actions.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-blue-200/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to streamline your support?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Get started for free. No credit card required.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-base"
          >
            Create Free Account
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <span className="text-white/60 text-sm">HelpDesk © 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}