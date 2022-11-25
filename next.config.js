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
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
        });

        return config;
    },
}

module.exports = nextConfig