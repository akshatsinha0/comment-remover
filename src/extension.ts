import * as vscode from 'vscode';

interface CommentPattern {
    singleLine?: RegExp;
    multiLine?: RegExp;
    docString?: RegExp;
}

const languagePatterns: { [key: string]: CommentPattern } = {
    'javascript': {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//gm
    },
    'typescript': {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//gm
    },
    'python': {
        singleLine: /#.*$/gm,
        docString: /("""[\s\S]*?"""|'''[\s\S]*?''')/gm
    },
    'html': {
        multiLine: /<!--[\s\S]*?-->/gm
    },
    'css': {
        multiLine: /\/\*[\s\S]*?\*\//gm
    },
    'java': {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//gm
    },
    'c': {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//gm
    },
    'cpp': {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//gm
    },
    'csharp': {
        singleLine: /\/\/.*$/gm,
        multiLine: /\/\*[\s\S]*?\*\//gm
    },
    'php': {
        singleLine: /(\/\/.*$|#.*$)/gm,
        multiLine: /\/\*[\s\S]*?\*\//gm
    },
    'ruby': {
        singleLine: /#.*$/gm,
        multiLine: /=begin[\s\S]*?=end/gm
    },
    'shell': {
        singleLine: /#.*$/gm
    },
    'yaml': {
        singleLine: /#.*$/gm
    },
    'xml': {
        multiLine: /<!--[\s\S]*?-->/gm
    }
};

function getCommentPatterns(languageId: string): CommentPattern {
    return languagePatterns[languageId] || languagePatterns['javascript'];
}

function removeComments(text: string, patterns: CommentPattern, type: 'all' | 'single' | 'multi'): string {
    let result = text;
    
    if (type === 'all' || type === 'single') {
        if (patterns.singleLine) {
            result = result.replace(patterns.singleLine, '');
        }
    }
    
    if (type === 'all' || type === 'multi') {
        if (patterns.multiLine) {
            result = result.replace(patterns.multiLine, '');
        }
        if (patterns.docString) {
            result = result.replace(patterns.docString, '');
        }
    }
    
    return result;
}

async function executeCommentRemoval(type: 'all' | 'single' | 'multi') {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found');
        return;
    }

    const config = vscode.workspace.getConfiguration('commentRemover');
    const showConfirmation = config.get<boolean>('showConfirmationDialog', true);
    
    if (showConfirmation) {
        const typeLabel = type === 'all' ? 'all comments' : 
                         type === 'single' ? 'single-line comments' : 'multi-line comments';
        const result = await vscode.window.showWarningMessage(
            `Are you sure you want to remove ${typeLabel}? This action cannot be undone.`,
            'Yes', 'No'
        );
        if (result !== 'Yes') {
            return;
        }
    }

    const document = editor.document;
    const languageId = document.languageId;
    const patterns = getCommentPatterns(languageId);
    
    const originalText = document.getText();
    const cleanedText = removeComments(originalText, patterns, type);
    
    if (originalText === cleanedText) {
        vscode.window.showInformationMessage('No comments found to remove');
        return;
    }

    await editor.edit(editBuilder => {
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(originalText.length)
        );
        editBuilder.replace(fullRange, cleanedText);
    });

    const typeLabel = type === 'all' ? 'All comments' : 
                     type === 'single' ? 'Single-line comments' : 'Multi-line comments';
    vscode.window.showInformationMessage(`${typeLabel} removed successfully from ${languageId} file`);
}

export function activate(context: vscode.ExtensionContext) {
    // Register all commands
    const removeAllDisposable = vscode.commands.registerCommand(
        'comment-remover.removeAllComments',
        () => executeCommentRemoval('all')
    );

    const removeSingleDisposable = vscode.commands.registerCommand(
        'comment-remover.removeSingleLineComments',
        () => executeCommentRemoval('single')
    );

    const removeMultiDisposable = vscode.commands.registerCommand(
        'comment-remover.removeMultiLineComments',
        () => executeCommentRemoval('multi')
    );

    context.subscriptions.push(removeAllDisposable, removeSingleDisposable, removeMultiDisposable);
}

export function deactivate() {}
