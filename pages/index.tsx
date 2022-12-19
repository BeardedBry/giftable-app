import Layout from '../components/Layout';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Auth, ThemeMinimal } from '@supabase/auth-ui-react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import React from 'react';
import { useRouter } from 'next/router';

export const getServerSideProps = async (ctx) => {

  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session)
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    }

  return {
    props: {
    },
  }
}


const IndexPage = ( ) => {
  
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  if(user){
    router.replace("/profile");
  }

  return (
    <Layout title="Home">
      <div className="container m-auto" style={{ padding: '20px 0 100px 0' }}>
        <div className="max-w-md mx-auto">
        <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeMinimal,
              variables: {
                default: {
                  fontSizes: {
                    baseBodySize: '16px',
                    baseInputSize: '14px',
                    baseLabelSize: '16px',
                    baseButtonSize: '16px',
                  },
                  colors: {
                    brand: 'rgb(168 85 247)',
                    brandAccent: 'rgb(192 132 252)',
                  },
                  space: {
                    buttonPadding: '.5rem',
                    inputPadding: '.25rem',
                  },
                  radii: {
                    borderRadiusButton: '7px',
                    inputBorderRadius: '7px',
                  },
                },
              },
            }}
            theme="light"
          />
          {/* <SignIn /> */}
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
