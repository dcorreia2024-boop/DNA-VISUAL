// Future: mammoth.js for DOCX text extraction
// npm install mammoth (when needed)

async function extractText(buffer, mimeType) {
  if (mimeType === 'text/plain') {
    return buffer.toString('utf-8');
  }

  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // TODO: const mammoth = require('mammoth');
    // const result = await mammoth.extractRawText({ buffer });
    // return result.value;
    return '[DOCX parsing not yet implemented - install mammoth.js]';
  }

  return '[Unsupported file type]';
}

module.exports = { extractText };
