import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const supabase = createServerSupabaseClient({ req, res })

    const { profileId } = req.body;

    let { data: group, error: group_id_error } = await supabase
        .from('group_to_profile')
        .select('*').eq('profile', profileId).single(); //single for now since we have 1 group

    if (!group) {
        //  console.error(group_id_error)
        return res.status(404).end();
    }

    let { data: profiles_in_group, error: profile_in_group_error } = await supabase
        .from('group_to_profile')
        .select('*').eq('group', group.group);

    const profileIds = profiles_in_group.map((group) => group.profile);

    let { data: profiles_data, error } = await supabase
        .from('profiles')
        .select('*').in('id', profileIds);

    res.status(200).json({ data: profiles_data });
}