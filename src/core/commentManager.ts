import * as vscode from 'vscode';
import { JsCommentParser } from '../providers/jsCommentParser';
import { PyCommentParser } from '../providers/pyCommentParser';
import { validateInput } from '../core/security';

interface CommentParser {
  removeComments(code: string): string;
}

export class CommentManager {
  private parserMap = new Map<string, CommentParser>([
    ['javascript', new JsCommentParser()],
    ['typescript', new JsCommentParser()],
    ['python', new PyCommentParser()]
  ]);

  public async removeComments(document: vscode.TextDocument): Promise<string> {
    const languageId = document.languageId;
    const parser = this.parserMap.get(languageId) || this.getFallbackParser(languageId);

    validateInput(document.getText()); // Security check

    return parser.removeComments(document.getText());
  }

  private getFallbackParser(lang: string): CommentParser {
    // Implement generic parser or throw an error
    return {
      removeComments: (code: string) => code // No-op fallback
    };
  }
}
