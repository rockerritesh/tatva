# Tatva

A minimal blog built with Node.js and markdown.

## How it works

1. Add markdown files to the `posts/` directory
2. Use frontmatter for title and date:
   ```markdown
   ---
   title: Your Post Title
   date: 2024-01-01
   ---
   
   Your content here...
   ```
3. Run `npm run build` to generate HTML files
4. GitHub Actions automatically builds and deploys when you push new posts

## Structure

- `posts/` - Your markdown blog posts
- `docs/` - Generated HTML files (served by GitHub Pages)
- `build.js` - Simple build script that converts markdown to HTML

## Live Site

Your blog is available at: `https://yourusername.github.io/vibe/`

Built with ❤️ 