import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => {

  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter();

  return (
    <div className="px-3 md:px-0 h-100 max-w-[40rem] mx-auto mt-5">
      <Head>
        <title>🎄🎁 Giftable 🎅🎁 - {title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <h1 className='text-5xl mb-1 text-center'>🎄🎁 Giftable 🎅🎁 </h1>
        {session ? (
          <nav className='text-center my-3'>
            <Link href="/">
              <a>Profile</a>
            </Link>{' '}
            |{' '}
            <Link href="/lists">
              <a>Lists</a>
            </Link>{' '}
            |{' '}
            <button onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}>
              <a>Sign Out</a>
            </button>
            {/* <Link href="/users">
          <a>Users List</a>
          </Link>{' '}
        | <a href="/api/users">Users API</a> */}
          </nav>
        ) : null}
      </header>
      <div className='my-3'>
        {children}
      </div>
      <footer className="text-center">
        <hr />
        <span>&copy; Copyright {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}

export default Layout
