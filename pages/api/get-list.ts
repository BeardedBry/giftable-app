import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createServerSupabaseClient({ req, res })
    // Check if we have a session
    const {
        data: { user },
      } = await supabase.auth.getUser()

    if (!user) return res.status(403).json({ data: 'Acces Denied' })

    

    
    const body = req.body


    res.status(200).json({ data: `${body.email}` })
}