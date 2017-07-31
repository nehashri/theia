import * as url from 'url';
import { inject, injectable } from "inversify";
import { BaseLanguageServerContribution, IConnection } from "@theia/languages/lib/node";
import { GAUGE_LANGUAGE_ID, GAUGE_LANGUAGE_NAME } from '../common';
import { WorkspaceServer } from "@theia/workspace/lib/common";
import * as fs from "fs";

@injectable()
export class GaugeContribution extends BaseLanguageServerContribution {

    readonly id = GAUGE_LANGUAGE_ID;
    readonly name = GAUGE_LANGUAGE_NAME;

    constructor(
        @inject(WorkspaceServer) protected readonly workspaceServer: WorkspaceServer
    ) {
        super()
    }

    start(clientConnection: IConnection): void {
        const command = 'gauge';
        this.workspaceServer.getRoot().then(workspacePath => {
            const wPath = url.parse(workspacePath).path
            if (typeof wPath !== 'undefined' && fs.readdirSync(wPath).find(x => x === 'manifest.json')) {
                const args: string[] = [
                    "daemon",
                    "--lsp",
                    "--dir=" + wPath
                ];
                const serverConnection = this.createProcessStreamConnection(command, args);
                this.forward(clientConnection, serverConnection);
            }
        });
    }

    protected onDidFailSpawnProcess(error: Error): void {
        super.onDidFailSpawnProcess(error);
        console.error("Error starting gauge language server.");
        console.error("Please make sure it is installed on your system.");
    }
}
