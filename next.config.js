/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    /* config options here */
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/supabaseurl',
    //             destination: `https://sqfzisbtabgaxfabtaqm.supabase.co`,
    //         },
    //     ]
    // }
    pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts', 'py'],
}

module.exports = nextConfig