---
title: "The Tatva Journey: Building a Custom Jekyll-like Static Site Generator"
date: 2025-07-04
author: Sumit Yadav
---

# The Tatva Journey: Building a Custom Jekyll-like Static Site Generator

*A technical memoir of creating a personal blog from scratch*

## The Beginning - June 2025

Five days ago, with a simple commit message "initial", I embarked on what would become an intense journey of building Tatva - not just another blog, but a completely custom static site generator that mimics Jekyll's elegance while being built entirely in JavaScript.

## Phase 1: The GitHub Actions Odyssey (Day 1-2)

The early commits tell a story of persistence and learning:
- `Fix GitHub Actions deployment permissions and workflow`
- `Transform to GitHub Actions auto-deployment workflow`
- `Fix multiple GitHub Pages artifacts issue`
- `Add simpler GitHub Pages deployment workflow`

Like many developers, I started by wrestling with CI/CD. The GitHub Actions configuration went through multiple iterations as I learned the intricacies of automated deployment. Each commit represents a small victory over YAML indentation errors and permission issues.

## Phase 2: The Great Transformation (Day 3-4)

Then came the pivotal moment - two commits that changed everything:

### `Complete rewrite: Create minimal Tatva blog`
### `Transform into Jekyll-like static site generator`

This is where Tatva truly began. Instead of using Jekyll or another existing static site generator, I made the bold decision to build my own. The 865-line `build.js` file became the heart of the system, implementing:

- **Jekyll-compatible frontmatter parsing** using `js-yaml`
- **Custom Liquid-like templating engine** with support for:
  - Variables: `{{ site.title }}`
  - Conditionals: `{% if page.title %}`
  - Loops: `{% for post in site.posts %}`
  - Includes: `{% include header.html %}`
  - Filters: `{{ post.date | date: "%B %d, %Y" }}`

Why reinvent the wheel? Because sometimes you need a wheel that fits your exact cart.

## Phase 3: The Feature Factory (Day 3-4)

With the foundation solid, I went into feature development mode:

### SEO & Optimization
- `Add sitemap.xml for SEO`
- `Add sitemap.xml generation and build process integration`
- `Add llms.txt for LLM-friendly site overview`

### Visual Polish
- `Add favicon copying to build process`
- `sass` - SCSS compilation support
- `dark` - Dark mode implementation with CSS custom properties

### Infrastructure
- `better sitemap` - Enhanced sitemap generation
- `copy google` - Google Search Console verification
- Multiple `baseurl` fixes for proper deployment

## Phase 4: Content Creation Era (Day 2-4)

With the technical foundation complete, I shifted focus to content:

- **Family Tree** - Personal genealogy in Nepali
- **Bio** - Professional introduction as "Rocker Ritesh"
- **AI Agents** - Technical posts about multi-agent systems
- **Life** - Philosophical reflections on existence

Each post triggered the automated build system: `Auto-build: Update Jekyll-like blog [skip ci]`

## Phase 5: The Polish Phase (Recent)

The latest commits show attention to detail:
- `footer note` - Adding copyright and attribution
- `layout` - Template refinements
- Final content updates and fixes

## Technical Achievements

### Custom Template Engine
Built a complete Liquid-like templating system that supports:
- Nested layouts (`home.html` extends `default.html`)
- Complex filters and conditionals
- Date formatting and URL generation
- Include system for reusable components

### Automated Pipeline
Created a GitHub Actions workflow that:
- Builds the site on every content change
- Compiles SCSS to CSS
- Generates SEO files (sitemap.xml, robots.txt)
- Deploys to GitHub Pages automatically

### Modern Web Standards
- Responsive design with mobile-first approach
- Dark mode support with CSS custom properties
- Semantic HTML structure
- Accessibility considerations

## The Philosophy Behind Tatva

**Tatva** (तत्त्व) means "truth" or "essence" in Sanskrit. This project embodies that philosophy:

- **Truth in Simplicity**: No unnecessary dependencies or complexity
- **Essence of Control**: Complete ownership of every line of code
- **Truth in Learning**: Each commit represents genuine understanding

## Lessons Learned

1. **GitHub Actions can be tricky** - YAML indentation matters more than you think
2. **Custom solutions offer freedom** - When you build it yourself, you control everything
3. **Incremental development works** - Small commits, big progress
4. **Documentation through commits** - A good git history tells the story

## The Numbers

- **80+ commits** in 5 days
- **865 lines** of custom JavaScript build system
- **7 blog posts** covering diverse topics
- **1 custom static site generator** built from scratch

## What's Next?

The foundation is solid, the content is flowing, and the automation is humming. Tatva has evolved from a simple idea to a fully functional, custom-built publishing platform.

Future plans include:
- Enhanced markdown processing
- Comment system integration
- Analytics and performance monitoring
- More advanced templating features

## Reflection

This journey represents more than just building a website - it's about understanding the tools we use daily. By rebuilding Jekyll's functionality from scratch, I gained deep insights into:
- Static site generation principles
- Template processing algorithms
- Build system architecture
- Modern web development practices

Sometimes the best way to learn a technology is to recreate it yourself.

---

*View the complete source code and commit history at [GitHub](https://github.com/rockerritesh/tatva)*

**"The purpose of Tatva is not just to publish content, but to understand the essence of how publishing works."** 