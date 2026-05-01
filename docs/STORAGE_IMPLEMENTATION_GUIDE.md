# 🗄️ localStorage & sessionStorage Implementation Guide

## ✅ What's Been Implemented

Your Event Sphere application now has a **complete storage management system** that works with:
- ✅ **localStorage** (persistent across browser sessions)
- ✅ **sessionStorage** (tab-specific, cleared when tab closes)
- ✅ **Redis Sessions** (server-side, synced across devices)

---

## 🚀 How to Test & Verify

### **Option 1: Visual Test Page (Easiest)**

1. **Start your server:**
   ```powershell
   node server.js
   ```

2. **Open test page in browser:**
   ```
   http://localhost:3000/test-storage
   ```

3. **Click buttons to test:**
   - Save/Get from localStorage
   - Save/Get from sessionStorage
   - Save/Get from Redis
   - Run full demo
   - View storage stats

4. **Open DevTools (F12):**
   - Go to **Application** tab
   - Expand **Storage** → **Local Storage** → `http://localhost:3000`
   - Expand **Storage** → **Session Storage** → `http://localhost:3000`
   - See all keys starting with `eventsphere_`

---

### **Option 2: Browser Console Commands**

Press **F12** → Go to **Console** tab → Try these commands:

```javascript
// Run full demo
storage.demo()

// View storage statistics
storage.getStats()

// localStorage operations
storage.setLocal('my_key', { data: 'Hello World!' })
storage.getLocal('my_key')

// sessionStorage operations
storage.setSession('temp_data', ['item1', 'item2'])
storage.getSession('temp_data')

// Redis session operations (server-side)
await storage.saveToServer('server_data', { message: 'Hello Redis!' })
await storage.getFromServer('server_data')
await storage.getAllServerSession()

// Track event visit
storage.trackEventVisit('event123', 'Music Festival 2025')

// Get recently visited events
storage.getRecentlyVisited()

// Save form data (for recovery)
storage.saveFormData('contact_form', { name: 'John', email: 'john@example.com' })
storage.getFormData('contact_form')

// Get all storage stats
storage.getStats()

// Clear all storage
storage.clearAll()
storage.clearSessionAll()
```

---

## 📊 How to Verify in Browser Console

### **Step 1: Open DevTools**
Press **F12** (or Right-click → Inspect)

### **Step 2: Check Application Tab**
1. Click **Application** tab at the top
2. In the left sidebar, find **Storage**
3. Expand **Local Storage** → Click `http://localhost:3000`
4. Expand **Session Storage** → Click `http://localhost:3000`

### **Step 3: What You Should See**

You'll see keys like:
```
eventsphere_user_data
eventsphere_page_views
eventsphere_preferences
eventsphere_visited_events
eventsphere_form_contact_form
eventsphere_session_page_views
eventsphere_demo_user
eventsphere_demo_cart
```

### **Step 4: Inspect Data**
- Click any key to see its value
- Values are stored as JSON objects with timestamp

### **Step 5: Check Console**
- Go to **Console** tab
- You'll see logs like:
  ```
  ✅ localStorage SET: user_data {...}
  📖 localStorage GET: user_data {...}
  ✅ sessionStorage SET: cart {...}
  ✅ Redis session SET: server_data {...}
  📊 Page views tracked
  ```

---

## 🎯 Features Included

### **1. localStorage (Persistent)**
```javascript
// Data persists even after browser is closed
storage.setLocal('user', { name: 'John' })
storage.getLocal('user')

// With auto-expiry
storage.setLocalWithExpiry('token', 'abc123', 60) // expires in 60 minutes
```

### **2. sessionStorage (Tab-specific)**
```javascript
// Data cleared when tab is closed
storage.setSession('cart', ['item1', 'item2'])
storage.getSession('cart')
```

### **3. Redis Sessions (Server-side)**
```javascript
// Synced with Redis server, works across devices
await storage.saveToServer('preferences', { theme: 'dark' })
await storage.getFromServer('preferences')
await storage.getAllServerSession()
```

### **4. Automatic Features**
- ✅ **Page view tracking** (both localStorage and sessionStorage)
- ✅ **Event visit tracking** (last 10 visited events)
- ✅ **Form data recovery** (auto-save forms)
- ✅ **User preferences** (theme, language, etc.)
- ✅ **Recently visited events**

---

## 🧪 Testing Scenarios

