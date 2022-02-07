import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";
import consola from "consola";


export async function getScreenshot(url, width, height, delay) {

    consola.info('Incoming URL: ' + url);

    function delay(time) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), time)
        })
    }
    // Start Playwright with the dynamic chrome-aws-lambda args
    const browser = await playwright.chromium.launch({
        args: chromium.args,
        executablePath:
            process.env.NODE_ENV !== "development"
                ? await chromium.executablePath
                : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        headless: process.env.NODE_ENV !== "development" ? chromium.headless : true,
    })

    consola.info('Browser started');

    // Create a page with the recommended Open Graph image size
    const page = await browser.newPage({
        viewport: {
            width: Number(width) || 1600,
            height: Number(height) || 800
        },
    })

    consola.info(`Page created with viewport ${width || 1600}x${height || 800}`);
    consola.info('Page created and visiting: ' + url);

    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await delay(400)
    const file = await page.screenshot()
    const base = `data:image/png;base64,${file.toString('base64')}`

    consola.info('Got our screenshot!');

    await browser.close()


    return base;

}