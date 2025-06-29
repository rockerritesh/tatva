# 🚀 GitHub Actions Static Site Setup

Your blog is now configured to **automatically convert markdown to HTML** and deploy via GitHub Actions! Here's how it works and how to use it.

## ✨ What This Setup Does

- **🔄 Automatic MD → HTML Conversion**: GitHub Actions converts your markdown files to beautiful HTML pages
- **📁 Organized Structure**: Keep your markdown files in root-level `posts/` and `info/` directories 
- **🌐 GitHub Pages Deployment**: Automatically deploys your site to GitHub Pages when you push changes
- **⚡ Static HTML**: Fast-loading pages with no client-side markdown rendering needed
- **🎨 Styled Pages**: Each blog post gets a beautiful, responsive HTML page

## 📂 File Structure

```
your-repo/
├── posts/                    # 📝 Your blog posts (markdown files)
│   ├── my-first-post.md
│   ├── tutorial.md
│   └── thoughts.md
├── info/                     # ℹ️  About page and other info (markdown files) 
│   └── about.md
├── docs/                     # 🌐 Website files (CSS, JS, base HTML)
│   ├── posts/               # 📄 Generated HTML posts (auto-created)
│   ├── info/                # 📄 Generated HTML info pages (auto-created)
│   ├── index.html
│   ├── main.js
│   └── styles.css
├── .github/workflows/        # 🔧 GitHub Actions
│   └── build-site.yml
└── scripts/                  # 🛠️ Build tools
    └── build-static-html.js
```

## 🎯 How to Use

### 1. **Enable GitHub Pages**
1. Go to your repository → Settings → Pages
2. Set Source to "GitHub Actions"
3. Your site will be available at `https://yourusername.github.io/yourrepo`

### 2. **Add Blog Posts**
1. Create `.md` files in the root `posts/` directory
2. Add frontmatter for better control:
   ```markdown
   ---
   title: My Awesome Blog Post
   date: 2024-01-21
   ---

   # Your Content Here

   This is your blog post content...
   ```
3. Push to main branch
4. GitHub Actions automatically converts to HTML and deploys!

### 3. **Add About Page**
1. Create `info/about.md` with your information
2. Push to main branch
3. It appears on your site's About section

## 🔧 GitHub Actions Workflow

The workflow (`.github/workflows/build-site.yml`) triggers when:
- You push changes to the `main` branch
- Changes are made to `posts/**/*.md` or `info/**/*.md` files
- Changes are made to the `docs/` directory

**What it does:**
1. 📥 Checks out your repository
2. 📦 Installs Node.js and dependencies
3. 📁 Copies markdown files from `posts/` and `info/` to `docs/`
4. 🔨 Converts markdown to styled HTML pages
5. 🏗️ Builds the site with Vite
6. 🚀 Deploys to GitHub Pages

## 📝 Markdown File Format

Your markdown files can include frontmatter for metadata:

```markdown
---
title: Custom Title for Your Post
date: 2024-01-21
---

# Your Post Content

Write your blog post content here using **markdown** syntax!

## Features Supported

- Headers
- **Bold** and *italic* text
- [Links](https://example.com)
- Code blocks
- Lists
- And more!
```

## 🎨 Generated HTML Features

Each blog post gets converted to a styled HTML page with:
- **📱 Responsive design** that matches your site theme
- **🌙 Dark/light mode** toggle
- **🔙 Back to blog** navigation
- **📄 Clean typography** optimized for reading
- **🎯 SEO-friendly** HTML structure

## 🚀 Deployment Process

1. **Write** your markdown files in `posts/` or `info/`
2. **Commit and push** to the main branch
3. **GitHub Actions** automatically:
   - Converts MD → HTML
   - Generates a posts index
   - Builds and deploys your site
4. **Visit** your GitHub Pages URL to see the updates!

## 💡 Pro Tips

- **Frontmatter** is optional but recommended for better control
- **File names** become URLs (e.g., `my-post.md` → `/posts/my-post.html`)
- **Images** can be stored in `docs/images/` and referenced in markdown
- **Posts are sorted** by date automatically (newest first)
- **Development** can still be done locally with `npm run dev`

## 🔍 Local Development

To test locally before pushing:

```bash
# Install dependencies
npm install

# Generate static HTML files
npm run build:static

# Start development server
npm run dev
```

## 🎉 That's It!

Your blog now has a powerful CI/CD pipeline! Just add markdown files to the `posts/` directory, push to GitHub, and watch your static site update automatically! 🚀

### Example Workflow:
1. ✍️ Write `posts/my-new-post.md`
2. 📤 `git add . && git commit -m "Add new post" && git push`
3. ⏳ Wait ~2 minutes for GitHub Actions
4. 🌐 Visit your site to see the new post live!

Perfect for bloggers who want to focus on writing, not website management! 📝✨ 