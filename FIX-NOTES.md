# Performance / 503 fixes (no data is read-modified or deleted)

1. api/lib/db.mjs  - listJson now uses ONE D1 query (listValues) instead of 1 + N queries.
2. api/lib/seed.mjs - seed/scope markers are confirmed once per Worker isolate, not on every request.
3. SMPS-Lab/*.html, index.html - shared JS/CSS/images moved to hashed files in shared/ and img/ (lossless, verified).
4. _headers (+ scripts/build.mjs) - long cache for hashed files, 1 day for assets/data/*.
Deploy: npm run build && npx wrangler deploy   (back up first: npx wrangler d1 export chnm-portal --remote --output=backup-chnm.sql)
