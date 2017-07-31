import { GAUGE_LANGUAGE_ID } from '../../common';
import { monarchLanguage } from "./gauge-monaco-language";

monaco.languages.register({
    id: GAUGE_LANGUAGE_ID,
    aliases: ['Gauge', 'gauge'],
    extensions: ['.spec', '.cpt', '.md'],
});

monaco.languages.onLanguage(GAUGE_LANGUAGE_ID, () => {
    monaco.languages.setMonarchTokensProvider(GAUGE_LANGUAGE_ID, monarchLanguage);
});