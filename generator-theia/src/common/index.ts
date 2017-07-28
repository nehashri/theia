/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as path from 'path';
export const generatorTheiaPath = path.resolve(__dirname, '..', '..');
export * from './generator-model';
export * from './abstract-generator';
export * from './app-package-generator';
export * from './abstract-frontend-generator';
export * from './abstract-backend-generator';
export * from './abstract-app-generator';