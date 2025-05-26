import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'comment-remover.removeComments',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor');
                return;
            }

            const document = editor.document;
            const fullText = document.getText();
            
            // Basic JavaScript comment removal pattern
            const commentPattern = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
            const cleanedText = fullText.replace(commentPattern, '');
            
            await editor.edit(editBuilder => {
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(fullText.length)
                );
                editBuilder.replace(fullRange, cleanedText);
            });
        }
    );

    context.subscriptions.push(disposable);
}
