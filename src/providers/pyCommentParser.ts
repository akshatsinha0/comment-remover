import * as vscode from 'vscode';
import { Telemetry } from '../core/telemetry';
import { safeReplace } from '../core/security';

export class PyCommentParser {
    private telemetry = new Telemetry();
    private pattern = RegExp(
        String.raw`(#.*?$)` +                          // Single-line comments
        String.raw`|("""(?:[^"\\]|\\.)*?"""|'''(?:[^'\\]|\\.)*?''')` +  // Docstrings
        String.raw`|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')`,             // Other strings
        'gm'
    );

    public removeComments(content: string): string {
        try {
            // Remove single-line comments using a string replacement
            return safeReplace(
                content,
                this.pattern,
                ''
            );
        } catch (error) {
            this.telemetry.logError(error as Error);
            return content; // Fallback to original content
        }
    }

    public removeDocstrings(content: string): string {
        const docstringPattern = RegExp(
            String.raw`(?:^[ \t]*)` +                   // Indentation
            String.raw`(?:(?:r|u|f|rf|fr|b|rb|br)?)` +  // String prefixes
            String.raw`("""(?:[^"\\]|\\.)*?"""|'''(?:[^'\\]|\\.)*?''')`,
            'gm'
        );

        return safeReplace(content, docstringPattern, '');
    }

    public removeAll(content: string): string {
        return this.removeDocstrings(this.removeComments(content));
    }
}
