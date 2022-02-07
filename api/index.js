// import { VercelRequest, VercelResponse } from '@vercel/node';
import { getScreenshot } from './_lib/puppeteer';
import { timingSafeEqual } from "crypto";
import consola from "consola";

const SECRET_KEY = process.env.SECRET_KEY;

const compare = (a, b) => {
    try {
        return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
    } catch {
        return false;
    }
};

module.exports = async (req, res) => {
    // console.log(req.query.key);
    consola.info('Process env secret key:' + SECRET_KEY);
    consola.info('Incoming secret key:' + req.query.key);

    if (!compare(req.query.key, SECRET_KEY)) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>You thought so huh 👀</h1><p>Permission denied</p>');
        return;
    }

    consola.success("Secret key passed");

    const usage = "https://puppeteer-screenshot-tawny.vercel.app/api?url=https://google.com&width=1366&height=625&key=API_KEY"

    if (!req.query.url) return res.status(400).json({
        "success": false,
        "error": "No url query specified!",
        "usage": usage
    });

    try {
        consola.info("Trying to get screenshot");
        const file = await getScreenshot(req.query.url, req.query.width, req.query.height, req.query.delay);

        consola.success("Screenshot complete!");
        res.setHeader('Content-Type', `image/png`);
        res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`);
        res.status(200).end(file);
    } catch (error) {
        consola.error(error)
        res.setHeader('Content-Type', 'application/json');
        res.status(400).json({
            "success": false,
            "error": "Invalid queries!",
            "dev": error,
            "usage": usage
        });
    }
}