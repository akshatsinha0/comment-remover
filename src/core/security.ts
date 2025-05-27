export function validateInput(code: string): void {
  if (code.length > 50_000_000) { // 50MB limit
    throw new Error('File size exceeds security limits');
  }
  
  if (/(\\x[0-9a-fA-F]{2}){10,}/.test(code)) {
    throw new Error('Suspicious binary patterns detected');
  }
}

export function safeReplace(content: string, pattern: RegExp, replacement: string): string {
  if (pattern.source.includes('(.*?)')) {
    throw new Error('Potentially dangerous regex pattern');
  }
  
  return content.replace(pattern, replacement);
}
