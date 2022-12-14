import '../styles/globals.css';
import 'tailwindcss/tailwind.css';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { AppProps } from 'next/app';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'reakit';
import { ContextWrapper } from '../components/context';
import * as system from "reakit-system-bootstrap";


function MyApp({ Component, pageProps }: AppProps<{ initialSession: Session }>) {

  const queryClient = new QueryClient()

  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        {/* <Provider unstable_system={system} > */}
        <Provider>
          <ContextWrapper>
            <Component {...pageProps} />
          </ContextWrapper>
        </Provider>
      </QueryClientProvider>
    </SessionContextProvider>
  )
}

export default MyApp