### **Test 1: localStorage Persistence**
1. Save data: `storage.setLocal('test', 'Hello')`
2. Close browser completely
3. Open browser again
4. Get data: `storage.getLocal('test')`
5. ✅ Data should still be there!

### **Test 2: sessionStorage Tab-specific**
1. Open Page A: `storage.setSession('test', 'Tab A')`
2. Open new tab (Page B): `storage.getSession('test')`
3. ✅ Returns `null` (different tab)
4. Close Page A
5. ✅ Data is gone

### **Test 3: Redis Sync**
1. Save: `await storage.saveToServer('sync_test', 'Hello')`
2. Check server console: Should see "✅ API: Saved to Redis session"
3. Get: `await storage.getFromServer('sync_test')`
4. ✅ Data retrieved from Redis

### **Test 4: Expiry**
1. `storage.setLocalWithExpiry('temp', 'data', 1)` (1 minute)
2. Immediately: `storage.getLocal('temp')` → Returns 'data'
3. Wait 61 seconds
4. `storage.getLocal('temp')` → Returns `null` (expired)

---

## 📝 Server API Endpoints

Your server now has these API endpoints:

```javascript
POST   /api/session/set           // Save to Redis session
GET    /api/session/get/:key      // Get from Redis session
GET    /api/session/all           // Get all session data
POST   /api/session/clear         // Clear session
```

### **Example API Usage:**
```javascript
// Save to Redis
fetch('/api/session/set', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'user_pref', value: { theme: 'dark' } })
})

// Get from Redis
fetch('/api/session/get/user_pref')
  .then(res => res.json())
  .then(data => console.log(data))
```

---

## 🎨 What Happens Automatically

When you visit any page on your site:

1. **Storage Manager initializes** ✅
2. **Loads user preferences** (if any) ✅
3. **Tracks page view** in both localStorage and sessionStorage ✅
4. **Syncs with Redis** for server-side session ✅
5. **Logs everything to console** for debugging ✅

---

## 🔧 Files Created/Modified

### **New Files:**
- `public/js/storage.js` - Storage management system
- `views/storage-test.ejs` - Visual test page
- `HOW_TO_VERIFY_REDIS.md` - Redis verification guide
- `REDIS_INSIGHT_GUIDE.md` - RedisInsight guide
- `populate-cache.js` - Cache population script
- `test-redis.js` - Redis connection test
- `redis-cli-commands.js` - Redis CLI helper

### **Modified Files:**
- `server.js` - Added API endpoints for session management
- `views/layout.ejs` - Included storage.js script
- `public/js/main.js` - Updated to use new storage system

---

## 🎯 Quick Verification Checklist

✅ Server starts without errors  
✅ Visit: http://localhost:3000/test-storage  
✅ Click "Run Full Demo" button  
✅ Open DevTools (F12) → Application → Storage  
✅ See `eventsphere_` keys in localStorage  
✅ See `eventsphere_` keys in sessionStorage  
✅ Console shows storage logs  
✅ Try: `storage.demo()` in console  
✅ Try: `storage.getStats()` in console  

---

## 💡 Pro Tips

1. **Use F12 → Application → Storage** to see all data visually
2. **Use Console tab** for real-time logs and commands
3. **Test in different tabs** to see sessionStorage behavior
4. **Test in Incognito** to see clean slate behavior
5. **Use `storage.demo()`** for a quick comprehensive test

---

## 🚨 Common Issues

### **Issue: Can't see storage in DevTools**
- ✅ Make sure you're on the **Application** tab (not Console)
- ✅ Check you're looking at correct domain: `http://localhost:3000`
- ✅ Refresh DevTools with **Ctrl+R**

### **Issue: Storage not persisting**
- ✅ Check if browser is in Private/Incognito mode
- ✅ Check if cookies are blocked
- ✅ Try `storage.demo()` to test

### **Issue: Redis not saving**
- ✅ Check server console for errors
- ✅ Make sure Redis is connected (see startup logs)
- ✅ Try `await storage.saveToServer('test', 'data')`

---

## 🎉 Success!

Your Event Sphere application now has:
- ✅ Full localStorage implementation
- ✅ Full sessionStorage implementation
- ✅ Redis session sync
- ✅ Automatic tracking
- ✅ Visual test page
- ✅ Console-friendly API

**Everything is working in real-time and can be verified in the browser console!** 🚀
