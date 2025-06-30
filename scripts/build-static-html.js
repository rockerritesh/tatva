import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const postsDir = path.join(__dirname, '../src/posts');
const infoDir = path.join(__dirname, '../src/info');
const outputDir = path.join(__dirname, '../docs');

// HTML template for blog posts
const POST_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} - Tatva Blog</title>
    <link rel="stylesheet" href="../styles.css">
    <style>
        .post-container { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        .post-header { margin-bottom: 2rem; }
        .post-title { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .post-date { color: var(--text-secondary); font-size: 0.9rem; }
        .post-content { line-height: 1.8; }
        .back-link { display: inline-block; margin-bottom: 2rem; color: var(--accent); text-decoration: none; }
        .back-link:hover { text-decoration: underline; }
        .post-content h1, .post-content h2, .post-content h3 { margin-top: 2rem; margin-bottom: 1rem; }
        .post-content p { margin-bottom: 1rem; }
        .post-content code { background: var(--code-bg); padding: 0.2rem 0.4rem; border-radius: 4px; }
        .post-content pre { background: var(--code-bg); padding: 1rem; border-radius: 8px; overflow-x: auto; }
    </style>
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="nav-brand">
                <h1><a href="../index.html" style="color: inherit; text-decoration: none;">Tatva</a></h1>
            </div>
            <div class="nav-links">
                <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                    <span class="sun-icon">☀️</span>
                    <span class="moon-icon">🌙</span>
                </button>
            </div>
        </nav>
    </header>

    <main class="post-container">
        <a href="../index.html" class="back-link">← Back to Blog</a>
        
        <article class="post-header">
            <h1 class="post-title">{{TITLE}}</h1>
            <p class="post-date">{{DATE}}</p>
        </article>
        
        <div class="post-content">
            {{CONTENT}}
        </div>
    </main>

    <footer>
        <p>&copy; 2024 Tatva. Built with ❤️</p>
    </footer>

    <script>
        // Theme toggle functionality
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    </script>
</body>
</html>`;

function parseMarkdownFile(filePath, filename) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let title = filename.replace('.md', '').replace(/-/g, ' ');
  let date = new Date().toLocaleDateString();
  let markdownContent = content;

  // Parse frontmatter
  if (lines[0] === '---') {
    const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line === '---');
    if (frontmatterEnd > 0) {
      const frontmatterLines = lines.slice(1, frontmatterEnd);
      const contentLines = lines.slice(frontmatterEnd + 1);
      
      frontmatterLines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        if (key.trim().toLowerCase() === 'title') {
          title = value.replace(/['"]/g, '');
        } else if (key.trim().toLowerCase() === 'date') {
          const parsedDate = new Date(value.replace(/['"]/g, ''));
          date = parsedDate.toLocaleDateString();
        }
      });
      
      markdownContent = contentLines.join('\n');
    }
  }

  return {
    title: capitalizeTitle(title),
    date,
    content: markdownContent,
    filename
  };
}

function capitalizeTitle(title) {
  return title.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generatePostHTML(post) {
  const htmlContent = marked(post.content);
  
  return POST_TEMPLATE
    .replace(/\{\{TITLE\}\}/g, post.title)
    .replace(/\{\{DATE\}\}/g, post.date)
    .replace(/\{\{CONTENT\}\}/g, htmlContent);
}

function buildStaticSite() {
  console.log('🔨 Building static HTML files...');
  
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Process blog posts
    if (fs.existsSync(postsDir)) {
      const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      const posts = [];

      // Create posts HTML directory
      const postsHtmlDir = path.join(outputDir, 'posts');
      if (!fs.existsSync(postsHtmlDir)) {
        fs.mkdirSync(postsHtmlDir, { recursive: true });
      }

      for (const filename of postFiles) {
        const filePath = path.join(postsDir, filename);
        const post = parseMarkdownFile(filePath, filename);
        
        // Generate HTML for this post
        const htmlContent = generatePostHTML(post);
        const htmlFilename = filename.replace('.md', '.html');
        const htmlPath = path.join(postsHtmlDir, htmlFilename);
        
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(`  ✅ Generated ${htmlFilename}`);
        
        // Add to posts index (for the main page)
        posts.push({
          title: post.title,
          date: post.date,
          filename: htmlFilename,
          excerpt: generateExcerpt(post.content)
        });
      }

      // Sort posts by date and save index
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      fs.writeFileSync(path.join(outputDir, 'posts-index.json'), JSON.stringify(posts, null, 2));
      console.log(`  📋 Generated posts index with ${posts.length} posts`);
    }

    // Process info pages (like about.md)
    if (fs.existsSync(infoDir)) {
      const infoFiles = fs.readdirSync(infoDir).filter(file => file.endsWith('.md'));
      
      for (const filename of infoFiles) {
        const filePath = path.join(infoDir, filename);
        const content = fs.readFileSync(filePath, 'utf-8');
        const htmlContent = marked(content);
        
        // For info files, we'll just save the HTML content that can be loaded by the main page
        const htmlFilename = filename.replace('.md', '.html');
        const htmlPath = path.join(outputDir, 'info', htmlFilename);
        
        // Ensure info directory exists
        if (!fs.existsSync(path.dirname(htmlPath))) {
          fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
        }
        
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(`  ℹ️  Generated ${htmlFilename}`);
      }
    }

    console.log('✅ Static site build complete!');
    
  } catch (error) {
    console.error('❌ Error building static site:', error);
    process.exit(1);
  }
}

function generateExcerpt(content) {
  // Remove markdown formatting and get first paragraph
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italic
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1'); // Remove links but keep text
    
  const firstParagraph = plainText.split('\n\n')[0];
  return firstParagraph.length > 150 
    ? firstParagraph.substring(0, 150) + '...'
    : firstParagraph;
}

// Run the build
buildStaticSite(); 