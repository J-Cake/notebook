import * as ng from 'nodegui';
import chalk from 'chalk';
import _ from 'lodash';

import parse from './config.js';
import ui from './ui.js';

export interface Config {
    default: string
}

export const config: Config = {} as any;

export default async function main(argv: string[]): Promise<number> {
    _.merge(config, parse(argv.slice(2)));

    const window = new ng.QMainWindow();

    ui(window);

    window.show();

    return 0;
}
