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

// Load about content
async function loadAboutContent() {
    const aboutContainer = document.getElementById('about-content');
    
    try {
        // Try to fetch the generated HTML file first
        let response = await fetch('./info/about.html');
        
        if (!response.ok) {
            // If HTML doesn't exist, try to fetch the markdown and convert it
            response = await fetch('./info/about.md');
            if (!response.ok) {
                throw new Error('About content not found');
            }
            const markdown = await response.text();
            // Simple markdown to HTML conversion for basic content
            const html = convertMarkdownToHTML(markdown);
            aboutContainer.innerHTML = html;
        } else {
            const content = await response.text();
            aboutContainer.innerHTML = content;
        }
        
    } catch (error) {
        console.error('Error loading about content:', error);
        aboutContainer.innerHTML = `
            <h1>About</h1>
            <p>About content will be available soon.</p>
        `;
    }
}

// Simple markdown to HTML converter for basic content
function convertMarkdownToHTML(markdown) {
    return markdown
        .replace(/^---[\s\S]*?---/m, '') // Remove frontmatter
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/^\- (.*$)/gm, '<li>$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(.+)$/gm, '<p>$1</p>')
        .replace(/<p><h/g, '<h')
        .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
        .replace(/<p><li>/g, '<li>')
        .replace(/<\/li><\/p>/g, '</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadAboutContent();
});