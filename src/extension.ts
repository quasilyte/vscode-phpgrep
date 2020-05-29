import * as vscode from 'vscode';
import * as commands from './commands';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	const registerCommand = function(command: string, callback: (...args: any[]) => any) {
		context.subscriptions.push(vscode.commands.registerCommand(command, callback));
	};
	registerCommand('phpgrep.searchFile', commands.searchFileCommand);
	registerCommand('phpgrep.searchRootRecur', commands.searchRootRecurCommand);
	registerCommand('phpgrep.searchRelativeRecur', commands.searchRelativeRecurCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
