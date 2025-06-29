import { marked } from 'marked';

class BlogApp {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.posts = [];
    this.aboutInfo = '';
    
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupModal();
    this.loadContent();
  }

  setupTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);
    });
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetSection = button.getAttribute('data-section');
        
        navButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${targetSection}-section`).classList.add('active');
      });
    });
  }

  setupModal() {
    const modal = document.getElementById('blog-modal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  async loadContent() {
    await this.loadAboutInfo();
    await this.loadBlogPosts();
  }

  async loadAboutInfo() {
    try {
      const response = await fetch('./info/about.md');
      if (response.ok) {
        const markdown = await response.text();
        this.aboutInfo = marked(markdown);
        document.getElementById('about-info').innerHTML = this.aboutInfo;
      } else {
        document.getElementById('about-info').innerHTML = `
          <h3>Welcome to Tatva!</h3>
          <p>This is a simple and elegant blog website. Add your information by creating an <code>about.md</code> file in the <code>info/</code> folder.</p>
          <p>Features:</p>
          <ul>
            <li>📝 Markdown support for posts and info</li>
            <li>🌙 Dark/Light mode toggle</li>
            <li>📱 Responsive design</li>
            <li>⚡ Static site generation</li>
          </ul>
        `;
      }
    } catch (error) {
      console.error('Error loading about info:', error);
      document.getElementById('about-info').innerHTML = `
        <h3>Welcome to Tatva!</h3>
        <p>This is a simple and elegant blog website. Add your information by creating an <code>about.md</code> file in the <code>info/</code> folder.</p>
      `;
    }
  }

  async loadBlogPosts() {
    try {
      // In a real static site, you'd have a build process that generates a posts index
      // For now, we'll try to load some common post files
      const postFiles = [
        'hello-world.md',
        'getting-started.md',
        'markdown-guide.md'
      ];

      const posts = [];
      
      for (const file of postFiles) {
        try {
          const response = await fetch(`./posts/${file}`);
          if (response.ok) {
            const markdown = await response.text();
            const post = this.parsePost(markdown, file);
            posts.push(post);
          }
        } catch (error) {
          console.log(`Post ${file} not found, skipping...`);
        }
      }

      if (posts.length > 0) {
        this.posts = posts;
        this.renderBlogList();
      } else {
        document.getElementById('blog-list').innerHTML = `
          <div class="blog-card">
            <h3>No posts yet</h3>
            <p class="date">Getting started</p>
            <p class="excerpt">
              Add your blog posts as markdown files in the <code>posts/</code> folder. 
              Each post will be automatically displayed here. Start by creating a file like 
              <code>hello-world.md</code> in the posts directory.
            </p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
    }
  }

  parsePost(markdown, filename) {
    const lines = markdown.split('\n');
    let title = filename.replace('.md', '').replace(/-/g, ' ');
    let date = new Date().toLocaleDateString();
    let content = markdown;

    // Simple frontmatter parsing
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
            date = new Date(value).toLocaleDateString();
          }
        });
        
        content = contentLines.join('\n');
      }
    }

    // Generate excerpt from first paragraph
    const contentHtml = marked(content);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentHtml;
    const firstParagraph = tempDiv.querySelector('p');
    const excerpt = firstParagraph ? firstParagraph.textContent.substring(0, 150) + '...' : '';

    return {
      title: this.capitalizeTitle(title),
      date,
      content,
      excerpt,
      filename
    };
  }

  capitalizeTitle(title) {
    return title.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  renderBlogList() {
    const blogList = document.getElementById('blog-list');
    blogList.innerHTML = this.posts.map(post => `
      <div class="blog-card" onclick="app.openPost('${post.filename}')">
        <h3>${post.title}</h3>
        <p class="date">${post.date}</p>
        <p class="excerpt">${post.excerpt}</p>
      </div>
    `).join('');
  }

  openPost(filename) {
    const post = this.posts.find(p => p.filename === filename);
    if (post) {
      const modal = document.getElementById('blog-modal');
      const content = document.getElementById('blog-content');
      
      content.innerHTML = `
        <h1>${post.title}</h1>
        <p style="color: #6b7280; margin-bottom: 2rem;">${post.date}</p>
        ${marked(post.content)}
      `;
      
      modal.style.display = 'block';
    }
  }
}

// Initialize the app
const app = new BlogApp();

// Make app globally available for onclick handlers
window.app = app;