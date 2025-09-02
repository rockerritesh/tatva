import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import yaml from 'js-yaml';
import * as sass from 'sass';

class JekyllLikeBuilder {
  constructor() {
    this.config = this.loadConfig();
    this.layouts = {};
    this.includes = {};
    this.posts = [];
    this.pages = [];
  }

  loadConfig() {
    try {
      const configPath = '_config.yml';
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        return yaml.load(configContent);
      }
    } catch (error) {
      console.log('Could not load _config.yml, using defaults');
    }
    
    return {
      title: 'Tatva',
      description: 'A blog',
      baseurl: '',
      author: { name: 'Sumit Yadav' }
    };
  }

  // Parse frontmatter from markdown content
  parseFrontmatter(content) {
    const lines = content.split('\n');
    let frontmatter = {};
    let contentStart = 0;
    
    if (lines[0] === '---') {
      const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line === '---');
      if (frontmatterEnd > 0) {
        const frontmatterLines = lines.slice(1, frontmatterEnd);
        contentStart = frontmatterEnd + 1;
        
        try {
          frontmatter = yaml.load(frontmatterLines.join('\n')) || {};
        } catch (error) {
          console.log('Error parsing frontmatter:', error.message);
        }
      }
    }
    
    const markdownContent = lines.slice(contentStart).join('\n');
    return { frontmatter, content: markdownContent };
  }

  // Load layouts
  loadLayouts() {
    const layoutsDir = '_layouts';
    if (fs.existsSync(layoutsDir)) {
      const layoutFiles = fs.readdirSync(layoutsDir).filter(file => file.endsWith('.html'));
      for (const file of layoutFiles) {
        const layoutName = file.replace('.html', '');
        const layoutContent = fs.readFileSync(path.join(layoutsDir, file), 'utf-8');
        const { frontmatter, content } = this.parseFrontmatter(layoutContent);
        this.layouts[layoutName] = { frontmatter, content };
      }
    }
  }

  // Load includes
  loadIncludes() {
    const includesDir = '_includes';
    if (fs.existsSync(includesDir)) {
      const includeFiles = fs.readdirSync(includesDir).filter(file => file.endsWith('.html'));
      for (const file of includeFiles) {
        const includeName = file.replace('.html', '');
        const includeContent = fs.readFileSync(path.join(includesDir, file), 'utf-8');
        this.includes[includeName] = includeContent;
      }
    }
  }

  // Simple template processing (Jekyll Liquid-like)
  processTemplate(template, data) {
    // Ensure template is a string
    if (typeof template !== 'string') {
      console.log('⚠️  Template is not a string:', typeof template, template);
      return '';
    }
    
    let processed = template;
    
    // First, process includes: {% include header.html %}
    processed = processed.replace(/\{\%\s*include\s+(\w+\.html)\s*\%\}/g, (match, includeName) => {
      const includeKey = includeName.replace('.html', '');
      return this.includes[includeKey] || '';
    });
    
    // Process relative_url filter for literal strings: {{ '/assets/css/style.css' | relative_url }}
    processed = processed.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, (match, url) => {
      return this.config.baseurl + url;
    });
    
    // Process special 'now' date: {{ 'now' | date: '%Y' }}
    processed = processed.replace(/\{\{\s*'now'\s*\|\s*date:\s*['"]([^'"]+)['"]\s*\}\}/g, (match, format) => {
      const now = new Date();
      if (format === '%Y') {
        return now.getFullYear().toString();
      }
      return now.toLocaleDateString();
    });
    
    // Then handle loops BEFORE processing variables inside them
    // Process loops with else: {% for post in site.posts %}...{% else %}...{% endfor %}
    processed = processed.replace(/\{\%\s*for\s+(\w+)\s+in\s+([^%]+)\s*\%\}(.*?)\{\%\s*else\s*\%\}(.*?)\{\%\s*endfor\s*\%\}/gs, (match, itemVar, arrayVar, loopContent, elseContent) => {
      const parts = arrayVar.trim().split('.');
      let array = data;
      
      for (const part of parts) {
        if (array && array[part] !== undefined) {
          array = array[part];
        } else {
          return this.processTemplate(elseContent, data);
        }
      }
      
      if (!Array.isArray(array) || array.length === 0) {
        return this.processTemplate(elseContent, data);
      }
      
      return array.map(item => {
        const itemData = { ...data, [itemVar]: item };
        return this.processTemplate(loopContent, itemData);
      }).join('');
    });
    
    // Process simple loops: {% for post in site.posts %}
    processed = processed.replace(/\{\%\s*for\s+(\w+)\s+in\s+([^%]+)\s*\%\}(.*?)\{\%\s*endfor\s*\%\}/gs, (match, itemVar, arrayVar, loopContent) => {
      const parts = arrayVar.trim().split('.');
      let array = data;
      
      for (const part of parts) {
        if (array && array[part] !== undefined) {
          array = array[part];
        } else {
          return '';
        }
      }
      
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        const itemData = { ...data, [itemVar]: item };

        return this.processTemplate(loopContent, itemData);
      }).join('');
    });
    
    // Process conditionals with comparisons and else: {% if site.posts.size > 0 %}...{% else %}...{% endif %}
    processed = processed.replace(/\{\%\s*if\s+([^%]+)\s*>\s*(\d+)\s*\%\}(.*?)\{\%\s*else\s*\%\}(.*?)\{\%\s*endif\s*\%\}/gs, (match, variable, number, ifContent, elseContent) => {
      const parts = variable.trim().replace('.size', '.length').split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = 0;
          break;
        }
      }
      
      return (value > parseInt(number)) ? this.processTemplate(ifContent, data) : this.processTemplate(elseContent, data);
    });
    
    // Process conditionals with comparisons: {% if site.posts.size > 0 %}
    processed = processed.replace(/\{\%\s*if\s+([^%]+)\s*>\s*(\d+)\s*\%\}(.*?)\{\%\s*endif\s*\%\}/gs, (match, variable, number, content) => {
      const parts = variable.trim().replace('.size', '.length').split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = 0;
          break;
        }
      }
      
      return (value > parseInt(number)) ? this.processTemplate(content, data) : '';
    });
    
    // Process conditionals with else: {% if page.title %}...{% else %}...{% endif %}
    processed = processed.replace(/\{\%\s*if\s+([^%]+)\s*\%\}(.*?)\{\%\s*else\s*\%\}(.*?)\{\%\s*endif\s*\%\}/gs, (match, condition, ifContent, elseContent) => {
      const parts = condition.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      return value ? this.processTemplate(ifContent, data) : this.processTemplate(elseContent, data);
    });
    
    // Process simple conditionals: {% if page.title %}
    processed = processed.replace(/\{\%\s*if\s+([^%]+)\s*\%\}(.*?)\{\%\s*endif\s*\%\}/gs, (match, condition, content) => {
      const parts = condition.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      return value ? this.processTemplate(content, data) : '';
    });
    
    // Now process variables with complex filters
    // Process complex variables with filters: {{ page.description | default: site.description }}
    processed = processed.replace(/\{\{\s*([^|]+)\|\s*default:\s*([^}]+?)\s*\}\}/g, (match, variable, defaultVar) => {
      const parts = variable.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          value = null;
          break;
        }
      }
      
      if (value) {
        return value;
      }
      
      // Try to get default value
      const defaultParts = defaultVar.trim().split('.');
      let defaultValue = data;
      for (const part of defaultParts) {
        if (defaultValue && defaultValue[part] !== undefined) {
          defaultValue = defaultValue[part];
        } else {
          return '';
        }
      }
      
      return defaultValue || '';
    });
    
    // Process filters: {{ post.url | relative_url }}
    processed = processed.replace(/\{\{\s*([^|]+)\|\s*relative_url\s*\}\}/g, (match, variable) => {
      const parts = variable.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }
      
      return this.config.baseurl + value;
    });
    
    // Process escape filter: {{ post.title | escape }}
    processed = processed.replace(/\{\{\s*([^|]+)\|\s*escape\s*\}\}/g, (match, variable) => {
      const parts = variable.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }
      
      return value ? value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
    });

    // Process escape and slice filter: {{ post.title | escape | slice: 0 }}
    processed = processed.replace(/\{\{\s*([^|]+)\|\s*escape\s*\|\s*slice:\s*(\d+)\s*\}\}/g, (match, variable, index) => {
      const parts = variable.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }
      
      const escapedValue = value ? value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
      return escapedValue.charAt(parseInt(index)) || '';
    });
    
    // Process strip_html and truncatewords: {{ post.excerpt | strip_html | truncatewords: 30 }}
    processed = processed.replace(/\{\{\s*([^|]+)\|\s*strip_html\s*\|\s*truncatewords:\s*(\d+)\s*\}\}/g, (match, variable, wordCount) => {
      const parts = variable.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return '';
        }
      }
      
      if (value) {
        const stripped = value.replace(/<[^>]*>/g, '');
        const words = stripped.split(/\s+/).slice(0, parseInt(wordCount));
        return words.join(' ') + (words.length >= parseInt(wordCount) ? '...' : '');
      }
      
      return '';
    });
    
    // Process date filters: {{ page.date | date_to_xmlschema }}
    processed = processed.replace(/\{\{\s*([^|]+)\|\s*date_to_xmlschema\s*\}\}/g, (match, dateVar) => {
      const parts = dateVar.trim().split('.');
      let date = data;
      
      for (const part of parts) {
        if (date && date[part] !== undefined) {
          date = date[part];
        } else {
          return match;
        }
      }
      
      if (date) {
        const dateObj = new Date(date);
        return dateObj.toISOString();
      }
      
      return match;
    });
    
    // Process date filters: {{ page.date | date: "%B %d, %Y" }}
    processed = processed.replace(/\{\{\s*([^|]+)\|\s*date:\s*"([^"]+)"\s*\}\}/g, (match, dateVar, format) => {
      const parts = dateVar.trim().split('.');
      let date = data;
      
      for (const part of parts) {
        if (date && date[part] !== undefined) {
          date = date[part];
        } else {
          return match;
        }
      }
      
      if (date) {
        const dateObj = new Date(date);
        // Simple date formatting
        if (format === '%B %d, %Y') {
          return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        } else if (format === '%Y') {
          return dateObj.getFullYear().toString();
        }
      }
      
      return match;
    });
    
    // Finally, process simple variables: {{ site.title }}, {{ page.title }}
    processed = processed.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, variable) => {
      // Skip if this looks like a complex template that wasn't processed
      if (variable.includes('|') || variable.includes('%')) {
        return match;
      }
      

      
      const parts = variable.trim().split('.');
      let value = data;
      
      for (const part of parts) {
        if (value && value[part] !== undefined) {
          value = value[part];
        } else {
          return ''; // Return empty instead of keeping the template
        }
      }
      
      return value || '';
    });
    
    return processed;
  }

  // Process Mermaid code blocks with placeholder system
  processMermaidBlocks(content) {
    const mermaidBlocks = [];
    let index = 0;
    
    // First pass: extract mermaid blocks and replace with placeholders
    const contentWithPlaceholders = content.replace(/```mermaid\n([\s\S]*?)\n```/g, (match, mermaidCode) => {
      const cleanCode = mermaidCode.trim();
      mermaidBlocks[index] = cleanCode;
      const placeholder = `MERMAID_PLACEHOLDER_${index}`;
      index++;
      return placeholder;
    });
    
    // Store the blocks for later restoration
    this.mermaidBlocks = mermaidBlocks;
    return contentWithPlaceholders;
  }
  
  // Restore Mermaid blocks after markdown processing
  restoreMermaidBlocks(htmlContent) {
    if (!this.mermaidBlocks) return htmlContent;
    
    let restoredContent = htmlContent;
    this.mermaidBlocks.forEach((block, index) => {
      const placeholder = `MERMAID_PLACEHOLDER_${index}`;
      const mermaidDiv = `<div class="mermaid">${block}</div>`;
      restoredContent = restoredContent.replace(new RegExp(placeholder, 'g'), mermaidDiv);
    });
    
    return restoredContent;
  }

  // Apply layout to content
  applyLayout(content, layoutName, pageData) {
    if (!layoutName || !this.layouts[layoutName]) {
      return content;
    }
    
    const layout = this.layouts[layoutName];
    const data = {
      site: {
        ...this.config,
        posts: this.posts,
        pages: this.pages
      },
      page: pageData,
      content: content
    };
    
    let processed = this.processTemplate(layout.content, data);
    
    // If layout has a parent layout, apply it recursively
    if (layout.frontmatter.layout) {
      processed = this.applyLayout(processed, layout.frontmatter.layout, pageData);
    }
    
    return processed;
  }

  // Extract first image from markdown content
  extractFirstImage(content) {
    // First, look for HTML img tags: <img src="..." alt="...">
    const htmlImageRegex = /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/i;
    const htmlMatch = content.match(htmlImageRegex);
    
    if (htmlMatch && htmlMatch[1]) {
      const imagePath = htmlMatch[1].trim();
      return imagePath;
    }
    
    // If no HTML img found, look for markdown image syntax: ![alt](image.jpg)
    const markdownImageRegex = /!\[.*?\]\(([^)]+)\)/;
    const markdownMatch = content.match(markdownImageRegex);
    
    if (markdownMatch && markdownMatch[1]) {
      const imagePath = markdownMatch[1].trim();
      return imagePath;
    }
    
    return null;
  }

  // Process post thumbnails for home page
  processPostThumbnails(html) {
    let postIndex = 0;
    
    // Find each post-image div and populate with correct data
    return html.replace(/<div class="post-image">\s*<div class="post-image-overlay">\s*\w\s*<\/div>\s*<\/div>/g, (match) => {
      const post = this.posts[postIndex];
      postIndex++;
      
      if (!post) {
        return match; // Return original if no post found
      }
      
      // Generate the thumbnail HTML
      if (post.featuredImage) {
        // Handle relative image paths
        let imageUrl = post.featuredImage;
        if (!imageUrl.startsWith('http')) {
          imageUrl = post.url + imageUrl;
        }
        
        return `<div class="post-image" style="background-image: url('${imageUrl}');">
                    <div class="post-image-overlay">
                      ${post.title.charAt(0)}
                    </div>
                </div>`;
      } else {
        return `<div class="post-image default-bg" style="background: ${post.defaultImageBg};">
                    ${post.defaultImageIcon}
                </div>`;
      }
    });
  }

  // Generate default image identifier based on post title
  generateDefaultImage(title) {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)'
    ];
    
    // Use title length to pick a consistent color for each post
    const colorIndex = title.length % colors.length;
    return {
      background: colors[colorIndex],
      icon: title.charAt(0).toUpperCase()
    };
  }

  // Process posts
  async loadPosts() {
    if (!fs.existsSync('_posts')) {
      console.log('No _posts directory found');
      return;
    }

    const files = fs.readdirSync('_posts').filter(file => file.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join('_posts', file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Parse frontmatter
      const frontmatterMatch = content.match(/^---\n(.*?)\n---\n(.*)/s);
      if (!frontmatterMatch) {
        console.log(`⚠️  No frontmatter in ${file}`);
        continue;
      }

      const frontmatter = yaml.load(frontmatterMatch[1]) || {};
      const body = frontmatterMatch[2];

      // Generate URL from filename: 2024-01-21-life.md -> /posts/2024/01/21/life/
      const dateMatch = file.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
      if (!dateMatch) {
        console.log(`⚠️  Invalid post filename format: ${file}`);
        continue;
      }

      const [, year, month, day, slug] = dateMatch;
      const url = `/posts/${year}/${month}/${day}/${slug}/`;

      // Process Mermaid blocks before converting markdown to HTML
      const processedBody = this.processMermaidBlocks(body);
      const htmlContent = marked(processedBody);
      // Restore Mermaid blocks after markdown processing
      const finalContent = this.restoreMermaidBlocks(htmlContent);

      // Extract first image from post content
      const firstImage = this.extractFirstImage(body);
      const defaultImage = this.generateDefaultImage(frontmatter.title || slug);
      
      const post = {
        ...frontmatter,
        content: finalContent,
        excerpt: body.substring(0, 300) + '...',
        url,
        date: frontmatter.date || `${year}-${month}-${day}`,
        slug,
        file: filePath,
        featuredImage: firstImage,
        defaultImageBg: defaultImage.background,
        defaultImageIcon: defaultImage.icon
      };

      this.posts.push(post);
    }

    // Sort posts by date (newest first)
    this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(`✅ Loaded ${this.posts.length} posts`);
  }

  // Process pages
  processPages() {
    this.pages = [];
    
    // Process markdown files in root (exclude README.md and files starting with _)
    const markdownFiles = fs.readdirSync('.')
      .filter(file => file.endsWith('.md') && !file.startsWith('_') && file !== 'README.md');
    
    for (const file of markdownFiles) {
      const rawContent = fs.readFileSync(file, 'utf-8');
      const { frontmatter, content } = this.parseFrontmatter(rawContent);
      
      const title = frontmatter.title || file.replace('.md', '');
      // Process Mermaid blocks before converting markdown to HTML
      const processedContent = this.processMermaidBlocks(content);
      const htmlContent = marked(processedContent);
      // Restore Mermaid blocks after markdown processing
      const finalContent = this.restoreMermaidBlocks(htmlContent);
      const url = frontmatter.permalink || `/${file.replace('.md', '')}/`;
      
      const page = {
        title,
        content: finalContent,
        url,
        filename: file,
        frontmatter
      };
      
      this.pages.push(page);
    }
  }

  // Copy post assets (images, etc.)
  copyPostAssets() {
    if (!fs.existsSync('_posts')) return;
    
    // Get all non-markdown files from _posts directory
    const assetFiles = fs.readdirSync('_posts').filter(file => !file.endsWith('.md'));
    
    for (const assetFile of assetFiles) {
      const sourcePath = path.join('_posts', assetFile);
      
      // For each post that might reference this asset, copy it to the post directory
      for (const post of this.posts) {
        // Read the original markdown file to check for asset references
        const markdownContent = fs.readFileSync(post.file, 'utf-8');
        
        // Check if the post markdown content references this asset
        if (markdownContent.includes(assetFile)) {
          const postDir = path.join('docs', post.url.replace(/\/$/, ''));
          const destPath = path.join(postDir, assetFile);
          
          try {
            // Ensure directory exists
            fs.mkdirSync(postDir, { recursive: true });
            // Copy the asset file
            fs.copyFileSync(sourcePath, destPath);
            console.log(`  ✅ Copied ${assetFile} to ${post.url}`);
          } catch (error) {
            console.error(`❌ Error copying ${assetFile} to ${post.url}:`, error.message);
          }
        }
      }
    }
  }

  // Compile SCSS
  compileScss() {
    const scssPath = '_sass/main.scss';
    const outputPath = 'docs/assets/css/style.css';
    
    if (fs.existsSync(scssPath)) {
      try {
        const result = sass.compile(scssPath);
        
        // Ensure output directory exists
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, result.css);
        console.log('✅ Compiled SCSS to CSS');
      } catch (error) {
        console.error('❌ SCSS compilation error:', error.message);
      }
    }
  }

  // Copy CNAME file from root to docs
  copyCNAME() {
    const sourcePath = 'CNAME';
    const destPath = 'docs/CNAME';
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log('✅ Copied CNAME to docs directory');
      } catch (error) {
        console.error('❌ Error copying CNAME:', error.message);
      }
    } else {
      console.log('⚠️  CNAME file not found in root directory');
    }
  }

  // Generate sitemap.xml file dynamically
  generateSitemap() {
    const destPath = 'docs/sitemap.xml';
    
    // Get the site URL from config
    let siteUrl = this.config.url || 'https://your-domain.com';
    let baseUrl = this.config.baseurl || '';
    
    // If baseurl is a full URL, ignore it and just use the main url
    if (baseUrl.startsWith('http')) {
      baseUrl = '';
    }
    
    // Ensure siteUrl doesn't end with slash
    siteUrl = siteUrl.replace(/\/$/, '');
    if (baseUrl && !baseUrl.startsWith('/')) {
      baseUrl = '/' + baseUrl;
    }
    
    const fullBaseUrl = `${siteUrl}${baseUrl}`;
    
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    // Add homepage
    sitemapContent += `
  <url>
    <loc>${fullBaseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
    
    // Add pages (excluding homepage which is already added)
    for (const page of this.pages) {
      if (page.url === '/') continue; // Skip homepage as it's already added
      
      const pageUrl = page.url.replace(/\/$/, '');
      const lastmod = page.frontmatter.date || new Date().toISOString().split('T')[0];
      
      sitemapContent += `
  <url>
    <loc>${fullBaseUrl}${pageUrl}/</loc>
    <lastmod>${lastmod}T00:00:00Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
    
    // Add posts
    for (const post of this.posts) {
      const postDate = new Date(post.date);
      const lastmod = postDate.toISOString();
      
      sitemapContent += `
  <url>
    <loc>${fullBaseUrl}${post.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
    
    sitemapContent += `
</urlset>
`;
    
    try {
      fs.writeFileSync(destPath, sitemapContent);
      console.log(`✅ Generated sitemap.xml with ${this.posts.length} posts and ${this.pages.length} pages`);
    } catch (error) {
      console.error('❌ Error generating sitemap.xml:', error.message);
    }
  }

  // Copy favicon.ico file from root to docs
  copyFavicon() {
    const sourcePath = 'favicon.ico';
    const destPath = 'docs/favicon.ico';
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log('✅ Copied favicon.ico to docs directory');
      } catch (error) {
        console.error('❌ Error copying favicon.ico:', error.message);
      }
    } else {
      console.log('⚠️  favicon.ico file not found in root directory');
    }
  }

  // Copy googleb55b08cea6f7992e.html file from root to docs
  copyGoogleHtml() {
    const sourcePath = 'googleb55b08cea6f7992e.html';
    const destPath = 'docs/googleb55b08cea6f7992e.html';
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log('✅ Copied googleb55b08cea6f7992e.html to docs directory');
      } catch (error) {
        console.error('❌ Error copying googleb55b08cea6f7992e.html:', error.message);
      }
    } else { 
      console.log('⚠️  googleb55b08cea6f7992e.html file not found in root directory');
    }
  }

  // Generate robots.txt file
  generateRobotsTxt() {
    const destPath = 'docs/robots.txt';
    
    // Get the site URL from config, handling cases where baseurl might be redundant
    let siteUrl = this.config.url || 'https://your-domain.com';
    let baseUrl = this.config.baseurl || '';
    
    // If baseurl is a full URL, ignore it and just use the main url
    if (baseUrl.startsWith('http')) {
      baseUrl = '';
    }
    
    // Ensure siteUrl doesn't end with slash and baseUrl doesn't start with slash (unless empty)
    siteUrl = siteUrl.replace(/\/$/, '');
    if (baseUrl && !baseUrl.startsWith('/')) {
      baseUrl = '/' + baseUrl;
    }
    
    const fullSitemapUrl = `${siteUrl}${baseUrl}/sitemap.xml`;
    
    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${fullSitemapUrl}
`;
    
    try {
      fs.writeFileSync(destPath, robotsContent);
      console.log('✅ Generated robots.txt');
    } catch (error) {
      console.error('❌ Error generating robots.txt:', error.message);
    }
  }

  // Generate llms.txt file
  generateLlmsTxt() {
    const destPath = 'docs/llms.txt';
    
    // Get site info from config
    const siteName = this.config.title || 'Personal Website';
    const description = this.config.description || 'A personal blog and website';
    const authorName = this.config.author?.name || 'Site Owner';
    const authorEmail = this.config.author?.email || '';
    
    const llmsContent = `# ${siteName}

This site is open to AI crawling and indexing.

## About
${description}

## Author
${authorName}

## Content Policy
This is a personal blog containing thoughts, ideas, and experiences. 
Content is available for AI training and reference with attribution.

## Contact
${authorEmail ? `Email: ${authorEmail}` : 'Contact information available on the about page.'}

## Technical
- Built with a custom Jekyll-like static site generator
- Posts available in structured format
- Sitemap available at /sitemap.xml

User-agent: *
Allow: /
`;
    
    try {
      fs.writeFileSync(destPath, llmsContent);
      console.log('✅ Generated llms.txt');
    } catch (error) {
      console.error('❌ Error generating llms.txt:', error.message);
    }
  }

  // Build the site
  async build() {
    console.log('🔨 Building Jekyll-like site...');
    
    // Create docs directory
    if (fs.existsSync('docs')) {
      fs.rmSync('docs', { recursive: true });
    }
    fs.mkdirSync('docs', { recursive: true });
    
    // Load templates
    this.loadLayouts();
    this.loadIncludes();
    
    // Process content
    await this.loadPosts();
    this.processPages();
    
    // Copy post assets
    this.copyPostAssets();
    
    // Compile SCSS
    this.compileScss();
    
    // Copy CNAME file
    this.copyCNAME();
    
    // Generate sitemap.xml file
    this.generateSitemap();
    
    // Copy favicon.ico file
    this.copyFavicon();

    // Copy googleb55b08cea6f7992e.html file
    this.copyGoogleHtml();
    
    // Generate robots.txt and llms.txt files
    this.generateRobotsTxt();
    this.generateLlmsTxt();
    
    // Generate individual post pages
    for (const post of this.posts) {
      const layoutName = post.layout || 'post';
      const layout = this.layouts[layoutName];
      
      if (!layout) {
        console.log(`⚠️  Layout '${layoutName}' not found for post: ${post.title}`);
        continue;
      }

      const html = this.applyLayout(post.content, layoutName, post);
      
      // Create directory structure for the post
      const postDir = path.join('docs', post.url.replace(/\/$/, ''));
      fs.mkdirSync(postDir, { recursive: true });
      
      // Write the post HTML
      fs.writeFileSync(path.join(postDir, 'index.html'), html);
      console.log(`  ✅ Generated ${post.url}`);
    }
    
    // Generate pages
    for (const page of this.pages) {
      const pageData = {
        ...page.frontmatter,
        title: page.title,
        url: page.url
      };
      
      const layoutName = page.frontmatter.layout || 'default';
      const layout = this.layouts[layoutName];
      
      if (!layout) {
        console.log(`⚠️  Layout '${layoutName}' not found for page: ${page.title}`);
        continue;
      }

      const layoutPageData = {
        ...page.frontmatter,
        title: page.title,
        url: page.url,
        layout: layoutName
      };
      
      let html = this.applyLayout(page.content, layoutName, layoutPageData);
      
      // Special handling for home page to process post thumbnails
      if (page.url === '/' && layoutName === 'home') {
        html = this.processPostThumbnails(html);
      }
      
      let outputPath;
      if (page.url === '/') {
        outputPath = 'docs/index.html';
      } else {
        outputPath = path.join('docs', page.url.slice(1), 'index.html');
      }
      
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, html);
      
      console.log(`  ✅ Generated ${page.url}`);
    }
    
    console.log(`✅ Site built successfully! Generated ${this.posts.length} posts and ${this.pages.length} pages.`);
  }
}

// Build the site
const builder = new JekyllLikeBuilder();
builder.build();