import StateManager from "@j-cake/jcake-utils/state";
import type DB from "@j-cake/jcake-utils/db";

import type { Locale } from "./locale.js";
import { LogLevel } from "./log.js";
import { Style } from "./notebook.js";

export interface Config {
    locale: StateManager<Record<string, Locale>>,
    activeLocale: string,
    logLevel: LogLevel,
    openNotebook: string,
    notebook: DB<any>,
    activeTab: string,
    activePage: string,
    pageIndex: Record<string, Record<string, string>>,
    styles: Record<string, Partial<Style> & { name: string }>,
    getStyle: (name: string) => Promise<Style>,
}

const config: StateManager<Config> = new StateManager({
    activeLocale: 'en_GB',
    logLevel: LogLevel.Info,
} as Config);

export default config;