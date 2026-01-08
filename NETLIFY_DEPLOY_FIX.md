# Netlify Deployment Fix

## Issue: Base directory does not exist: /opt/build/repo/main

The error occurs because Netlify's site settings have the base directory set to "main" instead of being empty.

## Fix in Netlify Dashboard:

1. Go to your Netlify site dashboard
2. Click on **Site configuration** (or **Site settings**)
3. Navigate to **Build & deploy** → **Continuous deployment**
4. Find **Build settings** section
5. Look for these settings:

### Update These Values:

- **Base directory**: Leave **EMPTY** or set to `/` (root)
- **Build command**: Leave **EMPTY** (no build needed)
- **Publish directory**: Set to `.` (current directory/root)

### Or Reset to Defaults:

Click **Clear build cache** and **Clear deploy cache** if available, then:
- Remove any custom base directory
- Ensure base directory field is blank

6. Click **Save** or **Update settings**
7. Trigger a new deploy: **Deploys** → **Trigger deploy** → **Deploy site**

## Alternative: Deploy Without Configuration

If the dashboard settings are tricky, try this:

1. Delete the site in Netlify
2. Create a new site
3. When prompted for build settings, leave everything **blank/default**
4. Let Netlify auto-detect (it will see index.html and serve as static site)

## Expected Working Configuration:

```
Base directory: (empty)
Build command: (empty)
Publish directory: .
```

The site should deploy successfully after these changes!
