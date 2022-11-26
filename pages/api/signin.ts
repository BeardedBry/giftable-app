import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Get data submitted in request's body.
    const body = req.body

    // and returns early if they are not found
    if (!body.email || !body.password) {
        // Sends a HTTP bad request error code
        return res.status(400).json({ data: 'Field missing data' })
    }

    const supabase = createServerSupabaseClient({ req, res })
    // Check if we have a session

    const { email, password } = body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (!data) return res.status(400).json({ data: 'invalid login' })

    // register to users ("profile") table
    

    // Valid Login
    // Sends a HTTP success code
    return res.redirect(200, '/profile');
    // res.status(200).json({ data: `${body.email}` })
}