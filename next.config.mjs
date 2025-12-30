/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly expose environment variables
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

export default nextConfig;
