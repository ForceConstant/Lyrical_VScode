import * as vscode from 'vscode';
import rhymes from 'rhymes';

let lyricalOutputChannel: vscode.OutputChannel;
lyricalOutputChannel = vscode.window.createOutputChannel('Lyrical');

let decorationType = vscode.window.createTextEditorDecorationType({
    after: {
        margin: '0 0 0 3em',
        textDecoration: 'none',
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
});

let syllableCountEnabled = false;

let syllable: (text: string) => number;

async function updateDecorations(editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor) {


    if (!syllable) {
        try {
            syllable = (await import('syllable')).syllable;
        } catch (err) {
            console.error('Failed to load syllable module', err);
            vscode.window.showErrorMessage('Lyrical: The "syllable" package could not be loaded. Syllable counting will be disabled.');
            syllableCountEnabled = false;
            return;
        }
    }

    if (!editor || !syllableCountEnabled) {
        // lyricalOutputChannel.appendLine('Lyrical: Syllable count decorations stopped - editor or feature disabled.');
        editor?.setDecorations(decorationType, []);
        return;
    }

    // Only show syllables for markdown files
    if (editor.document.languageId !== 'markdown' && !editor.document.fileName.endsWith('.lyrical.md')) {
        lyricalOutputChannel.appendLine(`Lyrical: File not applicable for syllable count: ${editor.document.fileName}`);
        editor.setDecorations(decorationType, []);
        return;
    }
    lyricalOutputChannel.appendLine(`Lyrical: File recognized for syllable count: ${editor.document.fileName}`);

    const decorations: vscode.DecorationOptions[] = [];
    for (let i = 0; i < editor.document.lineCount; i++) {
        const line = editor.document.lineAt(i);
        if (line.isEmptyOrWhitespace || line.text.startsWith('#')) {
            continue;
        }

        const count = syllable(line.text);
        lyricalOutputChannel.appendLine(`Lyrical: Line ${i + 1} syllable count: ${count}`);
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

    lyricalOutputChannel.appendLine('Lyrical: Applying syllable count decorations.');
    editor.setDecorations(decorationType, decorations);
}


export function activate(context: vscode.ExtensionContext) {

    lyricalOutputChannel.appendLine('Lyrical is now active!');

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

    const findRhymes = vscode.commands.registerCommand('lyrical.showRhymes', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            if (text) {
                const query = encodeURIComponent(text);
                // const url = `https://www.rhymezone.com/r/rhyme.cgi?Word=${query}&org1=syl&org2=l&org3=y&typeofrhyme=perfect`;
                const url = `https://www.rhymewave.com/index.php?s=${query}`;
                vscode.commands.executeCommand('simpleBrowser.show', vscode.Uri.parse(url), { viewColumn: vscode.ViewColumn.Beside });
            }
        }
    });

    context.subscriptions.push(findRhymes);

    const toggleSyllableCount = vscode.commands.registerCommand('lyrical.toggleSyllableCount', () => {
        // lyricalOutputChannel.appendLine('Lyrical: Toggle Syllable Count command executed.');
        syllableCountEnabled = !syllableCountEnabled;

        const status = syllableCountEnabled ? 'enabled' : 'disabled';
        vscode.window.showInformationMessage(`Syllable count ${status}`);

        // Update all visible editors
        vscode.window.visibleTextEditors.forEach(editor => {
            updateDecorations(editor);
        });
    });

    context.subscriptions.push(toggleSyllableCount);
}

export function deactivate() {
    if (decorationType) {
        decorationType.dispose();
    }
    if (lyricalOutputChannel) {
        lyricalOutputChannel.dispose();
    }
}
