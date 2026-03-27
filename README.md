# Minimal Portfolio Template

A clean, minimal personal portfolio template built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — just fast, accessible, and easy to customize.

## Preview

[Live Demo](https://ganeshkumarm1.github.io/)

## Features

- Light / dark mode with system preference detection and localStorage persistence
- Page loader animation with a red dot reveal
- Hero section with name reveal animation and accent underline
- Bento grid experience layout
- Dynamic projects and writing sections loaded from JSON
- Skeleton loading states
- Active nav highlighting via IntersectionObserver
- Mobile-responsive with slide-out nav
- Chai4Me support button
- SEO optimized with Open Graph, Twitter cards, and JSON-LD structured data
- Accessible — skip link, ARIA labels, reduced motion support

## Structure

```
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── data/
│   ├── projects.json
│   └── writings.json
└── images/
```

## Customization

1. Update personal info in `index.html` (name, links, bio)
2. Edit `data/projects.json` to add your projects
3. Edit `data/writings.json` to add your articles
4. Replace images in `images/` with your own avatars and logos
5. Swap accent color in `css/styles.css` — change `--color-accent`

## License

MIT
