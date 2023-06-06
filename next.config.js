/** @type {import('next').NextConfig} */
const nextConfig = {
  appDir: true,
  serverComponentsExternalPackages: ["mongoose"],
  serverRuntimeConfig: {
      connectionString: "mongodb://localhost/next-js-registration-login-example",
      secret: 'Ifbt@iy7'
  }
}

module.exports = nextConfig
