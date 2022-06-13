import StateManager from '@j-cake/jcake-utils/state';
import * as ng from '@nodegui/nodegui';
import _ from 'lodash';

import parse from './config.js';
// import { initLocales, Locale, translate } from './locale.js';
import { LogLevel } from './log.js';
import { editor, menubar } from './ui/index.js';

export interface Config {
    // locale: StateManager<Record<string, Locale>>,
    activeLocale: string,
    logLevel: LogLevel,
}

export const config: StateManager<Config> = new StateManager({
    // activeLocale: 'de_DE',
    // activeLocale: 'en_GB',
    // locale: await initLocales()
} as Config);

export default async function main(argv: string[]): Promise<number> {
    _.merge(config, parse(argv.slice(2)));

    // @ts-expect-error
    const window = global.win = new ng.QMainWindow();

    // process.title = translate`Notebook`;
    // window.setWindowTitle(translate`Notebook`);

    window.setCentralWidget(editor(window));
    window.setMinimumSize(520, 640);
    window.setMenuBar(menubar());

    window.show();

    return 0;
}
