/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { inject, injectable } from "inversify";
import { Event, Emitter, Disposable, DisposableCollection } from "@theia/core";
import { Extension, ExtensionServer, ResolvedExtension } from './extension-protocol';

export {
    Extension, ResolvedExtension
};

@injectable()
export class ExtensionManager implements Disposable {

    protected readonly onChangedEmitter = new Emitter<void>();
    protected readonly onWillBuildEmitter = new Emitter<void>();
    protected readonly onDidBuildEmitter = new Emitter<void>();
    protected readonly toDispose = new DisposableCollection();

    constructor(
        @inject(ExtensionServer) protected readonly server: ExtensionServer
    ) {
        this.toDispose.push(server);
        this.toDispose.push(this.onChangedEmitter);
        this.toDispose.push(this.onWillBuildEmitter);
        this.toDispose.push(this.onDidBuildEmitter);
        this.server.setClient({
            onDidChange: () => this.fireDidChange(),
            onWillBuild: () => this.fireWillBuild(),
            onDidBuild: () => this.fireDidBuild(),
        });
    }

    dispose() {
        this.toDispose.dispose();
    }

    /**
     * Notify when installed extensions changed.
     */
    get onDidChange(): Event<void> {
        return this.onChangedEmitter.event;
    }

    protected fireDidChange(): void {
        this.onChangedEmitter.fire(undefined);
    }

    /**
     * Notify when the build is going to start.
     */
    get onWillBuild(): Event<void> {
        return this.onWillBuildEmitter.event;
    }

    protected fireWillBuild(): void {
        this.onWillBuildEmitter.fire(undefined);
    }

    /**
     * Notify when the build is finished.
     */
    get onDidBuild(): Event<void> {
        return this.onDidBuildEmitter.event;
    }

    protected fireDidBuild(): void {
        this.onDidBuildEmitter.fire(undefined);
    }

    /**
     * List installed extensions if the given query is undefined or empty.
     * Otherwise list extensions matching to the given query taking into account installed extensions.
     */
    list(query?: string): Promise<Extension[]> {
        return this.server.list(query);
    }

    /**
     * Resolve the detailed information for the given extension.
     */
    resolve(extension: Extension): Promise<ResolvedExtension> {
        const { name, version } = extension;
        return this.server.resolve({
            name, version
        });
    }

    /**
     * Intall the given extension.
     */
    install(extension: Extension): void {
        const { name, version } = extension;
        this.server.install({
            name, version
        });
    }

    /**
     * Uninstall the given extension.
     */
    uninstall(extension: Extension): void {
        const { name, version } = extension;
        this.server.install({
            name, version
        });
    }

    /**
     * Update the given extension.
     */
    update(extension: Extension): void {
        const { name, version } = extension;
        this.server.update({
            name, version
        });
    }

}