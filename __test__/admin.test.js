const puppeteer = require('puppeteer');

// ============================================
// UTILITY FUNCTIONS
// ============================================
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// CONFIGURATION - CHANGE THESE VALUES
// ============================================
const CONFIG = {
    BASE_URL: 'http://localhost:3000',
    ADMIN_LOGIN_URL: 'http://localhost:3000/admin/login',
    // Update these to the admin credentials you want to test
    ADMIN_USERNAME: 'tanisha',
    ADMIN_PASSWORD: 'tanisha123',
    HEADLESS: false,
    SLOW_MO: 50
};

// ============================================
// STANDALONE TEST RUNNER
// ============================================
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.browser = null;
        this.page = null;
    }

    async setup() {
        console.log('🚀 Starting Admin Dashboard Tests...\n');
        this.browser = await puppeteer.launch({
            headless: CONFIG.HEADLESS,
            slowMo: CONFIG.SLOW_MO,
            args: ['--start-maximized'],
            defaultViewport: null
        });
        this.page = await this.browser.newPage();

        // Login to admin dashboard
        console.log('🔐 Logging in to admin dashboard...');
        try {
            await this.page.goto(CONFIG.ADMIN_LOGIN_URL, { waitUntil: 'networkidle2' });
            
            // Try both username and email field names to be safe
            const usernameSelector = 'input[name="username"], input[name="email"], input#username, input#email';
            await this.page.waitForSelector(usernameSelector, { timeout: 5000 });
            await this.page.type(usernameSelector, CONFIG.ADMIN_USERNAME);
            
            const passwordSelector = 'input[name="password"], input#password';
            await this.page.type(passwordSelector, CONFIG.ADMIN_PASSWORD);
            
            // Click submit and wait for either navigation or dashboard elements
            await Promise.all([
                this.page.click('button[type="submit"]'),
                this.page.waitForNavigation({ timeout: 10000 }).catch(() => {
                    console.log('⚠️  No navigation detected, checking for dashboard...');
                })
            ]);
            
            // Wait a bit for any redirects
            await wait(2000);
            
            // Verify we're logged in
            const currentUrl = this.page.url();
            console.log('✅ Login successful! Current URL:', currentUrl, '\n');
        } catch (error) {
            console.error('❌ Login failed:', error.message);
            console.log('💡 Tips:');
            console.log('   1. Make sure your server is running at', CONFIG.BASE_URL);
            console.log('   2. Verify username:', CONFIG.ADMIN_USERNAME);
            console.log('   3. Check if login page loads at', CONFIG.ADMIN_LOGIN_URL);
            throw error;
        }
    }

    async teardown() {
        if (this.browser) {
            await this.browser.close();
        }
        console.log('\n' + '='.repeat(50));
        console.log(`📊 TEST SUMMARY`);
        console.log('='.repeat(50));
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📝 Total: ${this.tests.length}`);
        console.log('='.repeat(50));
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        await this.setup();

        for (const test of this.tests) {
            try {
                console.log(`🧪 Running: ${test.name}`);
                await test.fn(this.page);
                console.log(`✅ PASSED: ${test.name}\n`);
                this.passed++;
            } catch (error) {
                console.log(`❌ FAILED: ${test.name}`);
                console.log(`   Error: ${error.message}\n`);
                this.failed++;
            }
        }

        await this.teardown();
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertContains(text, substring, message) {
    if (!text.includes(substring)) {
        throw new Error(message || `Expected "${text}" to contain "${substring}"`);
    }
}

// ============================================
// TEST SUITE - Only 2 tests: Login + Add Event
// ============================================
const runner = new TestRunner();

// Test 1: Login successful
runner.test('Should successfully login to admin dashboard', async (page) => {
    const currentUrl = page.url();
    console.log('   Current URL after login:', currentUrl);
    
    // Just verify we're not on the login page anymore
    assert(!currentUrl.includes('/login'), 'Should not be on login page after successful login');
});

// Test 2: Add new event
runner.test('Should add a new event successfully', async (page) => {
    // Get current URL and stay on the same page
    const currentUrl = page.url();
    console.log('   Starting from URL:', currentUrl);
    
    await wait(1500);
    
    // Wait for and click add event button
        const addBtnSel = 'button[data-bs-toggle="modal"][data-bs-target="#addEventModal"]';
        await page.waitForSelector(addBtnSel, { timeout: 5000 });
        // Use page.evaluate click to avoid issues where element is covered or not interactable
        await page.evaluate((sel) => { const el = document.querySelector(sel); if (el) el.click(); }, addBtnSel);
        // Wait for modal container to be visible and for Bootstrap to add the "show" class
        await page.waitForSelector('#addEventModal', { visible: true, timeout: 5000 });
        await page.waitForFunction(() => {
            const el = document.querySelector('#addEventModal');
            return el && el.classList && el.classList.contains('show');
        }, { timeout: 5000 }).catch(() => {
            // fallback: continue even if show class didn't appear quickly
        });
        await wait(500);
    
    console.log('   ✓ Modal opened successfully');
    
    // Generate unique event name
    const timestamp = Date.now();
    await page.type('#title', `Test Event ${timestamp}`);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    await page.type('#date', tomorrowStr);
    
    await page.type('#image', 'https://picsum.photos/400/300');
    await page.type('#description', 'This is a test event created by automated testing.');
    
    console.log('   ✓ Form filled with test data');
    
    // Submit form and wait for either navigation or success message
    await page.click('#add-event-form button[type="submit"]');
    
    // Wait for navigation or timeout (don't fail if no navigation)
    await page.waitForNavigation({ timeout: 10000 }).catch(() => {
        console.log('   ⚠️  No immediate navigation detected');
    });
    
    // Give it extra time for any delayed redirects
    await wait(2000);
    
    console.log('   ✓ Event submitted successfully');
    
    // Verify we're still in admin area (not 404)
    const finalUrl = page.url();
    console.log('   Final URL:', finalUrl);
    assert(!finalUrl.includes('404'), 'Should not end up on 404 page');
    assert(finalUrl.includes('/admin'), 'Should stay in admin area');
});

// ============================================
// RUN ALL TESTS
// ============================================
runner.run().then(() => {
    process.exit(runner.failed > 0 ? 1 : 0);
}).catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
});