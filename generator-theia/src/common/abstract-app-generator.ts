/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as npm from 'npm';
import BaseGenerator = require('yeoman-generator');

import { Model } from "./generator-model";
import { AppPackageGenerator } from "./app-package-generator";

export abstract class AbstractAppGenerator extends BaseGenerator {

    protected readonly model = new Model();
    protected readonly pck = new AppPackageGenerator(this.model);

    initializing(): void {
        this.model.targetPck = this.fs.readJSON(this.destinationPath('package.json'), {});
        this.model.pck = this.fs.readJSON(this.destinationPath('theia.package.json'), {});
        this.config.defaults(this.model.config);
        Object.assign(this.model.config, this.config.getAll());
    }

    configuring(): Promise<void> {
        this.config.save();
        return this.model.readExtensionPackages({
            read: (extension, version) =>
                this.view(`${extension}@${version}`).then(result =>
                    result[version]
                )
            ,
            readLocal: (extension, path) => {
                for (const packagePath of ['package.json', 'extension.package.json']) {
                    const extensionPackagePath = this.destinationPath(path, packagePath);
                    if (this.fs.exists(extensionPackagePath)) {
                        return this.fs.readJSON(extensionPackagePath, undefined);
                    }
                }
                return undefined;
            }
        });
    }

    protected version(pck: string): Promise<string | undefined> {
        return this.view(pck + '@latest').then(result => {
            const versions = Object.keys(result);
            return versions.length > 0 ? versions[0] : undefined;
        });
    }

    protected view(pck: string, ...args: string[]): Promise<{ [version: string]: any | undefined }> {
        return new Promise(resolve =>
            npm.load(err => {
                if (err) {
                    console.error(err);
                    resolve({});
                } else {
                    npm.commands.view([pck, ...args], (err, result) => {
                        if (err) {
                            console.error(err);
                        }
                        resolve(result || {});
                    });
                }
            })
        );
    }

    writing(): void {
        this.pck.generate(this.fs);
    }

}