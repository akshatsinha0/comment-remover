import { parse } from '@babel/parser';
import { Telemetry } from '../core/telemetry';
const generate = require('@babel/generator').default;

export class JsCommentParser {
  private telemetry = new Telemetry();

  public removeComments(code: string): string {
    try {
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript'],
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
