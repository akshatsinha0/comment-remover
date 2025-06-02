import { Telemetry } from '../core/telemetry';
import { safeReplace } from '../core/security';

export class HtmlCommentParser {
    private telemetry = new Telemetry();

    public removeComments(content: string): string {
        try {
            // HTML comment pattern: <!-- anything -->
            // Handles multi-line comments and edge cases
            const htmlCommentPattern = /<!--(?!-?>)(?!.*--!>)(?!.*<!--(?!>)).*?(?<!<!-)-->/gs;
            
            return safeReplace(content, htmlCommentPattern, '');
        } catch (error) {
            this.telemetry.logError(error as Error);
            return content;
        }
    }

    public removeConditionalComments(content: string): string {
        // Removes IE conditional comments like <!--[if IE]>...<![endif]-->
        const conditionalPattern = /<!--\[if[^>]*\]>[\s\S]*?<!\[endif\]-->/gi;
        return safeReplace(content, conditionalPattern, '');
    }

    public removeAll(content: string): string {
        return this.removeConditionalComments(this.removeComments(content));
    }
}
