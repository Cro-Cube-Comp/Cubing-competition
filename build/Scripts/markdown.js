// Example functions to convert markdown to HTML for posts
function boldedMarkdown(content) {
  // Regular expression to find **text**
  return content.replace(/\*\*(.*?)\*\*/g, '<span class="bolded">$1</span>');
}
function italicizedMarkdown(content) {
  // Regular expression to find _text_
  return content.replace(/\_(.*?)\_/g, '<span class="italicized">$1</span>');
}

export function markdownToHtml(markdown) {
  return italicizedMarkdown(boldedMarkdown(markdown));
}
