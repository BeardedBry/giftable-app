import type { SupabaseClient } from "@supabase/supabase-js";

export type Profile = {
    id: number,
    display_name: string,
    auth_user: string
}

export async function getProfileFromAuid(supabase: SupabaseClient, userId: string): Promise<Profile | undefined> {
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

export async function getProfileFromId(supabase: SupabaseClient, profileId: string): Promise<Profile | undefined> {
    try {
        let { data, error, status } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
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