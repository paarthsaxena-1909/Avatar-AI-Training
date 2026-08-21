from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for name, width, height in [('desktop', 1440, 1000), ('mobile', 390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height})
        page.goto('http://127.0.0.1:4173/index.html')
        page.wait_for_load_state('domcontentloaded')
        page.wait_for_timeout(1500)
        page.screenshot(path=f'/tmp/ai-labs-{name}.png', full_page=True)
        assert page.locator('img[alt="AI Labs"]').count() == 1
        assert page.get_by_text('An AI agent that calls your sales representatives', exact=False).count() == 1
        assert page.get_by_text('Request a Sample Report', exact=True).count() == 0
        assert page.locator('#sales-video').count() == 1
        assert page.locator('a[href="mailto:ailabs@timesinternet.in?subject=Talk%20to%20Us"]').count() == 1
        page.locator('#hero-video-toggle').click()
        page.wait_for_timeout(100)
        assert page.locator('#hero-video-toggle').inner_text() == 'Play'
        page.locator('#hero-video-toggle').click()
        page.wait_for_timeout(100)
        assert page.locator('#hero-video-toggle').inner_text() == 'Pause'
        print(name, page.title(), page.locator('h1').inner_text()[:40])
        page.close()
    browser.close()
