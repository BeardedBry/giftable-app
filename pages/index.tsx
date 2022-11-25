import Layout from '../components/Layout';
import SignIn from '../components/SignIn';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

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

  return (
    <Layout title="Home">
      <div className="container" style={{ padding: '20px 0 100px 0' }}>
        <div className="text-center">
          <SignIn />
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
