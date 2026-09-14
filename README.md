# Hope to Reach

Responsive static website concept by Hakateq Solutions Limited, based on the supplied visual reference. No build tools or runtime dependencies are required. Navy, orange and gold visual identity; African gospel imagery; accessible navigation; gallery filters and lightbox; demo event details; booking enquiry preview, copy and download; pointer-reactive stage particles and reduced-motion support.

## Preview

Run `npm start` (Python 3 required), then open `http://localhost:3000`. Alternatively serve this directory with any static HTTP server. Run `npm run check` for JavaScript syntax validation.

## Render

Commit these files to a repository and create a Render Static Site using that repository. Build command: `echo "Static website ready"`. Publish directory: `.`. A `render.yaml` Blueprint is also included. No environment variables are required. This project has not been deployed by the agent.

## Client handover

- Set verified phone, email, official video and social URLs in `content.js`. Keep phone in international format. Empty values display an informative placeholder dialog rather than sending to invented contacts.
- Replace the sample events in `content.js`; update the explicit demo labels and event dialog in `script.js` only after dates and venues are verified. The current dates have no year and are deliberately illustrative.
- Replace `assets/gospel-performance.jpg` and `assets/gospel-group.jpg` with approved client images; update the corresponding alternative text and concept-image notices in `index.html`. Current images depict fictional people generated with the built-in image generation tool, not the real ministry.
- Replace the concept brand SVG in `index.html` and favicon in `assets/favicon.svg` with the approved logo.
- Edit copy and illustrative testimonials in `index.html`. Do not remove sample labels without verified client testimonials and permission.
- The booking form validates locally and prepares a text enquiry. It does not submit to a server, save personal information, send an email or confirm availability. Once a verified phone is configured, the preview also offers an explicit WhatsApp share action. A real backend is needed for direct form delivery; update form messaging and privacy information if one is added.
- After receiving the production domain, set a canonical URL, `og:url`, an absolute HTTPS `og:image` URL and a sitemap. Relative Open Graph imagery is a placeholder until the deployment URL is known.
- Google Fonts is an optional external request with system-font fallbacks. All imagery and application assets are served locally. For a fully offline website, self-host the two font families or remove the CSS font import.

## Images

Generated with the built-in imagegen tool, then optimized to JPEG for website use. Original generated PNGs remain in the generator's output directory. Final project paths: `assets/gospel-performance.jpg` and `assets/gospel-group.jpg`.

Performance prompt: “Premium cinematic editorial photograph of a fictional Black African female gospel vocalist with natural hair and elegant black outfit, eyes closed singing into a handheld microphone, one hand raised; three Black African backing vocalists and live band in the background, dramatic warm amber spotlights and subtle haze, black stage, authentic worship energy. Wide landscape, singer at right third, darker left third. No text, logos or watermarks.”

Group prompt: “Photorealistic editorial wide landscape photograph of a fictional East African gospel music group of seven Black African men and women singing together in a lush outdoor garden, two men wearing white shirts with kente fabric accents and holding acoustic guitar, women wearing elegant black tops and orange green African wax print skirts and headbands, authentic joyful candid expressions. Warm natural late afternoon sunshine, softly blurred greenery. Professional photography, waist up group composition, no text, no logos. For a gospel ministry website concept.”
