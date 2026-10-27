# Deploying the 1Putt website

This archive contains the static website source. No build command is required.

## Upload

Extract the ZIP and upload its contents to your web host's public website folder.
Keep index.html at the root and preserve the css/, js/, and assets/ folders.
The shipping.html, privacy.html, and contact.html pages sit beside index.html.

## Before launch

- Connect and test checkout. The current checkout is a demo, not a payment service.
- Connect email signup. The current form does not save subscriber addresses.
- Finalize the draft support pages and actual support email.
- og:url and og:image in index.html point at https://1putt.netlify.app/ — update them if a custom domain is added.
- Review operational promises, product claims and testimonial permissions.
- Replace temporary AI product photos with real photographs when available.

## External dependencies

Product images, logo, CSS and JavaScript are included locally.
Fonts load from Google Fonts and therefore require an internet connection.
Links to external golf rules pages remain external.

## Local testing

You can open index.html directly for a quick visual check. For launch testing,
use a local static server or your host's preview and test navigation, images,
cart controls and both desktop and mobile layouts.

The ZIP does not include a connected store backend, payment account, email
provider, customer records or analytics account.
