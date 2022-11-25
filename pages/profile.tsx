import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useProfileData } from "../hooks/useProfileData"
import Layout from '../components/Layout';


export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {
    },
  }
}


const ProfilePage = ({ }) => {

  const [loading, displayName, profileId, error] = useProfileData();

  return (
    <Layout title="Profile">
      <div className="container" style={{ padding: '20px 0 100px 0' }}>
        <p className="text-center text-xl">Welcome {displayName}!!</p>
        TODO: Add a profile picture here.

      </div>
    </Layout>
  )
}

export default ProfilePage;
