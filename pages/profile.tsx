import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useTabState, Tab, TabList, TabPanel } from "reakit/Tab";
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuButton,
  MenuSeparator,
} from "reakit/Menu";
import Layout from '../components/Layout';
import { Input, Button } from 'reakit';
import List from '../components/List'

import getProfile from '../utils/get-profile';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


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

  // console.log('userProfile ', userProfile);

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
  const router = useRouter();
  const tab = useTabState();
  const [username, setUsername] = useState("");
  // const menu = useMenuState();
  // const [groupIds, setGroupIds] = useState([]);
  // const [profiles, setProfiles] = useState([]);

  const groupProfilesQuery = useQuery({
    queryKey: [profileId, displayName],
    queryFn: async () => {

      const groupData = await axios.post('/api/get-group', { profileId });
      const profilesData = groupData.data.data.filter(profile => profile.id !== profileId);

      return profilesData;
    },
    staleTime: 60000,
  });

  // useEffect(() => {
  //   if (!displayName) {
  //     return;
  //   }

  //   // TODO: Optimize and secure
  //   const readGroups = async () => {
  //     try {
  //       const groupData = await axios.post('/api/get-group', { profileId });
  //       // console.log('profiles_data', groupData);
  //       const profiles_data = groupData.data.data;

  //       setProfiles(profiles_data.filter(profile => profile.id !== profileId));

  //     } catch (e) {
  //       console.error(e);
  //     }

  //   }

  //   readGroups();


  // }, [displayName])


  const createProfile = async (e) => {
    e.preventDefault();

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
      console.error(error);
    }
    router.reload();
  }



  if (newUser) {
    return (
      <Layout title="Profile">
        <div className="container" style={{ padding: '20px 0 100px 0' }}>
          <div className="mx-auto w-72">
            <h2>Welcome New User!</h2>
            <p>Fill out some info below to get started</p>
            <form onSubmit={createProfile} className="flex flex-col w-60 gap-2 mt-12">
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
        <hr className="my-6" />

        {groupProfilesQuery.data ? (
          <div>
            <>
              <TabList {...tab} aria-label="Lists" className="flex gap-6">
                <Tab {...tab} id={profileId}>My List</Tab>
                {groupProfilesQuery.data.map((profile) => <Tab {...tab} id={profile.id} key={profile.id}>{profile.display_name}</Tab>)}
              </TabList>
              <TabPanel {...tab}>
                {/* My List */}
                <List props={{ display_name: displayName, id: profileId, profileId }} />
              </TabPanel>
              {groupProfilesQuery.data.map((profile) => (
                <TabPanel {...tab} id={profile.id} key={profile.id}>
                  <List props={{ ...profile, profileId }} />
                </TabPanel>)
              )}
            </>

            {/* <>
            <MenuButton {...menu}>Wish Lists</MenuButton>
            <Menu {...menu} aria-label="Wish Lists">
                {profiles.map((profile) => <MenuItem {...menu} id={profile.id} key={profile.id}>{profile.display_name}</MenuItem>)}
              <MenuSeparator {...menu} />
              <MenuItem {...menu}>Keyboard shortcuts</MenuItem>
            </Menu>
          </> */}
          </div>
        ) :groupProfilesQuery.isLoading ? (
          <p>loading...</p>
        ) : groupProfilesQuery.isError ? (
          <p>Error</p>
        ) : null}
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
