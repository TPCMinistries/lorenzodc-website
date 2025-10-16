'use client';

import { usePathname } from 'next/navigation';
import GlobalNavigation from './GlobalNavigation';
import NewsletterSignup from './NewsletterSignup';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isUSAPage = pathname === '/USA';

  return (
    <>
      {!isUSAPage && <GlobalNavigation />}

      <main className={isUSAPage ? "pt-0 pb-0" : "pt-24 pb-24"}>
        {children}
      </main>

      {!isUSAPage && (
        <footer className="border-t border-slate-800 bg-slate-900">
          <div className="container mx-auto px-4 py-16">
            {/* Newsletter Section */}
            <div className="max-w-2xl mx-auto mb-12">
              <NewsletterSignup variant="footer" />
            </div>

            {/* Footer Links */}
            <div className="border-t border-slate-800 pt-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-slate-400">
                <p>© {new Date().getFullYear()} The Catalyst Path. Built with integrity &amp; foresight.</p>
                <div className="flex gap-6">
                  <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                  <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                  <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}