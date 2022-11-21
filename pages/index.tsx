import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Button } from "reakit/Button";
import { Input } from "reakit/Input";

import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
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

  // const supabase = createClient(supabaseUrl, supabaseKey, options)

  // console.log('supabase ', supabase);
  
  const supabaseClient = useSupabaseClient();
  const user = useUser() 

  console.log('supabase client', supabaseClient, 'user: ', user);
  

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const signIn = async () => {
    console.log('email: ', email)
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: email,
    //   password: password
    // })

    // console.log('data, error', data, error);
  }



  return (
    <Layout title="Home">
      <div>
        <div className="flex flex-col w-60 gap-2">
          <h2>User</h2>
          <Input placeholder="Email" onChange={(e => setEmail(e.target.value)) } value={email} />
          <Input placeholder="Password" type="password" onChange={(e => setPassword(e.target.value)) } />
          <Button 
            className="p-2 bg-purple-500 text-white rounded-md"
            onClick={signIn}
          >
            Sign In
          </Button>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
