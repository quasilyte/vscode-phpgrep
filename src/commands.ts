import * as vscode from 'vscode';
import * as phpgrep from './phpgrep';
import * as path from 'path';

// Used as the initial input value for the pattern prompt.
// Updated after every search pattern prompt.
var lastSearchPattern = '';
var triedToInstallPhpgrep = false;

function tryToInstallPhpgrep() {
    if (triedToInstallPhpgrep) {
        return;
    }
    triedToInstallPhpgrep = true;

    if (process.arch !== 'x64') {
        return;
    }

    let goos = process.platform.toString();
    if (goos === 'win32') {
        goos = 'windows';
    }

    if (['linux', 'darwin', 'windows'].includes(goos)) {
        vscode.window.showInformationMessage('Download phpgrep from https://github.com/quasilyte/phpgrep/releases?', 'Yes', 'No').then(selected => {
            if (selected !== 'Yes') {
                return;
            }
            const releasePage = `https://github.com/quasilyte/phpgrep/releases/download/v0.7.0/phpgrep-0.7.0-${goos}-amd64.zip`;
            vscode.env.openExternal(vscode.Uri.parse(releasePage));
        });
    }
}

async function runSearch(target: string) {
    let searchPattern = '';
    // Pattern source 1: cursor selection.
    // Performs a "find similar" search.
    if (vscode.window.activeTextEditor) {
        const ed = vscode.window.activeTextEditor;
        const selectionText = ed.document.getText(ed.selection);
        if (selectionText) {
            searchPattern = selectionText;
        }
    }
    // Pattern source 2: direct user input.
    if (!searchPattern) {
        const userInput = await vscode.window.showInputBox({
            value: lastSearchPattern,
            valueSelection: [lastSearchPattern.length, lastSearchPattern.length],
            password: false,
            prompt: "Search pattern"
        });
        if (userInput) {
            searchPattern = userInput;
            lastSearchPattern = userInput;
        }
    }
    if (!searchPattern) {
        return;
    }

    const cfg = vscode.workspace.getConfiguration('phpgrep');
    const phpgrepPath = cfg.get<string>('binary');
    if (!phpgrepPath) {
        vscode.window.showWarningMessage("Invalid or empty phpgrep.binary config value");
        return;
    }
    const multiline = !cfg.get<boolean>('singleline');
    let limit = cfg.get<number>('limit');
    if (limit === undefined) {
        limit = 100;
    }

    try {
        await phpgrep.runSearch({
            target: target,
            pattern: searchPattern,
            binary: phpgrepPath,
            multiline: multiline,
            limit: limit,
        });
    } catch (e) {
        console.error(e);
        if (e instanceof Error && e.message.includes('ENOENT')) {
            vscode.window.showErrorMessage(`${phpgrepPath} not found in PATH`);
            tryToInstallPhpgrep();
        }
    }
}

export async function searchFileCommand() {
    const currentPath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!currentPath) {
        vscode.window.showWarningMessage("Can't determine file path");
        return;
    }

    runSearch(currentPath);
}

export async function searchRelativeRecurCommand() {
    const currentPath = vscode.window.activeTextEditor?.document.uri.fsPath;
    if (!currentPath) {
        vscode.window.showWarningMessage("Can't determine current directory path");
        return;
    }

    runSearch(path.dirname(currentPath));
}

export async function searchRootRecurCommand() {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showWarningMessage("Can't run root search outside of the workspace");
        return;
    }
    const searchTarget = vscode.workspace.workspaceFolders[0];
    if (!searchTarget) {
        vscode.window.showWarningMessage("Can't determine search root folder");
        return;
    }

    runSearch(searchTarget.uri.fsPath);
}