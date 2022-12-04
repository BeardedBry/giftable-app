
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createServerSupabaseClient({ req, res })
    // Check if we have a session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return res.status(403).json({ data: 'Acces Denied' })

    const { url } = req.body

    const result = await metaFetcher(url ?? '');

    console.log('meta result', result);


    // (async () => {
    //     const result = await metaFetcher('https://hoppscotch.io/');
    //     console.log(result);

    //     /*
    //           {
    //               metadata: {
    //                   website: 'https://hoppscotch.io/',
    //                   title: 'Hoppscotch - Open source API development ecosystem',
    //                   description: 'Helps you create requests faster, saving precious time on development.',
    //                   banner: 'https://hoppscotch.io/banner.jpg',
    //                   themeColor: '#202124'
    //               },
    //               socials: {
    //                   'twitter:site': '@hoppscotch_io',
    //                   'twitter:creator': '@hoppscotch_io'
    //               },
    //               favicons: [
    //                   'https://hoppscotch.io/_nuxt/icons/icon_64x64.9834b3.png',
    //                   'https://hoppscotch.io/_nuxt/icons/icon_512x512.9834b3.png'
    //               ]
    //           }
    //       */
    // })();


    res.status(200).json({ data: result })
}

import metaFetcher from 'meta-fetcher';