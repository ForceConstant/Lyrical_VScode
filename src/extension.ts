import * as vscode from 'vscode';
const syllable = require('syllable');
const rhymes = require('rhymes');

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

	const findRhymes = vscode.commands.registerCommand('lyrical.showRhymes', () => {
	       const editor = vscode.window.activeTextEditor;
	       if (editor) {
	           const selection = editor.selection;
	           const text = editor.document.getText(selection);
	           if (text) {
	               const rhymeResults = rhymes(text);
	               const panel = vscode.window.createWebviewPanel(
	                   'rhymeResults',
	                   `Rhymes for ${text}`,
	                   vscode.ViewColumn.Two,
	                   {}
	               );

	               const oneSyllableRhymes = rhymeResults.filter((r: any) => r.syllables === '1');
	               const twoSyllableRhymes = rhymeResults.filter((r: any) => r.syllables === '2');
	               const threeSyllableRhymes = rhymeResults.filter((r: any) => r.syllables === '3');

	               panel.webview.html = `
	                   <h1>Rhymes for "${text}"</h1>
	                   <h2>1 Syllable</h2>
	                   <ul>
	                       ${oneSyllableRhymes.map((r: any) => `<li>${r.word}</li>`).join('')}
	                   </ul>
	                   <h2>2 Syllables</h2>
	                   <ul>
	                       ${twoSyllableRhymes.map((r: any) => `<li>${r.word}</li>`).join('')}
	                   </ul>
	                   <h2>3 Syllables</h2>
	                   <ul>
	                       ${threeSyllableRhymes.map((r: any) => `<li>${r.word}</li>`).join('')}
	                   </ul>
	               `;
	           }
	       }
	   });

	   context.subscriptions.push(findRhymes);
}

export function deactivate() {
    if (decorationType) {
        decorationType.dispose();
    }
}
