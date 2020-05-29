import * as vscode from 'vscode';
import * as phpgrep from './phpgrep';
import * as path from 'path';

// Used as the initial input value for the pattern prompt.
// Updated after every search pattern prompt.
var lastSearchPattern = '';

async function runSearch(target: string) {
    const searchPattern = await vscode.window.showInputBox({
        value: lastSearchPattern,
        valueSelection: [lastSearchPattern.length, lastSearchPattern.length],
        password: false,
        prompt: "Search pattern"
    });
    if (!searchPattern) {
        return;
    }
    lastSearchPattern = searchPattern;

    const cfg = vscode.workspace.getConfiguration('phpgrep');
    const phpgrepPath = cfg.get<string>('binary');
    if (!phpgrepPath) {
        vscode.window.showWarningMessage("Invalid or empty phpgrep.binary config value");
        return;
    }
    const multiline = !cfg.get<boolean>('singleline');

    try {
        await phpgrep.runSearch({
            target: target,
            pattern: searchPattern,
            binary: phpgrepPath,
            multiline: multiline,
        });
    } catch (e) {
        console.error(e);
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