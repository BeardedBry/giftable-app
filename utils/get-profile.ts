import type { SupabaseClient } from "@supabase/supabase-js";

type Profile = {
    id: number,
    display_name: string,
    auth_user: string
  }

export default async function getProfile(supabase: SupabaseClient, userId: string): Promise<Profile | undefined> {
    try {
        let { data, error, status } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_user', userId)
            .single()

        if (error && status !== 406) {
            console.log('status', status);
            throw error
        }

        if (data) {
            return data;
        }
    } catch (error) {
        // alert('Error loading user data!')
        console.error(error);
        // console.log(error)
    }
}