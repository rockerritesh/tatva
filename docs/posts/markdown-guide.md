---
title: Markdown Guide for Blog Posts
date: 2024-01-20
---

# Markdown Guide for Blog Posts

This post demonstrates how to use markdown formatting in your blog posts. All posts are written in markdown and automatically converted to HTML.

## Headers

Use `#` for headers:

```markdown
# H1 Header
## H2 Header
### H3 Header
```

## Text Formatting

- **Bold text** with `**bold**`
- *Italic text* with `*italic*`
- `Inline code` with backticks
- ~~Strikethrough~~ with `~~text~~`

## Lists

### Unordered Lists
- Item 1
- Item 2
  - Nested item
  - Another nested item

### Ordered Lists
1. First item
2. Second item
3. Third item

## Code Blocks

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('World'));
```

## Links and Images

- [Link to Google](https://google.com)
- ![Alt text for image](https://via.placeholder.com/300x200)

## Blockquotes

> This is a blockquote. Use it for highlighting important information or quotes from other sources.

## Tables

| Feature | Supported |
|---------|-----------|
| Headers | ✅ |
| Lists | ✅ |
| Code | ✅ |
| Images | ✅ |

## Frontmatter

Each post can include frontmatter at the top:

```yaml
---
title: Your Post Title
date: 2024-01-20
---
```

The frontmatter is used to set the post title and date. If not provided, the filename will be used as the title.

Happy writing! ✍️