import React from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";

const useProfileData = () => {

  // const session = useSession()
  const supabase = useSupabaseClient()
  const user = useUser();

  const [loading, setLoading] = React.useState(true)
  const [username, setUsername] = React.useState(null)
  const [userId, setUserId] = React.useState(null)

  React.useEffect(() => {
    getProfile()
  }, [user])

  async function getProfile() {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      let { data, error, status} = await supabase
        .from('users')
        .select('*')
        .eq('auth_user', user.id)
        .single()

      if (error && status !== 406) {
        console.log('status', status);
        throw error
      }

      if (data) {
        setUsername(data.display_name)
        setUserId(data.id)
      }
    } catch (error) {
      // alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return [loading, username, userId];

}

export { useProfileData }