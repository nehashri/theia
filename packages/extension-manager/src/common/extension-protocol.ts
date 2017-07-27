/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { JsonRpcServer } from "@theia/core";

export interface ExtensionIdentifier {
    readonly name: string
    readonly version: string;
}

export interface Extension extends ExtensionIdentifier {
    readonly description: string;
    readonly author: string;
    /**
     * Test whether the extension is installed.
     */
    readonly installed: boolean;
    /**
     * Test whether the extension should be updated.
     */
    readonly outdated: boolean;
}

export interface ResolvedExtension extends Extension {
    /**
     * The detailed description of the extension in HTML.
     */
    readonly documentation: string;
}

export const ExtensionServer = Symbol('ExtensionServer');
export interface ExtensionServer extends JsonRpcServer<ExtensionClient> {
    list(query?: string): Promise<Extension[]>;
    resolve(extension: ExtensionIdentifier): Promise<ResolvedExtension>;
    install(extension: ExtensionIdentifier): void;
    uninstall(extension: ExtensionIdentifier): void;
    update(extension: ExtensionIdentifier): void;
}

export const ExtensionClient = Symbol('ExtensionClient');
export interface ExtensionClient {
    onDidChange(): void;
    onWillBuild(): void;
    onDidBuild(): void;
}