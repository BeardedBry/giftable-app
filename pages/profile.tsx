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

import { getProfileFromAuid } from '../utils/get-profile';
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../components/context";


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
  const userProfile = await getProfileFromAuid(supabase, user.id)

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
  // const tab = useTabState();
  const menu = useMenuState();
  const [username, setUsername] = useState("");
  const { data, setData: setAppData } = useAppContext();
  const [selectedProfile, setSelectedProfile] = useState<{ auth_user?: string, display_name: string, id: number }>({ id: profileId, display_name: displayName });


  const groupProfilesQuery = useQuery({
    queryKey: [profileId, displayName],
    queryFn: async () => {

      const groupData = await axios.post('/api/get-group-profiles', { profileId });
      const profilesData = groupData.data.data.filter(profile => profile.id !== profileId);
      setAppData({ profiles: groupData.data.data })

      return profilesData;
    },
    staleTime: 60000,
    // cacheTime: 25000,
  });


  const createProfile = async (e) => {
    e.preventDefault();

    if (username.length < 3) {
      alert("username too short");
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .insert([
        { display_name: username, auth_user: user.id },
      ]);

    if (error) {
      console.error(error);
    }
    router.reload();
  }


  const menuClick = () => {
    menu.hide();
    const selected = groupProfilesQuery.data.find(profile => profile.id == menu.currentId);
    setSelectedProfile(selected);
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
      <div className="container m-auto" style={{ padding: '20px 0 100px 0' }}>
        Welcome {displayName}!!
        <hr className="my-6" />

        {groupProfilesQuery.data ? (
          <>
            <div className="m-auto">
              <>
                <MenuButton {...menu}>Wish Lists</MenuButton>
                <Menu {...menu} aria-label="Wish Lists">
                  <MenuItem {...menu} id={profileId} onClick={() => {
                    setSelectedProfile({ id: profileId, display_name: displayName })
                  }}>
                    My List
                  </MenuItem>
                  {groupProfilesQuery.data.map((profile) =>
                    <MenuItem {...menu} id={profile.id} key={profile.id} onClick={menuClick} >
                      {profile.display_name}
                    </MenuItem>)}
                </Menu>
                {selectedProfile && <List props={{ ...selectedProfile, profileId: profileId }} />}
              </>
            </div>
          </>
        ) : groupProfilesQuery.isLoading ? (
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
