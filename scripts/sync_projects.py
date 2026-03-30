#!/usr/bin/env python3
"""
Fetches pinned repositories from GitHub GraphQL API and updates data/projects.json.
Requires GITHUB_TOKEN environment variable (provided automatically in GitHub Actions).
"""

import json
import os
import urllib.request

GITHUB_USERNAME = "ganeshkumarm1"
OUTPUT_PATH = "data/projects.json"
GRAPHQL_URL = "https://api.github.com/graphql"

# Add repo names here to exclude them from the portfolio
EXCLUDE_REPOS = [
    "PersonalPortfolio",
    "system-design-masterclass"
]

QUERY = """
{
  user(login: "%s") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          homepageUrl
          url
          primaryLanguage {
            name
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
}
""" % GITHUB_USERNAME


def fetch_pinned_repos(token: str) -> list:
    payload = json.dumps({"query": QUERY}).encode("utf-8")
    req = urllib.request.Request(
        GRAPHQL_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "sync-projects-script"
        }
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    return data["data"]["user"]["pinnedItems"]["nodes"]


def format_project(repo: dict, order: int) -> dict:
    topics = [
        node["topic"]["name"]
        for node in repo.get("repositoryTopics", {}).get("nodes", [])
    ]
    tech = ", ".join(t.title() for t in topics)

    primary_lang = ""
    if repo.get("primaryLanguage"):
        primary_lang = repo["primaryLanguage"]["name"]

    links = {"github": repo["url"]}
    if repo.get("homepageUrl"):
        links["live"] = repo["homepageUrl"]

    raw_name = repo["name"]
    if "-" in raw_name:
        formatted_name = " ".join(p[0].upper() + p[1:] for p in raw_name.split("-") if p)
    else:
        formatted_name = raw_name

    return {
        "name": formatted_name,
        "description": repo.get("description") or "",
        "tech": tech,
        "language": primary_lang,
        "links": links,
        "featured": True,
        "order": order
    }


def main():
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise EnvironmentError("GITHUB_TOKEN environment variable is not set")

    print(f"Fetching pinned repos for {GITHUB_USERNAME}...")
    repos = fetch_pinned_repos(token)
    repos = [r for r in repos if r.get("name") not in EXCLUDE_REPOS]
    print(f"Found {len(repos)} pinned repos (after exclusions)")

    projects = [format_project(repo, i + 1) for i, repo in enumerate(repos)]

    for p in projects:
        print(f"  - {p['name']} | tech: {p['tech']} | live: {p['links'].get('live', 'none')}")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)

    print(f"Written to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
