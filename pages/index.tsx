import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Button } from "reakit/Button";
import { Input } from "reakit/Input";
import { Auth, ThemeMinimal, ThemeSupa } from '@supabase/auth-ui-react'

import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
// import { Database } from '../database.types'


export async function getServerSideProps() {

  const supabaseUrl = 'https://sqfzisbtabgaxfabtaqm.supabase.co'
  const supabaseRestUrl = 'https://sqfzisbtabgaxfabtaqm.supabase.co/rest/v1'
  const supabaseKey = process.env.SUPABASE_KEY

  // const { data, error } = await supabase
  // .from('profiles')
  // .select(`
  //     id
  // `);

  return {
    props: { supabaseUrl, supabaseKey }
  }
}


const IndexPage = ({ }) => {

  const session = useSession()
  const supabase = useSupabaseClient()

  console.log(session, supabase);


  return (
    <Layout title="Home">
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        {!session ? (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeMinimal,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(168 85 247)',
                    brandAccent: 'rgb(192 132 252)',
                  },
                  space: {
                    buttonPadding: '.5rem',
                    inputPadding: '.25rem'
                  }
                },
              },
            }}
            theme="light"
          />
        ) : (
          <p>Account page will go here.</p>
        )}
      </div>
    </Layout>
  )



  // return (
  //   <Layout title="Home">
  //     <div>
  //       <div className="flex flex-col w-60 gap-2">
  //         <h2>User</h2>
  //         <Input placeholder="Email" onChange={(e => setEmail(e.target.value))} value={email} />
  //         <Input placeholder="Password" type="password" onChange={(e => setPassword(e.target.value))} />
  //         <Button
  //           className="p-2 bg-purple-500 text-white rounded-md"
  //           onClick={signIn}
  //         >
  //           Sign In
  //         </Button>
  //       </div>
  //     </div>
  //   </Layout>
  // )
}

export default IndexPage
