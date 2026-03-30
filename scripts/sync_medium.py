#!/usr/bin/env python3
"""
Fetches the Medium RSS feed and updates data/writings.json.
Excerpt is extracted from the first <h4> tag in the article content.
"""

import json
import re
import xml.etree.ElementTree as ET
from datetime import datetime
from html.parser import HTMLParser
import urllib.request

FEED_URL = "https://medium.com/feed/@ganeshkumarm1"
OUTPUT_PATH = "data/writings/medium_writings.json"
MAX_ARTICLES = 10


class H4Parser(HTMLParser):
    """Extracts text content of the first <h4> tag."""
    def __init__(self):
        super().__init__()
        self.in_h4 = False
        self.depth = 0
        self.result = None

    def handle_starttag(self, tag, attrs):
        if tag == "h4" and self.result is None:
            self.in_h4 = True
            self.depth = 1

    def handle_endtag(self, tag):
        if self.in_h4 and tag == "h4":
            self.in_h4 = False

    def handle_data(self, data):
        if self.in_h4 and self.result is None:
            text = data.strip()
            if text:
                self.result = text


def extract_h4(html: str) -> str:
    parser = H4Parser()
    parser.feed(html)
    return parser.result or ""


def fetch_feed(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode("utf-8")


def parse_feed(xml_text: str) -> list:
    # Register namespaces to avoid stripping them
    ET.register_namespace("content", "http://purl.org/rss/1.0/modules/content/")
    root = ET.fromstring(xml_text)
    channel = root.find("channel")
    articles = []

    for item in channel.findall("item")[:MAX_ARTICLES]:
        title = item.findtext("title", "").strip()
        # <link> in RSS is tricky — it's a text node after the tag
        link_el = item.find("link")
        link = ""
        if link_el is not None:
            # Try tail first (Medium puts URL as tail text)
            link = (link_el.tail or "").strip() or (link_el.text or "").strip()

        pub_date_str = item.findtext("pubDate", "")
        try:
            pub_date = datetime.strptime(pub_date_str, "%a, %d %b %Y %H:%M:%S %Z")
        except ValueError:
            pub_date = datetime.now()

        date_iso = pub_date.strftime("%Y-%m-%d")
        display_date = pub_date.strftime("%b %Y").upper()

        # Get content:encoded for full HTML
        content_el = item.find("{http://purl.org/rss/1.0/modules/content/}encoded")
        html_content = content_el.text if content_el is not None else ""

        excerpt = extract_h4(html_content)

        articles.append({
            "title": title,
            "url": link,
            "date": date_iso,
            "displayDate": display_date,
            "excerpt": excerpt
        })

    return articles


def main():
    print(f"Fetching {FEED_URL}...")
    xml_text = fetch_feed(FEED_URL)

    print("Parsing feed...")
    articles = parse_feed(xml_text)

    print(f"Found {len(articles)} articles")
    for a in articles:
        print(f"  - {a['date']} | {a['title'][:60]}")
        print(f"    excerpt: {a['excerpt'][:80]}")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

    print(f"Written to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
