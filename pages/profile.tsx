import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuButton,
} from "reakit/Menu";
import Layout from '../components/Layout';
import { Input, Button } from 'reakit';
import List from '../components/List'

import { getProfileFromAuid } from '../utils/get-profile';
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "../components/context";
import { AddRequest } from "../components/AddRequest";


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
              <div style={{ position: "sticky" }} className="top-0 py-3 bg-white flex justify-between">
                <div>
                  <MenuButton {...menu} className={menuTwElements.button} >
                    {selectedProfile?.display_name ?? "Wish Lists"}
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="caret-down"
                      className="w-2 ml-2"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path
                        fill="currentColor"
                        d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                      ></path>
                    </svg>
                  </MenuButton>
                  <Menu {...menu} aria-label="Wish Lists" className={menuTwElements.menu}>
                    <MenuItem {...menu} className={menuTwElements.items} id={profileId} onClick={() => {
                      setSelectedProfile({ id: profileId, display_name: displayName })
                    }}>
                      My List
                    </MenuItem>
                    {groupProfilesQuery.data.map((profile) =>
                      <MenuItem {...menu} className={menuTwElements.items} id={profile.id} key={profile.id} onClick={menuClick} >
                        {profile.display_name}
                      </MenuItem>)}
                  </Menu>
                </div>
                <AddRequest listOwnerId={selectedProfile.id} requesterId={profileId} listDisplayName={selectedProfile?.display_name} />
              </div>
              {selectedProfile && <List props={{ ...selectedProfile, profileId: profileId }} />}
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
}

export default ProfilePage;


const menuTwElements = {
  menu: "dropdown-menu min-w-max absolute bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none",
  button: "dropdown-toggle px-6 py-2.5 bg-green-600 text-white font-medium text-sm leading-tight rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg active:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap",
  items: "dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100",
}