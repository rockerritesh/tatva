# Tatva

A Jekyll-inspired static site generator built with Node.js.

## Features

✨ **Jekyll-like Structure**
- `_posts/` directory for blog posts
- `_layouts/` directory for page templates  
- `_includes/` directory for reusable components
- `_sass/` directory for Sass/SCSS styles
- `_config.yml` for site configuration

🎨 **Modern Styling**
- Clean, responsive design
- SCSS compilation
- Mobile-first approach

🚀 **Auto-Deployment**
- GitHub Actions workflow
- Automatic builds on content changes
- Deploys to GitHub Pages

## Quick Start

### 1. Add Blog Posts
Create markdown files in `_posts/` using Jekyll naming convention:
```
_posts/2024-01-21-my-first-post.md
```

With frontmatter:
```markdown
---
title: "My First Post"
date: 2024-01-21
---

Your content here...
```

### 2. Customize Layouts
Edit files in `_layouts/`:
- `default.html` - Base layout
- `home.html` - Homepage layout
- `post.html` - Blog post layout

### 3. Add Includes
Create reusable components in `_includes/`:
- `header.html`
- `footer.html`

### 4. Configure Site
Edit `_config.yml`:
```yaml
title: Your Blog Name
description: Your blog description
author:
  name: Your Name
  email: your.email@example.com
```

### 5. Build
```bash
npm run build
```

## File Structure

```
tatva/
├── _posts/           # Blog posts (YYYY-MM-DD-title.md)
├── _layouts/         # Page templates
├── _includes/        # Reusable components
├── _sass/           # Sass/SCSS files
├── _config.yml      # Site configuration
├── index.md         # Homepage content
├── about.md         # About page
├── docs/           # Generated site (auto-built)
└── build.js        # Build script
```

## Jekyll Features Supported

- ✅ Frontmatter parsing
- ✅ Liquid-like templating
- ✅ Layouts and includes
- ✅ SCSS compilation
- ✅ Post permalinks
- ✅ Date formatting
- ✅ Automatic post listing
- ✅ GitHub Pages deployment

## Development

```bash
# Build the site
npm run build

# Build and serve locally
npm run dev
```

## Deployment

Push to main branch - GitHub Actions will automatically build and deploy your site!

## Live Site

Your blog will be available at: `https://yourusername.github.io/vibe/`

---

**Built with ❤️ using Node.js, Sass, and Jekyll-inspired architecture** 