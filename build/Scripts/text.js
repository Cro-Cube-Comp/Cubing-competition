function boldText(text, start = 0, end = text.length) {
  // Extract the part of the text that needs to be bolded
  const boldedPart = bolded(text.substring(start, end));

  // Return the text with the bolded part
  return `${text.slice(0, start)}${boldedPart}${text.slice(end)}`;
}
function italicText(text, start = 0, end = text.length) {
  // Extract the part of the text that needs to be italicized
  const italicizedPart = italicized(text.substring(start, end));

  // Return the text with the italicized part
  return `${text.slice(0, start)}${italicizedPart}${text.slice(end)}`;
}
function underlineText(text, start = 0, end = text.length) {
  // Extract the part of the text that needs to be underlined
  const underlinedPart = underlined(text.substring(start, end));

  // Return the text with the underlined part
  return `${text.slice(0, start)}${underlinedPart}${text.slice(end)}`;
}
function hyperlinkText(text, start = 0, end = text.length, url) {
  // Extract the part of the text that needs to be hyperlinked
  const hyperlinkedPart = hyperlink(text.substring(start, end), url);

  // Return the text with the hyperlinked part
  return `${text.slice(0, start)}${hyperlinkedPart}${text.slice(end)}`;
}
function emailToText(text, start = 0, end = text.length, email) {
  // Extract the part of the text that needs to be emailed
  const emailedPart = emailTo(text.substring(start, end), email);

  // Return the text with the emailed part
  return `${text.slice(0, start)}${emailedPart}${text.slice(end)}`;
}
function headerText(text, start = 0, end = text.length, level) {
  // Split the text into lines
  const lines = text.split("\n");

  // Apply the header to each line if the entire line is within the range
  const headerLines = lines.map((line, index) => {
    const lineStart = text.indexOf(line);
    const lineEnd = lineStart + line.length;
    if (line[0] === "#") {
      // Line is a header already, so remove hashtags from start
      return line.replace(/^#+\s*/, "");
    }
    if (lineStart <= start && lineEnd <= end) {
      return header(line, level);
    }
    return line;
  });

  // Join the lines back together
  const headerText = headerLines.join("\n");

  // Return the text with the header part
  return headerText;
}

function bolded(text) {
  return `**${text}**`;
}
function italicized(text) {
  return `_${text}_`;
}
function underlined(text) {
  return `-${text}-`;
}
function hyperlink(text, url = "URL") {
  // Opens link in new tab by
  return `[${text}](${url})`;
}
function emailTo(text, email) {
  return hyperlink(text, `mailto:${email}`);
}
function header(text, level) {
  if (level < 1 || level > 6) {
    throw new Error("Invalid header level.");
  }
  return `${"#".repeat(level)} ${text}`;
}

export {
  boldText,
  italicText,
  underlineText,
  hyperlinkText,
  emailToText,
  headerText,
};
