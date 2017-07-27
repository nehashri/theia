/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */


import * as semver from 'semver';
import { AbstractAppGenerator, generatorTheiaPath, ExtensionPackage } from 'generator-theia/generators/common';
import { ExtensionServer, Extension, ExtensionIdentifier, ExtensionClient, ResolvedExtension } from '../common/extension-protocol';

export class NodeExtensionServer extends AbstractAppGenerator implements ExtensionServer {

    constructor(projectPath: string) {
        super([], {
            env: {
                cwd: projectPath
            },
            resolved: generatorTheiaPath
        });
        this.initializing();
        this.configuring();
    }

    list(query?: string | undefined): Promise<Extension[]> {
        return Promise.resolve(
            this.model.extensionPackages.map(pck =>
                this.toExtension(pck)
            )
        );
    }

    protected toExtension(pck: ExtensionPackage): Extension {
        return {
            name: pck.name,
            version: pck.version || '',
            description: pck.description || '',
            author: this.getAuthor(pck),
            installed: this.isInstalled(pck),
            outdated: this.isOutdated(pck)
        }
    }

    protected getAuthor(pck: ExtensionPackage): string {
        if (typeof pck.author === 'string') {
            return pck.author;
        }
        if (pck.author && pck.author.name) {
            return pck.author.name;
        }
        return '';
    }

    protected isInstalled(pck: ExtensionPackage): boolean {
        const targetDependencies = this.model.targetPck.dependencies;
        return !!targetDependencies && pck.name in targetDependencies;
    }

    protected isOutdated(pck: ExtensionPackage): boolean {
        if (!this.isInstalled(pck)) {
            return false;
        }
        const targetVersion = this.model.targetPck.dependencies![pck.name];
        const version = this.version(pck.name);
        return !!version && semver.gt(version, targetVersion);
    }

    resolve(extension: ExtensionIdentifier): Promise<ResolvedExtension> {
        return new Promise(() => { });
    }

    install(extension: ExtensionIdentifier): void {

    }

    uninstall(extension: ExtensionIdentifier): void {

    }

    update(extension: ExtensionIdentifier): void {

    }

    dispose(): void {

    }

    setClient(client: ExtensionClient | undefined): void {

    }

}