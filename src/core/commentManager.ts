import * as vscode from 'vscode';
import { JsCommentParser } from '../providers/jsCommentParser';
import { PyCommentParser } from '../providers/pyCommentParser';
import { HtmlCommentParser } from '../providers/htmlCommentParser';
import { CssCommentParser } from '../providers/cssCommentParser';
import { validateInput } from './security';

interface CommentParser {
  removeComments(code: string): string;
  removeSingleLineComments?(code: string): string;
  removeMultiLineComments?(code: string): string;
  removeAll?(code: string): string;
}

export class CommentManager {
  private parserMap = new Map<string, CommentParser>([
    // JavaScript family
    ['javascript', new JsCommentParser()],
    ['typescript', new JsCommentParser()],
    ['javascriptreact', new JsCommentParser()],
    ['typescriptreact', new JsCommentParser()],
    
    // Python
    ['python', new PyCommentParser()],
    
    // Web technologies
    ['html', new HtmlCommentParser()],
    ['xml', new HtmlCommentParser()],
    ['xhtml', new HtmlCommentParser()],
    
    // CSS family
    ['css', new CssCommentParser()],
    ['scss', new CssCommentParser()],
    ['sass', new CssCommentParser()],
    ['less', new CssCommentParser()],
    
    // Other C-style languages
    ['java', new JsCommentParser()],
    ['c', new JsCommentParser()],
    ['cpp', new JsCommentParser()],
    ['csharp', new JsCommentParser()],
    ['php', new JsCommentParser()],
    ['go', new JsCommentParser()],
    ['rust', new JsCommentParser()],
    ['swift', new JsCommentParser()],
    ['kotlin', new JsCommentParser()],
    ['scala', new JsCommentParser()]
  ]);

  public async removeComments(document: vscode.TextDocument, type: 'all' | 'single' | 'multi' = 'all'): Promise<string> {
    const languageId = document.languageId;
    const text = document.getText();
    
    // Security validation
    try {
      validateInput(text);
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      vscode.window.showErrorMessage(`Security validation failed: ${errorMessage}`);
      throw error;
    }

    // Get appropriate parser
    const parser = this.parserMap.get(languageId) || this.getFallbackParser(languageId);

    try {
      // Handle different removal types
      switch (type) {
        case 'all':
          if (parser.removeAll) {
            return parser.removeAll(text);
          }
          return this.removeAllComments(parser, text);
          
        case 'single':
          if (parser.removeSingleLineComments) {
            return parser.removeSingleLineComments(text);
          }
          return text; // No single-line removal available
          
        case 'multi':
          if (parser.removeMultiLineComments) {
            return parser.removeMultiLineComments(text);
          }
          return parser.removeComments(text);
          
        default:
          return parser.removeComments(text);
      }
    } catch (error) {
      console.error(`Error processing ${languageId} file:`, error);
      throw error;
    }
  }

  private removeAllComments(parser: CommentParser, text: string): string {
    let result = text;
    
    // Try single-line first
    if (parser.removeSingleLineComments) {
      result = parser.removeSingleLineComments(result);
    }
    
    // Then multi-line/regular comments
    result = parser.removeComments(result);
    
    return result;
  }

  private getFallbackParser(languageId: string): CommentParser {
    // Create a simple regex-based fallback parser
    return {
      removeComments: (code: string) => {
        // Try common comment patterns
        let result = code;
        
        // C-style comments
        result = result.replace(/\/\/.*$/gm, ''); // Single-line
        result = result.replace(/\/\*[\s\S]*?\*\//gm, ''); // Multi-line
        
        // Hash comments
        result = result.replace(/#.*$/gm, '');
        
        return result;
      },
      
      removeSingleLineComments: (code: string) => {
        return code.replace(/\/\/.*$/gm, '').replace(/#.*$/gm, '');
      },
      
      removeMultiLineComments: (code: string) => {
        return code.replace(/\/\*[\s\S]*?\*\//gm, '');
      }
    };
  }

  public getSupportedLanguages(): string[] {
    return Array.from(this.parserMap.keys()).sort();
  }

  public isLanguageSupported(languageId: string): boolean {
    return this.parserMap.has(languageId);
  }

  public getParserInfo(languageId: string): string {
    if (this.parserMap.has(languageId)) {
      const parser = this.parserMap.get(languageId);
      const features = [];
      
      if (parser?.removeComments) { features.push('basic'); }
      if (parser?.removeSingleLineComments) { features.push('single-line'); }
      if (parser?.removeMultiLineComments) { features.push('multi-line'); }
      if (parser?.removeAll) { features.push('comprehensive'); }
      
      return `Supported features: ${features.join(', ')}`;
    }
    
    return 'Using fallback parser with basic comment removal';
  }

  public async validateDocument(document: vscode.TextDocument): Promise<boolean> {
    try {
      validateInput(document.getText());
      return true;
    } catch (error) {
      console.error('Document validation failed:', error);
      return false;
    }
  }

  public dispose(): void {
    // Cleanup any resources if needed
    this.parserMap.clear();
  }
}
