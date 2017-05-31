/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { interfaces, Container } from 'inversify';
import { ITree, ITreeModel, TreeProps, defaultTreeProps } from "./tree";
import { createFileTreeContainer, FileTree, FileTreeModel, FileTreeWidget } from "./file-tree";
import { FileNavigatorTree } from "./navigator-tree";
import { FileNavigatorModel } from "./navigator-model";
import { FileNavigatorWidget } from "./navigator-widget";
import { NAVIGATOR_CONTEXT_MENU } from "./navigator-menu";

export const FILE_NAVIGATOR_PROPS = <TreeProps>{
    ...defaultTreeProps,
    contextMenuPath: NAVIGATOR_CONTEXT_MENU
}

export function createFileNavigatorContainer(parent: interfaces.Container): Container {
    const child = createFileTreeContainer(parent);
    child.parent = parent;

    child.unbind(FileTree);
    child.bind(FileNavigatorTree).toSelf();
    child.rebind(ITree).toDynamicValue(ctx => ctx.container.get(FileNavigatorTree));

    child.unbind(FileTreeModel);
    child.bind(FileNavigatorModel).toSelf();
    child.rebind(ITreeModel).toDynamicValue(ctx => ctx.container.get(FileNavigatorModel));

    child.unbind(FileTreeWidget);
    child.bind(FileNavigatorWidget).toSelf();

    child.rebind(TreeProps).toConstantValue(FILE_NAVIGATOR_PROPS);

    return child;
}