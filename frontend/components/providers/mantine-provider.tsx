'use client';

import { ReactNode, useEffect, useState } from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from '@/components/auth/auth-provider';

interface MantineProviderClientProps {
  children: ReactNode;
}

export default function MantineProviderClient({ children }: MantineProviderClientProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider defaultColorScheme="light">
        <Notifications />
        <AuthProvider>
          {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
        </AuthProvider>
      </MantineProvider>
    </>
  );
}