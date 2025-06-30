import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Parse frontmatter from markdown content
function parseFrontmatter(content) {
  const lines = content.split('\n');
  let frontmatter = {};
  let contentStart = 0;
  
  if (lines[0] === '---') {
    const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line === '---');
    if (frontmatterEnd > 0) {
      const frontmatterLines = lines.slice(1, frontmatterEnd);
      contentStart = frontmatterEnd + 1;
      
      frontmatterLines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          frontmatter[key.trim()] = value.replace(/['"]/g, '');
        }
      });
    }
  }
  
  const markdownContent = lines.slice(contentStart).join('\n');
  return { frontmatter, content: markdownContent };
}

// Create docs directory
if (!fs.existsSync('docs')) {
  fs.mkdirSync('docs');
}

// Read all markdown files from posts directory
const postsDir = 'posts';
const posts = [];

if (fs.existsSync(postsDir)) {
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md') && file !== '.gitkeep');
  
  for (const file of files) {
    const rawContent = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const { frontmatter, content } = parseFrontmatter(rawContent);
    
    const title = frontmatter.title || file.replace('.md', '').replace(/-/g, ' ');
    const date = frontmatter.date || new Date().toISOString().split('T')[0];
    const htmlContent = marked(content);
    
    // Create individual blog post HTML
    const postHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Tatva</title>
</head>
<body>
    <h1>Tatva</h1>
    <p><a href="index.html">← Back to Blog</a></p>
    
    <h2>${title}</h2>
    ${date && `<p><em>Published: ${date}</em></p>`}
    
    ${htmlContent}
    
    <hr>
    <p><a href="index.html">← Back to Blog</a></p>
</body>
</html>`;

    // Write individual post file
    fs.writeFileSync(path.join('docs', file.replace('.md', '.html')), postHtml);
    
    // Add to posts list for index
    const plainTextContent = content.replace(/#{1,6}\s+/g, '').replace(/\*\*/g, '').replace(/\*/g, '');
    posts.push({
      title: title,
      date: date,
      filename: file.replace('.md', '.html'),
      excerpt: plainTextContent.substring(0, 150) + '...'
    });
    
    console.log(`Generated: ${file.replace('.md', '.html')}`);
  }
}

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tatva - Blog</title>
</head>
<body>
    <h1>Tatva</h1>
    <p>Welcome to my simple blog</p>
    
    <h2>Blog Posts</h2>
    ${posts.length > 0 ? 
      posts.map(post => `
        <div>
          <h3><a href="${post.filename}">${post.title}</a></h3>
          ${post.date && `<p><em>${post.date}</em></p>`}
          <p>${post.excerpt}</p>
        </div>
      `).join('') 
      : '<p>No blog posts yet.</p>'
    }
    
    <hr>
    <p>Built with ❤️</p>
</body>
</html>`;

fs.writeFileSync('docs/index.html', indexHtml);
console.log('Generated: index.html');
console.log(`Blog built successfully! Found ${posts.length} posts.`); 