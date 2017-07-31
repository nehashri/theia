import {ContainerModule} from "inversify";
import {LanguageClientContribution} from "@theia/languages/lib/browser";
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import {GaugeClientContribution} from "./gauge-client-contribution";
import {SpecFrontendContribution} from "./spec-frontend-contribution";

import "./monaco-contribution";

export default new ContainerModule(bind => {
    bind(GaugeClientContribution).toSelf().inSingletonScope();
    bind(LanguageClientContribution).toDynamicValue(ctx => ctx.container.get(GaugeClientContribution));
    bind(SpecFrontendContribution).toSelf().inSingletonScope();
    for (const identifier of [CommandContribution, MenuContribution]) {
        bind(identifier).toDynamicValue(ctx =>
            ctx.container.get(SpecFrontendContribution)
        ).inSingletonScope();
    }
});