import * as ng from '@nodegui/nodegui';
import chalk from 'chalk';
import _ from 'lodash';

import config from './state.js';

import parse from './config.js';
import { translate, initLocales } from './locale.js';
import { editor, menubar, statusbar } from './ui/index.js';
import open from './notebook.js';
import * as log from './log.js';
import { getPageIndex } from './ui/notebook/pages.js';

export default async function main(argv: string[]): Promise<number> {
    const args = parse(argv.slice(2));

    const state = config.setState({
        locale: await initLocales(),
        logLevel: args.logLevel,
    });

    log.verbose`Using locale ${chalk.grey(state.activeLocale)}`;

    const window = global.win = new ng.QMainWindow();

    process.title = translate`Notebook`;
    window.setWindowTitle(translate`Notebook`);

    window.setCentralWidget(await editor(window));
    window.setMinimumSize(520, 640);
    window.setMenuBar(menubar());

    try {
        if (args.default) {
            log.info`Opening ${chalk.yellow(args.default)}`;
            await open(args.default);
        } else
            log.info`No notebook specified.`;
    } catch (err) {
        log.err`Opening Failed: ${chalk.red(err instanceof Error ? err.stack : err.toString())}`
    }

    window.setStatusBar(statusbar() as ng.QStatusBar);

    window.show();

    await new Promise<void>(ok => window.addEventListener(ng.WidgetEventTypes.Close, () => ok()));

    console.log('Good bye');

    return 0;
}
