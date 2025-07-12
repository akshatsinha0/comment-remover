import { parse } from '@babel/parser';
import { Telemetry } from '../core/telemetry';
const generate = require('@babel/generator').default;

export class JsCommentParser {
  private telemetry = new Telemetry();

  public removeComments(code: string): string {
    try {
      // Special case: Remove JSX-style comments of the form {/* ... */} including the curly braces
      // This regex matches { /* ... */ } with optional whitespace after the opening brace and before the closing brace
      code = code.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

      // Use Babel parser with JSX support
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
        attachComment: false
      });
      
      return this.generateCodeWithoutComments(ast);
    } catch (error) {
      this.telemetry.logError(error as Error);
      return code; 
    }
  }

  private generateCodeWithoutComments(ast: any): string {
    

    
    

    
    
    

    
    function stripComments(node: any) {
      if (node && typeof node === 'object') {
        
        delete node.leadingComments;
        delete node.trailingComments;
        delete node.innerComments;

        
        for (const key of Object.keys(node)) {
          const value = node[key];
          if (Array.isArray(value)) {
            value.forEach(stripComments);
          } else if (value && typeof value === 'object' && value.type) {
            stripComments(value);
          }
        }
      }
    }

    stripComments(ast);

    
    const output = generate(ast, {
      comments: false, 
      retainLines: true, 
      compact: false, 
    });

    
    
    let cleanedCode = output.code.trim();

    
    cleanedCode = cleanedCode.replace(/\r\n/g, '\n');

    
    cleanedCode = cleanedCode
      .split('\n')
      .map((line: string): string => line.replace(/\s+$/, ''))
      .join('\n');

    return cleanedCode;
  }
}
