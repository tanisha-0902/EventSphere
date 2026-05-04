# Admin Login Not Working on Render - TROUBLESHOOTING GUIDE

## The Problem

After deploying to Render, the admin login shows "An error occurred during login." This happens because:

1. **No admin user exists in your production MongoDB** - The database is empty
2. **Environment variables aren't set** - ADMIN_USERNAME/ADMIN_PASSWORD not configured
3. **MongoDB connection issue** - The database URI might be incorrect

## Solution

### Step 1: Set Environment Variables on Render

Go to your Render project Dashboard:

1. Navigate to **Settings** → **Environment** (or **Environment** tab)
2. Add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/eventsphere?retryWrites=true&w=majority
DB_NAME=eventsphere
REDIS_HOST=your-redis-host.render.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
JWT_SECRET=your-super-secret-key-here-change-this
BASE_URL=https://your-app-url.onrender.com
```

**Important Tips:**
- Get your MongoDB connection string from MongoDB Atlas
- Get your Redis connection details from Render's Redis instance
- Use a STRONG password for `ADMIN_PASSWORD` in production
- Change `JWT_SECRET` to something random and long
- Set `BASE_URL` to your actual Render app URL

### Step 2: Redeploy Your Application

1. Go to your Render project
2. Click **Manual Deploy** or push new changes to trigger auto-deploy
3. Wait for deployment to complete

### Step 3: Verify Admin User Creation

When the server starts with these environment variables set:

1. The server logs will show:
   ```
   ✅ Default admin user created successfully
      Username: admin
      Password: Set from environment...
   ```

2. If the admin user already exists, it shows:
   ```
   ✅ Admin user(s) already exist in database
   ```

### Step 4: Test Login

1. Go to your app's admin login page: `https://your-app.onrender.com/admin/login`
2. Enter the credentials you set:
   - **Username:** Value of `ADMIN_USERNAME` (default: `admin`)
   - **Password:** Value of `ADMIN_PASSWORD` (default: `admin123`)
3. You should now be logged in!

## Debugging: Check Server Logs

If it still doesn't work:

1. Go to **Logs** in your Render dashboard
2. Look for these messages:
   - `✅ Connected to MongoDB` - Database connection working
   - `✅ Default admin user created successfully` - Admin was created
   - `❌ Failed to connect to MongoDB` - Check your MONGODB_URI
   - `⚠️ Failed to initialize admin user` - Check environment variables

## Alternative: Manual Admin Creation

If you need to create an admin user manually:

1. Connect to your MongoDB Atlas cluster
2. Go to **Collections** → **eventsphere** → **admins**
3. Insert a new document:
   ```json
   {
     "username": "admin",
     "password": "admin123",
     "createdAt": new Date(),
     "createdBy": "manual"
   }
   ```

## Security Checklist

- ✅ Change `ADMIN_PASSWORD` to something strong
- ✅ Change `JWT_SECRET` to a random string
- ✅ Don't use defaults in production
- ✅ Rotate credentials regularly
- ✅ Use environment variables, not hardcoded values

## Still Having Issues?

Check these things:

1. **MongoDB Connection:**
   ```bash
   # Test your connection string
   # It should include: mongodb+srv://username:password@...
   ```

2. **Redis Connection:**
   - Make sure Redis is provisioned on Render
   - Verify the connection string in environment variables

3. **Environment Variables:**
   - Double-check spelling (case-sensitive on Linux)
   - No extra spaces in values
   - All required variables are set

4. **Logs:**
   - Check Render logs for detailed error messages
   - Look for "MongoDB", "Redis", "admin" keywords

## Files Modified

- `server.js` - Added automatic admin user initialization
- `.env.example` - Template for environment variables

---

**Questions?** Check the server logs for specific error messages.
