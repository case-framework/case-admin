

const isDev = process.argv.indexOf('dev') !== -1
const isBuild = process.argv.indexOf('build') !== -1
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
    process.env.VELITE_STARTED = '1'
    const { build } = await import('velite')
    await build({ watch: isDev, clean: !isDev })
}


/** @type {import('next').NextConfig} */
const nextConfig = {

    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        }
    },
    async headers() {
        return [
            {
                source: '/(.*?)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: process.env.HEADER_X_FRAME_OPTIONS || 'SAMEORIGIN',
                    },
                    {
                        key: 'Content-Security-Policy',
                        // https://cdn.jsdelivr.net is needed for Monaco Editor
                        value: process.env.HEADER_CSP || "default-src 'self' https://cdn.jsdelivr.net; frame-ancestors 'self'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; script-src 'self' 'unsafe-eval' 'unsafe-inline' data: * blob: *; connect-src 'self'; img-src 'self' data: *; frame-src data: *",
                    },
                    {
                        key: 'Permissions-Policy',
                        value: process.env.HEADER_PERMISSIONS_POLICY || 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ]
    }
}

export default nextConfig
