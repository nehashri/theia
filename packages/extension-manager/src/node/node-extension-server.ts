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

    protected readonly ready: Promise<void>;

    constructor(projectPath: string) {
        super([], {
            env: {
                cwd: projectPath
            },
            resolved: generatorTheiaPath
        });
        this.initializing();
        this.ready = this.configuring();
    }

    async list(query?: string | undefined): Promise<Extension[]> {
        await this.ready;
        const extensions = [];
        for (const pck of this.model.extensionPackages) {
            const extension = await this.toExtension(pck);
            extensions.push(extension);
        }
        return extensions;
    }

    protected async toExtension(pck: ExtensionPackage): Promise<Extension> {
        return {
            name: pck.name,
            version: pck.version || '',
            description: pck.description || '',
            author: this.getAuthor(pck),
            installed: this.isInstalled(pck),
            outdated: await this.isOutdated(pck)
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

    protected async isOutdated(pck: ExtensionPackage): Promise<boolean> {
        if (!this.isInstalled(pck)) {
            return false;
        }
        const targetVersion = this.model.targetPck.dependencies![pck.name];
        const version = await this.version(pck.name);
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