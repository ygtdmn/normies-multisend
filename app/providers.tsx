'use client';

import { useState, useEffect } from 'react';
import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { fallback, http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '@/lib/theme';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
  appName: 'Normies Multi-Send',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet],
  ssr: true,
  transports: {
    [mainnet.id]: fallback([
      http('https://eth.drpc.org'),
      http('https://eth.llamarpc.com'),
      http('https://mainnet.gateway.tenderly.co'),
      http('https://ethereum-rpc.publicnode.com'),
    ]),
  },
});

const queryClient = new QueryClient();

function RainbowKitThemed({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();

  const theme = isDark
    ? darkTheme({
        accentColor: '#e3e5e4',
        accentColorForeground: '#1a1b1c',
        borderRadius: 'none',
        fontStack: 'system',
      })
    : lightTheme({
        accentColor: '#48494b',
        accentColorForeground: '#e3e5e4',
        borderRadius: 'none',
        fontStack: 'system',
      });

  return (
    <RainbowKitProvider theme={theme}>
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <ThemeProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitThemed>
            {mounted ? children : null}
          </RainbowKitThemed>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
