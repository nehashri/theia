/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { AbstractAppGenerator } from "../common";
import { ElectronBackendGenerator } from "./electron-backend-generator";
import { ElectronFrontendGenerator } from "./electron-frontend-generator";

export class TheiaElectronGenerator extends AbstractAppGenerator {

    protected readonly backend = new ElectronBackendGenerator(this.model);
    protected readonly frontend = new ElectronFrontendGenerator(this.model);

    initializing(): void {
        this.model.target = 'electron-renderer';
        super.initializing();
    }

    configuring(): Promise<void> {
        return super.configuring();
    }

    writing(): void {
        super.writing();
        this.backend.generate(this.fs);
        this.frontend.generate(this.fs);
    }

}