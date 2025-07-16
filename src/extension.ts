import * as vscode from 'vscode';
const syllable = require('syllable');

let decorationType = vscode.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 3em',
        textDecoration: 'none',
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
});

function updateDecorations(editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor) {
    if (!editor) {
        return;
    }

    const decorations: vscode.DecorationOptions[] = [];
    for (let i = 0; i < editor.document.lineCount; i++) {
        const line = editor.document.lineAt(i);
        if (line.isEmptyOrWhitespace || line.text.startsWith('#')) {
            continue;
        }

        const count = syllable(line.text);
        decorations.push({
            range: new vscode.Range(i, 1024, i, 1024),
            renderOptions: {
                after: {
                    contentText: `(${count})`,
                    color: new vscode.ThemeColor('editorCodeLens.foreground'),
                },
            },
        });
    }

    editor.setDecorations(decorationType, decorations);
}


export function activate(context: vscode.ExtensionContext) {
    console.log('Lyrical is now active!');

    let timeout: NodeJS.Timeout;

    const triggerUpdateDecorations = (editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => updateDecorations(editor), 500);
    };

    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            triggerUpdateDecorations(editor);
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            triggerUpdateDecorations(vscode.window.activeTextEditor);
        }
    }, null, context.subscriptions);

    if (vscode.window.activeTextEditor) {
        triggerUpdateDecorations(vscode.window.activeTextEditor);
    }

	const disposable = vscode.commands.registerCommand('lyrical.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Lyrical!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
    if (decorationType) {
        decorationType.dispose();
    }
}
