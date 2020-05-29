import * as vscode from 'vscode';
import child_process = require('child_process');

let outputChan = vscode.window.createOutputChannel('phpgrep');

export interface SearchOptions {
    // Directory to be traversed during the search.
    target: string;

    // phpgrep pattern to execute.
    pattern: string;

    // Limit results to this many matches.
    limit?: number;

    // phpgrep binary path.
    binary: string;

    // Whether -m mode is enabled.
    multiline: boolean;
}

export function runSearch(opts: SearchOptions): Promise<void> {
    return new Promise((resolve, reject) => {
        const phpgrepPath = opts.binary;

        // Run phpgrep process.
        const args = [
            '-limit', opts.limit ? `${opts.limit}` : '100',
        ];
        if (opts.multiline) {
            args.push('-m');
        }
        args.push(opts.target);
        args.push(opts.pattern);
        console.log(args);
        const phpgrep = child_process.spawn(phpgrepPath, args);

        outputChan.appendLine(`info: searching for ${opts.pattern} pattern...`);
        
        // Add phpgrep output to the channel.
        phpgrep.stderr.on('data', (data) => {
            outputChan.append(data.toString());
        });
        phpgrep.stdout.on('data', (data) => {
            outputChan.append(data.toString());
        });

        phpgrep.on('exit', (code) => {
            // Exit codes are taken from the phpgrep sources.
            if (code === 0) {
                outputChan.appendLine(`info: phpgrep finished with matches`);
            } else if (code === 1) {
                outputChan.appendLine(`info: phpgrep finished with no matches`);
            } else if (code === 2) {
                outputChan.appendLine(`info: phpgrep finished with error`);
            }
            outputChan.show();
            resolve();
        });

        phpgrep.on('error', (err) => {
            outputChan.appendLine(`error: ${err.message}`);
            outputChan.show();
            reject(err);
        });
    });
}