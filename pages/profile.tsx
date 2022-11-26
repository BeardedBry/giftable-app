import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useProfileData } from "../hooks/useProfileData"
import Layout from '../components/Layout';
import { Input, Button } from "reakit";
import { Spinner } from "../components/Spinner";

import getProfile from '../utils/get-profile';
import { useEffect, useState } from "react";


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

  // check if user is in users (profile) table.
  const userProfile = await getProfile(supabase, user.id)

  // console.log('userProfile', userProfile)
  // new user route
  if (!userProfile) {
    return {
      props: {
        newUser: true,
        displayName: null,
        profileId: null
      }
    }
  }

  const displayName = userProfile.display_name;
  const profileId = userProfile.id;

  return {
    props: {
      newUser: false,
      displayName,
      profileId,
    },
  }
}



const ProfilePage = ({ newUser, displayName, profileId }) => {


  const supabase = useSupabaseClient();
  const user = useUser();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!displayName) {
      return;
    }

    const readGroups = async () => {

      let { data: group_to_profile, error: group_to_profile_error } = await supabase
        .from('group_to_profile')
        .select('*').eq('profile', parseInt(profileId, 10))

      console.log(group_to_profile);
      console.error(group_to_profile_error);

      if (!group_to_profile?.length) {
        return null;
      }

      const groupIds = group_to_profile.map((g) => g.group)

      console.log('groupIds', groupIds);
      

      let { data: groups, error } = await supabase
      .from('groups')
      .select('*').in('id', groupIds);

      console.log('groups', groups, error);
      return group_to_profile;
    }

    readGroups();


  }, [displayName])


  const createProfile = async () => {
    if (username.length < 3) {
      alert("username too short");
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { display_name: username, auth_user: user.id },
      ]);

    if (error) {
      alert(error.message)
      console.error(error.message);
    }
  }




  if (newUser) {
    return (
      <Layout title="Profile">
        <div className="container" style={{ padding: '20px 0 100px 0' }}>
          <div className="mx-auto w-72">
            <h2>Welcome New User!</h2>
            <p>Fill out some info below to get started</p>
            <form onSubmit={createProfile} method="post" className="flex flex-col w-60 gap-2 mt-12">
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
        </div>
      </Layout >
    )
  }

  return (
    <Layout title="Profile">
      <div className="container" style={{ padding: '20px 0 100px 0' }}>
        Welcome {displayName}!!
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
