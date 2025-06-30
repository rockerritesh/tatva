// Theme toggle functionality
function initTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Load and display blog posts
async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    
    try {
        const response = await fetch('./posts-index.json');
        if (!response.ok) {
            throw new Error('Failed to load posts');
        }
        
        const posts = await response.json();
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">No posts available yet.</p>';
            return;
        }
        
        const postsHTML = posts.map(post => `
            <article class="post-card">
                <h4><a href="./posts/${post.filename}">${post.title}</a></h4>
                <p class="post-date">${post.date}</p>
                <p class="post-excerpt">${post.excerpt}</p>
            </article>
        `).join('');
        
        postsContainer.innerHTML = postsHTML;
        
    } catch (error) {
        console.error('Error loading posts:', error);
        postsContainer.innerHTML = '<p class="error">Failed to load posts.</p>';
    }
}

// Load about content
async function loadAboutContent() {
    const aboutContainer = document.getElementById('about-content');
    
    try {
        const response = await fetch('./info/about.html');
        if (!response.ok) {
            throw new Error('About content not found');
        }
        
        const content = await response.text();
        aboutContainer.innerHTML = content;
        
    } catch (error) {
        console.error('Error loading about content:', error);
        aboutContainer.innerHTML = '<p>About content will be available soon.</p>';
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadPosts();
    loadAboutContent();
});