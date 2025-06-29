# Tatva - Personal Blog

A simple and elegant personal blog with **automatic markdown to HTML conversion** via GitHub Actions.

## Features

- 📝 **Markdown to HTML**: Write in Markdown, deploy as fast-loading HTML
- 🤖 **GitHub Actions**: Automatic conversion and deployment
- 🌙 **Dark/Light Mode**: Toggle between themes with a click
- 📱 **Responsive Design**: Looks great on all devices
- ⚡ **Static HTML**: No client-side rendering needed
- 🎨 **Clean Design**: Beautiful, readable blog posts
- 🔧 **Zero Configuration**: Just write and push!

## 🚀 Quick Start

1. **Clone this repository**
   ```bash
   git clone <your-repo-url>
   cd vibe
   npm install
   ```

2. **Enable GitHub Pages**
   - Go to Repository → Settings → Pages
   - Set Source to "GitHub Actions"
   - Your site will be at `https://yourusername.github.io/yourrepo`

3. **Add your first post**
   - Create a file in `posts/my-first-post.md`
   - Add some markdown content
   - Push to main branch

4. **Watch the magic!** GitHub Actions automatically converts to HTML and deploys

## 📝 Adding Content

### Blog Posts

Create markdown files in the **root** `posts/` directory:

```markdown
---
title: My Awesome Post
date: 2024-01-21
---

# Your Content Here

Write your blog post using **Markdown** syntax!
```

### About Page

Create `info/about.md` with your personal information:

```markdown
# About Me

Tell your story here...
```

**That's it!** Push to main and GitHub Actions handles the rest!

## 🚀 Automatic Deployment

When you push markdown files to `posts/` or `info/`, GitHub Actions:

1. 📥 Detects your changes
2. 🔨 Converts markdown to styled HTML pages  
3. 🏗️ Builds the complete site
4. 🌐 Deploys to GitHub Pages

**No manual builds needed!** Just write and push.

## 📁 Project Structure

```
your-repo/
├── posts/                    # 📝 Your blog posts (add .md files here!)
│   ├── my-first-post.md
│   └── tutorial.md
├── info/                     # ℹ️  About page (add about.md here!)
│   └── about.md
├── docs/                     # 🌐 Website files
│   ├── posts/               # 📄 Generated HTML (auto-created)
│   ├── index.html           # Main site
│   ├── main.js              # Functionality  
│   └── styles.css           # Styling
├── .github/workflows/        # 🤖 GitHub Actions
├── scripts/                  # 🛠️ Build tools
└── package.json
```

## 🔧 Local Development

```bash
# Generate HTML from markdown  
npm run build:static

# Start development server
npm run dev

# Build for production
npm run build
```

## 📖 Documentation

- **[GitHub Actions Setup Guide](GITHUB_ACTIONS_SETUP.md)** - Complete deployment guide
- **[Project Structure](PROJECT_STRUCTURE.md)** - Clean project overview

## 🎉 That's It!

Your blog updates automatically when you push markdown files! Perfect for writers who want to focus on content, not code. ✍️

## License

MIT License - feel free to use this for your own blog!