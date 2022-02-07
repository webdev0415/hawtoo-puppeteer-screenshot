# puppeteer-screenshot

Vercel app for taking screenshots of web pages using Puppeteer.

Has a `?key=` mechanism to protect it from unauthorized access.

## Usage

Has a Vercel secret called `SECRET_KEY` with a random string in it (Generated by running `uuidgen | md5`).

You can access screenshots for pages using:

    https:/.../hawtoo.com/@cyberkongz?type=png&key=...

Screenshots can take several seconds to generate so it's a good idea to cache them somewhere.

## Querystring arguments

- `?viewportWidth=` sets the browser viewport width in pixels. This defaults to 800.
- `?viewportHeight=` sets the browser viewport height in pixels. This defaults to 600.
- `?type=` set the output type to `png` or `jpeg`. Default is `png`.
- `?quality=75` set the JPEG output qualit. Ignored for PNG.
- `?fullPage=true` fetch a screenshot of the full page, not just the browser viewport.