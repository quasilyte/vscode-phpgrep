import * as vscode from 'vscode';

var triedToInstallPhpgrep = false;

export function downloadPhpgrep() {
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