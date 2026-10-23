// Any setup scripts you might need go here

// Load env files. Next's loader skips .env.local when NODE_ENV=test, so load it explicitly
// (first file wins; existing process.env values are never overwritten).
import { config } from 'dotenv'

config({ path: ['.env.local', '.env'] })
