# 🌐 How to Verify Redis Using RedisInsight Web

## Method 1: Redis Cloud Console (Easiest - Already in Browser)

### Steps:

1. **Go to Redis Cloud Console:**
   ```
   https://app.redislabs.com/
   ```

2. **Login** with your Redis Cloud credentials

3. **Find Your Database:**
   - Look for database: `redis-17731.c232.us-east-1-2.ec2.cloud.redislabs.com:17731`
   - Click on it

4. **Click "Browser" or "Redis CLI":**
   - You'll see all your keys stored in Redis

5. **Check Your EventSphere Data:**
   - Look for keys starting with `sess:` (your sessions)
   - Look for keys starting with `events:` (your cached events)
   
### What You Should See:
```
sess:xyz123abc456     → Your user sessions
events:featured       → Cached featured events
events:all           → Cached all events
```

---

## Method 2: RedisInsight Desktop App

### Download & Install:

1. **Download RedisInsight:**
   ```
   https://redis.com/redis-enterprise/redis-insight/
   ```

2. **Install and Open RedisInsight**

3. **Add Your Database:**
   - Click "Add Redis Database"
   - Choose "Add database manually"

4. **Enter Your Credentials:**
   ```
   Host: redis-17731.c232.us-east-1-2.ec2.cloud.redislabs.com
   Port: 17731
   Password: Mz07h2ZI2aUpHEevzvHB77FGppADY1UA
   Database Alias: EventSphere Redis
   ```

5. **Click "Test Connection"** then **"Add Database"**

### Using RedisInsight:

1. **Browser Tab:**
   - See all keys visually
   - Click any key to see its value
   - Filter keys by pattern (e.g., `sess:*`, `events:*`)

2. **CLI Tab:**
   - Run Redis commands directly
   - Try these commands:
     ```redis
     KEYS *                    # List all keys
     KEYS sess:*              # List all session keys
     KEYS events:*            # List all event cache keys
     GET events:featured      # Get cached featured events
     TTL events:featured      # Check time-to-live (seconds remaining)
     ```

3. **Workbench Tab:**
   - Run multiple commands
   - Analyze data
   - Create queries

---

## Method 3: Redis CLI Commands (Via RedisInsight or Cloud Console)

### Useful Commands to Verify Your Data:

```redis
# Check connection
PING
# Response: PONG

# Count all keys
DBSIZE

# List all keys
KEYS *

# List only session keys
KEYS sess:*

# List only event cache keys  
KEYS events:*

# Get a specific cached event
GET events:featured

# Check if key exists
EXISTS events:featured

# Check expiration time (TTL in seconds)
TTL events:featured
# 300 = 5 minutes remaining
# -1 = no expiration
# -2 = key doesn't exist

# Get key type
TYPE events:featured

# Delete a specific key (to test cache refresh)
DEL events:featured

# Flush all keys (CAREFUL! Deletes everything)
FLUSHDB
```

---

## 🎯 What to Look For in RedisInsight:

### ✅ Session Keys (Format: `sess:XXXXXX`)
```
sess:DKvJYv8QNKTje_j3Vc9LOXZNVF3-GN6y
```
- These store user session data
- Click to see session details (views, user info, etc.)

### ✅ Cache Keys (Format: `events:*`)
```
events:featured    → Contains cached featured events JSON
events:all        → Contains all events JSON
```
- Click to see the JSON data
- Check TTL to see expiration time

### ✅ Stats to Check:
- **Total Keys:** Should increase as users visit
- **Memory Usage:** Should be low (KB to MB)
- **Connected Clients:** Should show 1+ when server is running
- **Commands/sec:** Should spike when pages load

---

## 📸 Visual Verification Checklist:

In RedisInsight, you should see:

✅ **Keys Tab:**
- Multiple `sess:` keys (one per user session)
- `events:featured` key (if homepage was visited)
- `events:all` key (if /events page was visited)

✅ **Key Details:**
- Click `events:featured` → See JSON array of events
- Click a `sess:` key → See session data with views count

✅ **TTL (Time To Live):**
- Event cache keys: ~300 seconds (5 minutes)
- Session keys: 86400 seconds (24 hours)

✅ **Memory:**
- Each session: ~100-500 bytes
- Each event cache: ~1-10 KB

---

## 🧪 Quick Test:

1. **Open RedisInsight** → Connect to your database
2. **Clear cache:** Run `DEL events:featured`
3. **Visit homepage:** `http://localhost:3000/`
4. **Refresh RedisInsight:** You should see `events:featured` reappear!
5. **Check PowerShell:** You should see `Cache MISS` then `Cached data for key: events:featured`

---

## 🔗 Quick Links:

- **Redis Cloud Console:** https://app.redislabs.com/
- **RedisInsight Download:** https://redis.com/redis-enterprise/redis-insight/
- **Redis Commands Docs:** https://redis.io/commands/

---

## 💡 Pro Tips:

1. **Use Pattern Search:** In RedisInsight browser, type `sess:*` to filter only sessions
2. **Monitor in Real-Time:** Keep RedisInsight open while using your app
3. **Check Memory Usage:** Ensure you're not storing too much data
4. **Verify TTL:** Make sure cache expires as expected (300 seconds)

Your Redis is working when you see keys being created and cache hits in your PowerShell console! 🎉
