import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Button } from "reakit/Button";
import { Input } from "reakit/Input";
import { Auth, ThemeMinimal } from '@supabase/auth-ui-react'

import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import SignIn from '../components/SignIn';
import { NewUser } from '../components/NewUser';
import { useProfileData } from '../hooks/useProfileData';

export const getServerSideProps = () => {
  return {
    props: {
      test: 'test'
    }
  }
}


const IndexPage = ({ test }) => {

  const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser();

  const [loading, displayName, profileId] = useProfileData();

  // console.log(session, supabase);

  // React.useEffect(() => {
  //   if (!session || !user) {
  //     return;
  //   }

  //   async function getUserData() {

  //     let { data, error } = await supabase
  //       .from('users')
  //       .select('*')
  //       .eq('auth_user', user.id)

  //     if (data[0]?.display_name) {
  //       setUserData(data[0]);
  //     } else if (error) {
  //       setUserData(undefined);
  //     }

  //     console.log(error, data);
  //     // setUserData(users);
  //   }

  //   getUserData();

  // }, [session, user])


  return (
    <Layout title="Home">
      <div className="container" style={{ padding: '20px 0 100px 0' }}>
        {!session ? (
          // <Auth
          //   supabaseClient={supabase}
          //   appearance={{
          //     theme: ThemeMinimal,
          //     variables: {
          //       default: {
          //         colors: {
          //           brand: 'rgb(168 85 247)',
          //           brandAccent: 'rgb(192 132 252)',
          //         },
          //         space: {
          //           buttonPadding: '.5rem',
          //           inputPadding: '.25rem'
          //         }
          //       },
          //     },
          //   }}
          //   theme="light"
          // />
          <SignIn />
        ) :
          loading ? (
            <></>
          ) : (
            displayName ? (
              <p className="text-center text-xl">Welcome {displayName}!!</p>
            ) : (
              <>
                <h2 className="text-center text-lg pb-3">Welcome new User!</h2>
                <p>Enter desired username: </p>
                <NewUser />
              </>
            )
          )}
      </div>
    </Layout>
  )
}

export default IndexPage
