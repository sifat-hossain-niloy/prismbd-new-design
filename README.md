# prismbd.net

Website for **Prism Venture** (apparel sourcing, jute products and tech solutions, Dhaka). Hosted on GitHub Pages at <https://prismbd.net>.

This is a temporary site that reuses the content and photos of the previous prismbd.net, with a new design, until the original Next.js source is available.

## How it works

- `src/pages/*.html`: one file per page. The comment at the top sets the title, description and URL.
- `src/layout.html`: the shared header, navigation and footer.
- `src/static/`: CSS, JavaScript, images, `CNAME` and other files copied as they are.
- `build.py`: combines the above into `docs/`, which GitHub Pages serves.

## Editing

1. Change files in `src/`.
2. Run `python3 build.py` (no dependencies needed).
3. Preview with `python3 -m http.server 8000 --directory docs` and open http://localhost:8000.
4. Commit both `src/` and `docs/`, then push. GitHub Pages updates within a minute or two.

## Contact form

GitHub Pages has no server, so the inquiry form opens the visitor's email app with the message filled in (to saadi@prismbd.net, or Sifat@prismbd.net for tech inquiries).
