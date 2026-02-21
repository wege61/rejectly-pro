import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Get a valid jwt or mock auth for local fetch, but it requires auth.
// We can just call our backend function directly since it's Nextjs.
