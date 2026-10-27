#!/usr/bin/env python3
"""Build the Prism Venture website.

Pages live in src/pages/*.html. Each starts with a metadata comment:

    <!--
    title: Apparel sourcing
    description: One sentence for search engines.
    path: /apparel/
    nav: apparel
    theme: light
    -->

The page body is placed inside src/layout.html, static files in src/static/
are copied as they are, and the finished site is written to docs/, which
GitHub Pages serves. Run:  python3 build.py
"""
import datetime
import math
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
OUT = ROOT / "docs"
SITE_URL = "https://prismbd.net"
NAV = ["apparel", "jute", "tech", "product", "contact"]


def prism_svg(css_class="prism-lines", lines=46):
    """String-art fan echoing the Prism Venture logo (yellow to sky blue)."""
    a0, a1 = (20, 300), (250, 318)   # yellow edge, bottom left
    b0, b1 = (520, 8), (488, 344)    # blue edge, right
    paths = []
    for i in range(lines):
        t = i / (lines - 1)
        x1 = a0[0] + (a1[0] - a0[0]) * t
        y1 = a0[1] + (a1[1] - a0[1]) * t
        e = 1 - math.cos(t * math.pi / 2)
        x2 = b0[0] + (b1[0] - b0[0]) * e
        y2 = b0[1] + (b1[1] - b0[1]) * e
        paths.append(f"M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}")
    return (
        f'<svg class="{css_class}" viewBox="0 0 540 360" aria-hidden="true" focusable="false">'
        '<defs><linearGradient id="pg" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="520" y2="0">'
        '<stop offset="0" stop-color="#f2dc3a"/><stop offset=".42" stop-color="#1b2433"/>'
        '<stop offset=".6" stop-color="#2b5f99"/><stop offset="1" stop-color="#6cc0ee"/>'
        '</linearGradient></defs>'
        f'<path d="{" ".join(paths)}" stroke="url(#pg)" stroke-width=".9" fill="none"/></svg>'
    )


def parse(page):
    text = page.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--(.*?)-->", text, re.S)
    meta = dict(
        line.split(":", 1) for line in m.group(1).strip().splitlines() if ":" in line
    )
    meta = {k.strip(): v.strip() for k, v in meta.items()}
    return meta, text[m.end():]


def render(layout, meta, body):
    year = str(datetime.date.today().year)
    body = body.replace("{{prism}}", prism_svg())
    html = layout
    values = {
        "title": meta["title"],
        "description": meta["description"],
        "canonical": SITE_URL + meta["path"],
        "theme": meta.get("theme", "light"),
        "content": body,
        "year": year,
    }
    for key in NAV:
        values[f"nav_{key}"] = ' aria-current="page"' if meta.get("nav") == key else ""
    for key, value in values.items():
        html = html.replace("{{" + key + "}}", value)
    return html


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(SRC / "static", OUT)
    layout = (SRC / "layout.html").read_text(encoding="utf-8")
    urls = []
    for page in sorted((SRC / "pages").glob("*.html")):
        meta, body = parse(page)
        path = meta["path"]
        if path == "/404.html":
            target = OUT / "404.html"
        else:
            target = OUT / path.strip("/") / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(render(layout, meta, body), encoding="utf-8")
        if path != "/404.html":
            urls.append(SITE_URL + path)
        print("built", target.relative_to(ROOT))
    today = datetime.date.today().isoformat()
    sitemap = "".join(f"<url><loc>{u}</loc><lastmod>{today}</lastmod></url>" for u in urls)
    (OUT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>'
        f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{sitemap}</urlset>\n',
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
