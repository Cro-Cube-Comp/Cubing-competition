// Example functions to convert markdown to HTML for posts
function boldedMarkdown(content) {
  // Regular expression to find **text**
  return content.replace(/\*\*(.*?)\*\*/g, '<span class="bolded">$1</span>');
}
function italicizedMarkdown(content) {
  // Regular expression to find _text_
  return content.replace(/\_(.*?)\_/g, '<span class="italicized">$1</span>');
}
function underlinedMarkdown(content) {
  // Regular expression to find -text-
  return content.replace(/\-(.*?)\-/g, '<span class="underlined">$1</span>');
}
function hyperlinkedMarkdown(content) {
  // Regular expression to find [text](url)
  return content.replace(/\[(.*?)\]\((.*?)\)/g, function (match, text, url) {
    // Check if the URL is absolute and is HTTP protocol (starts with 'http://' or 'https://')
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return `<a href="${url}" target="_blank" class="hyperlink-a">${text}</a>`;
    }
    if (url.startsWith("mailto:")) {
      return `<a href="${url}" class="mail-a">${text}</a>`;
    }
    // If the URL is not absolute, return the original match without modification
    return match;
  });
}
function headerMarkdown(content) {
  // Regular expression to match Markdown headers from ### to ######
  return content.replace(/^(#{1,6})\s+(.*)$/gm, function (match, hashes, text) {
    const level = hashes.length; // Number of '#' determines the header level
    if (level >= 3 && level <= 5) {
      return `<h${level}>${text}</h${level}>`;
    }
    // If the header level is not between 3 and 5, return the original match without modifications
    return match;
  });
}

export function markdownToHtml(markdown) {
  const boldedContent = boldedMarkdown(markdown);
  const italicizedContent = italicizedMarkdown(boldedContent);
  const underlinedContent = underlinedMarkdown(italicizedContent);
  const hyperlinkedContent = hyperlinkedMarkdown(underlinedContent);
  const headerContent = headerMarkdown(hyperlinkedContent);
  return headerContent;
}
