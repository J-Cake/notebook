import _ from 'lodash';
import StateManager from "@j-cake/jcake-utils/state";
import IterSync from '@j-cake/jcake-utils/iterSync';
import {config} from './index.js';

export type Locale = Record<keyof typeof en_GB, string>;
const locale = (locale: Locale): Locale => locale;
export default locale;

export const en_GB = {
    notebook: "Notebook",
    open: "Open Notebook",
    new: "New Notebook",
    openToBegin: "Open a Notebook to begin",
    template: "Templating $0; into $1;"
};

export async function initLocales(): Promise<StateManager<Record<string, Locale>>> {
    return new StateManager<Record<string, Locale>>({
        en_GB,
        // en_US: await import("../locale/en_US.js").then(m => m.default),
        // de_DE: await import("../locale/de_DE.js").then(m => m.default),
    });
}

export function translate(str: TemplateStringsArray, ...templates: any[]): string {
    const search = IterSync(str.entries()).map(([a, i]) => `${i}$${a};`).collect().join('').toLowerCase().trim();
    const key: keyof Locale = _.chain(en_GB).entries().find((i, a) => search.startsWith(i[1].toLowerCase().trim())).first().value() as keyof Locale;

    if (!key)
        return str.map((i, a) => `${i}${templates[a].toString()}`).join('');

    const {locale: mgr, activeLocale} = config.get();
    const msg = mgr.get()[activeLocale][key];

    return msg.replace(/\$([^$]+);/g, (_, key) => templates[key]);
}