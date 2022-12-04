import type { SupabaseClient } from "@supabase/supabase-js";

export default async function getProfile(supabase: SupabaseClient, profileId: number) {
    try {
        let { data , error, status } = await supabase
            .from('group_to_profile')
            .select('*').eq('profile', profileId).single(); //single for now since we have 1 group

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