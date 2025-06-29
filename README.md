# Tatva - Personal Blog

A simple and elegant personal blog built with Vite, Markdown, and vanilla JavaScript.

## Features

- 📝 **Markdown Support**: Write posts in markdown format
- 🌙 **Dark/Light Mode**: Toggle between themes
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Fast Loading**: Built with Vite for optimal performance
- 🚀 **Static Site**: Deployed to GitHub Pages
- 🎨 **Clean Design**: Minimalist and elegant UI

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vibe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Adding Content

### About Information

Edit the file `src/info/about.md` to update your personal information and bio.

### Blog Posts

Add new blog posts as markdown files in the `src/posts/` directory. Each post can include frontmatter:

```markdown
---
title: Your Post Title
date: 2024-01-20
---

# Your Post Content

Write your content here...
```

## Deployment

The site is automatically deployed to GitHub Pages when you push to the main branch. The GitHub Action will:

1. Build the static site
2. Deploy it to the `gh-pages` branch
3. Make it available at `https://yourusername.github.io/repositoryname`

## Project Structure

```
vibe/
├── src/
│   ├── posts/           # Blog posts (markdown files)
│   ├── info/            # About information (markdown files)
│   ├── index.html       # Main HTML template
│   ├── styles.css       # Styles with theme support
│   └── main.js          # JavaScript functionality
├── dist/                # Built files (generated)
├── .github/workflows/   # GitHub Actions
├── package.json
├── vite.config.js
└── README.md
```

## Customization

- **Colors**: Modify CSS custom properties in `styles.css`
- **Fonts**: Update font families in the CSS
- **Layout**: Modify the HTML structure in `index.html`
- **Functionality**: Extend features in `main.js`

## License

MIT License - feel free to use this for your own blog!