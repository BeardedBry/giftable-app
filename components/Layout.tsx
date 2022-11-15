import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div className="h-100 w-[40rem] mx-auto mt-5">
    <Head>
      <title>🎄🎁 Giftable 🎅🎁 - {title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
    <h1 className='text-5xl mb-1 text-center'>🎄🎁 Giftable 🎅🎁 </h1>
      <nav className='text-center my-3'>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/about">
          <a>About</a>
        </Link>{' '}
        |{' '}
        <Link href="/users">
          <a>Users List</a>
        </Link>{' '}
        | <a href="/api/users">Users API</a>
      </nav>
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

export default Layout
