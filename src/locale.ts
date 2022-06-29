import _ from 'lodash';
import StateManager from "@j-cake/jcake-utils/state";
import IterSync from '@j-cake/jcake-utils/iterSync';

import config from './state.js';

export type Locale = Record<keyof typeof en_GB, string>;
const locale = (locale: Locale): Locale => locale;
export default locale;

export const en_GB = {
    file: "File",
    edit: "Edit",
    notebook: "Notebook",
    reopen: "Reopen Last",
    open: "Open Notebook",
    new: "New Notebook",
    openToBegin: "Open a Notebook to begin",
    template: "Templating $0; into $1;",
    path: "$0;",
    ok: "Ok",
    cancel: "Cancel",
    preferences: "Notebook Preferences",
    notANotebook: "The selected file is not a notebook",
    opening: "Opening $0;",
    usingLocale: "Using locale $0;",
    pages: "Pages",
    styles: "Styles",
    openFailed: "Opening Failed: $0;",
    activePageMalformed: "Active page is not a notebook page",
    pageSwitch: 'Switching to page $0;, $1;',
    newPage: 'New Page',
    newTab: 'New Tab',
    saving: 'Saving'
};

export async function initLocales(): Promise<StateManager<Record<string, Locale>>> {
    return new StateManager<Record<string, Locale>>({
        en_GB,
        en_US: await import("../locale/en_US.js").then(m => m.default),
        de_DE: await import("../locale/de_DE.js").then(m => m.default),
    });
}

export function translate(str: TemplateStringsArray, ...templates: any[]): string {
    const search = IterSync(str.entries()).map(([a, i]) => `${i}$${a};`).collect().join('').toLowerCase().trim();
    const key: keyof Locale = _.chain(en_GB).entries().filter((i, a) => search.startsWith(i[1].toLowerCase().trim())).map(i => i[0]).reduce((a, i) => a.length > i.length ? a : i).value() as keyof Locale;
    const { locale: mgr, activeLocale } = config.get();

    if (!key || !mgr?.get()?.[activeLocale]?.[key])
        return str.map((i, a) => `${i}${templates[a].toString()}`).join('');

    const msg = mgr.get()[activeLocale][key];

    return msg.replace(/\$([^$]+);/g, (_, key) => templates[key]);
}