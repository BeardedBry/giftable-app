import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useProfileData } from "../hooks/useProfileData"
import Layout from '../components/Layout';
import { Input, Button } from "reakit";
import { Spinner } from "../components/Spinner";

import getProfile from '../utils/get-profile';
import { useState } from "react";


export const getServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  const userProfile = await getProfile(supabase, user.id)

  console.log('userProfile', userProfile)
  // check if user is in users (profile) table.

  // new user route
  if (!userProfile) {
    return {
      props: {
        newUser: true,
        user: null,
      }
    }
  }


  return {
    props: {
      newUser: false,
    },
  }
}


const ProfilePage = ({ newUser }) => {

  const [username, setUsername] = useState("");

  if (newUser) {
    return (
      <Layout title="Profile">
        <div className="container" style={{ padding: '20px 0 100px 0' }}>
            <h2>Welcome New User!</h2>
            <p>Fill out some info below to get started</p>
          <form action="/api/adduser" method="post" className="flex flex-col w-60 gap-2 mt-12">
            <label className="text-left" htmlFor="email">Desired Username:</label>
            <Input required className="border py-1" placeholder="username" id="username" name="username" onChange={(e => setUsername(e.target.value))} value={username} />
            <Button
              className="p-2 bg-purple-500 text-white rounded-md"
              type="submit"
              value="Submit"
            // onClick={}
            >
              Let's Go!
            </Button>
          </form>
        </div>
      </Layout >
    )
  }

  return (
    <Layout title="Profile">
      <div className="container" style={{ padding: '20px 0 100px 0' }}>
        Welcome Returning User
      </div>
    </Layout >
  )
  // const [loading, displayName, profileId, error] = useProfileData();

  // console.log('loading', loading);
  // console.log('display name', displayName);

  // return (
  //   <Layout title="Profile">
  //     {loading && !displayName ? (
  //       <Spinner />
  //     ) : displayName ? (
  //       <div className="container" style={{ padding: '20px 0 100px 0' }}>
  //         <p className="text-center text-xl">Welcome {displayName}!!</p>
  //       </div>
  //     ) : null
  //     }
  //   </Layout >
  // )
}

export default ProfilePage;
