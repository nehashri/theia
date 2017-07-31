import { ContainerModule } from "inversify";
import { LanguageServerContribution } from "@theia/languages/lib/node";
import { GaugeContribution } from './gauge-contribution';

export default new ContainerModule(bind => {
    bind(LanguageServerContribution).to(GaugeContribution).inSingletonScope();
});