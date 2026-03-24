'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTheme } from '@/lib/theme';

export function Layout({ children }: { children: React.ReactNode }) {
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-normies-light dark:bg-normies-darker text-normies-dark dark:text-normies-light flex flex-col">
      {/* Header */}
      <header className="border-b border-normies-dark dark:border-normies-light px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href="https://normies.art"
            target="_blank"
            rel="noopener noreferrer"
            className="font-robotastic text-2xl md:text-3xl tracking-wider hover:opacity-60 transition-opacity"
          >
            NORMIES
          </a>
          <span className="text-xs uppercase tracking-[0.3em] opacity-60 hidden sm:inline">
            MULTI-SEND
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://x.com/normiesART"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://opensea.io/collection/normies"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="OpenSea"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg viewBox="0 0 360 360" fill="currentColor" width="18" height="18">
                <path d="M181.566 0C80.91-0.828-0.828 80.91 0 181.566c0.846 97.74 80.694 177.606 178.416 178.416 100.656 0.864 182.43-80.91 181.566-181.566C359.172 80.712 279.306 0.846 181.566 0zm-53.82 89.586c11.52 14.634 18.414 33.156 18.414 53.244 0 17.406-5.166 33.606-14.04 47.124H69.714l57.996-100.368h0.036zM318.006 199.242v12.96c0 0.846-0.45 1.566-1.224 1.89-4.23 1.8-18.18 8.28-23.994 16.344-14.976 20.844-26.406 53.604-51.966 53.604H134.172c-37.764 0-69.354-29.97-69.336-69.894 0-0.99 0.846-1.8 1.836-1.8h50.544c1.746 0 3.114 1.404 3.114 3.114v9.756c0 5.184 4.194 9.396 9.396 9.396h38.34v-22.32h-26.19c15.066-19.08 24.03-43.164 24.03-69.39 0-29.25-11.214-55.926-29.574-75.87 11.106 1.296 21.726 3.51 31.734 6.444v-6.21c0-6.444 5.22-11.664 11.664-11.664s11.664 5.22 11.664 11.664v14.976c35.784 16.704 59.22 44.424 59.22 75.78 0 18.396-8.046 35.514-21.924 49.914-2.664 2.754-6.354 4.32-10.224 4.32h-27.054v22.284h33.966c7.326 0 20.466-13.896 26.694-22.266 0 0 0.27-0.414 0.99-0.63s62.37-14.364 62.37-14.364c1.296-0.36 2.574 0.63 2.574 1.944v0.018z" />
              </svg>
            </a>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-normies-dark dark:border-normies-light px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs uppercase tracking-wider opacity-60 text-center sm:text-left">
            NORMIES &mdash; Created by{' '}
            <a
              href="https://x.com/serc1n"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 opacity-80 transition-opacity"
            >
              Serc
            </a>{' '}
            and{' '}
            <a
              href="https://x.com/yigitduman"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 opacity-80 transition-opacity"
            >
              Yigit Duman
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/normiesART"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://opensea.io/collection/normies"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="OpenSea"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg viewBox="0 0 360 360" fill="currentColor" width="20" height="20">
                <path d="M181.566 0C80.91-0.828-0.828 80.91 0 181.566c0.846 97.74 80.694 177.606 178.416 178.416 100.656 0.864 182.43-80.91 181.566-181.566C359.172 80.712 279.306 0.846 181.566 0zm-53.82 89.586c11.52 14.634 18.414 33.156 18.414 53.244 0 17.406-5.166 33.606-14.04 47.124H69.714l57.996-100.368h0.036zM318.006 199.242v12.96c0 0.846-0.45 1.566-1.224 1.89-4.23 1.8-18.18 8.28-23.994 16.344-14.976 20.844-26.406 53.604-51.966 53.604H134.172c-37.764 0-69.354-29.97-69.336-69.894 0-0.99 0.846-1.8 1.836-1.8h50.544c1.746 0 3.114 1.404 3.114 3.114v9.756c0 5.184 4.194 9.396 9.396 9.396h38.34v-22.32h-26.19c15.066-19.08 24.03-43.164 24.03-69.39 0-29.25-11.214-55.926-29.574-75.87 11.106 1.296 21.726 3.51 31.734 6.444v-6.21c0-6.444 5.22-11.664 11.664-11.664s11.664 5.22 11.664 11.664v14.976c35.784 16.704 59.22 44.424 59.22 75.78 0 18.396-8.046 35.514-21.924 49.914-2.664 2.754-6.354 4.32-10.224 4.32h-27.054v22.284h33.966c7.326 0 20.466-13.896 26.694-22.266 0 0 0.27-0.414 0.99-0.63s62.37-14.364 62.37-14.364c1.296-0.36 2.574 0.63 2.574 1.944v0.018z" />
              </svg>
            </a>
            <a
              href="https://github.com/ygtdmn/normies"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
