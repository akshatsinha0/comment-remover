import { Telemetry } from '../core/telemetry';
import { safeReplace } from '../core/security';

export class CssCommentParser {
    private telemetry = new Telemetry();

    public removeComments(content: string): string {
        try {
            // CSS comment pattern: /* anything */
            // Handles nested asterisks properly
            const cssCommentPattern = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
            
            return safeReplace(content, cssCommentPattern, '');
        } catch (error) {
            this.telemetry.logError(error as Error);
            return content;
        }
    }

    public removeSingleLineComments(content: string): string {
        // Some CSS preprocessors support // comments
        const singleLinePattern = /\/\/.*$/gm;
        return safeReplace(content, singleLinePattern, '');
    }

    public removeAll(content: string): string {
        return this.removeSingleLineComments(this.removeComments(content));
    }
}
