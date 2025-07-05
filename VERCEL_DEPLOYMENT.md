# Vercel Deployment Guide

## Environment Variables Setup

After adding the Vercel Edge adapter, you need to configure your environment variables in Vercel:

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add the following variables:**

```
PRIVATE_TURSO_DATABASE_URL=libsql://your-database-name.turso.io
PRIVATE_TURSO_AUTH_TOKEN=your-auth-token-here
```

## Build Configuration

The `vercel.json` file has been updated with:
- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- `framework`: `qwik`

## Deployment Steps

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Add Vercel Edge adapter and fix deployment config"
   git push origin main
   ```

2. **Vercel should automatically redeploy** when it detects the push to main

3. **If it doesn't redeploy automatically:**
   - Go to your Vercel dashboard
   - Click "Redeploy" on your latest deployment
   - Or trigger a new deployment manually

## Troubleshooting

If you still get 404 errors:
1. Check that environment variables are set correctly in Vercel
2. Verify the build logs in Vercel dashboard
3. Make sure the `dist` directory is being generated correctly
4. Check that the Vercel Edge function is being built properly

## Local Testing

You can test the Vercel build locally:
```bash
npm run build
npm run preview
``` 