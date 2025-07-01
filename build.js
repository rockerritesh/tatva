import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import yaml from 'js-yaml';
import sass from 'sass';

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
      description: 'A Jekyll-inspired blog',
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
    processed = processed.replace(/\{\{\s*'now'\s*\|\s*date:\s*"([^"]+)"\s*\}\}/g, (match, format) => {
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
    processed = processed.replace(/\{\{\s*([^|]+)\|\s*default:\s*([^}]+)\s*\}\}/g, (match, variable, defaultVar) => {
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

  // Apply layout to content
  applyLayout(content, layoutName, pageData) {
    if (!layoutName || !this.layouts[layoutName]) {
      return content;
    }
    
    const layout = this.layouts[layoutName];
    const data = {
      site: this.config,
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

      const post = {
        ...frontmatter,
        content: marked(body),
        excerpt: body.substring(0, 300) + '...',
        url,
        date: frontmatter.date || `${year}-${month}-${day}`,
        slug,
        file: filePath
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
      const htmlContent = marked(content);
      const url = frontmatter.permalink || `/${file.replace('.md', '')}/`;
      
      const page = {
        title,
        content: htmlContent,
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

  // Copy sitemap.xml file from root to docs
  copySitemap() {
    const sourcePath = 'sitemap.xml';
    const destPath = 'docs/sitemap.xml';
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log('✅ Copied sitemap.xml to docs directory');
      } catch (error) {
        console.error('❌ Error copying sitemap.xml:', error.message);
      }
    } else {
      console.log('⚠️  sitemap.xml file not found in root directory');
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
    
    // Copy sitemap.xml file
    this.copySitemap();
    
    // Copy favicon.ico file
    this.copyFavicon();
    
    // Generate individual post pages
    for (const post of this.posts) {
      const layoutName = post.layout || 'post';
      const layout = this.layouts[layoutName];
      
      if (!layout) {
        console.log(`⚠️  Layout '${layoutName}' not found for post: ${post.title}`);
        continue;
      }

      const data = {
        site: {
          ...this.config,
          posts: this.posts,
          pages: this.pages
        },
        page: post,
        content: post.content
      };

      const html = this.processTemplate(layout.content, data);
      
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

      const data = {
        site: {
          ...this.config,
          posts: this.posts,
          pages: this.pages
        },
        page: { ...page, layout: layoutName },
        content: page.content
      };
      
      const html = this.processTemplate(layout.content, data);
      
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