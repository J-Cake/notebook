import args, * as Format from '@j-cake/jcake-utils/args';

import { LogLevel } from './log.js';

export interface Args {
    logLevel: LogLevel,
    default: string
}

export default function parse(argv: string[]): Args {
    const def = Format.Path(false);
    return args({
        logLevel: {
            long: 'log-level',
            short: 'l',
            default: LogLevel.Info,
            format: (tok: string) => ({
                ['err']: LogLevel.Err,
                ['info']: LogLevel.Info,
                ['verbose']: LogLevel.Verbose,
                ['debug']: LogLevel.Debug
            } as const)[tok.toLowerCase().trim()] ?? LogLevel.Info
        }
    }, arg => arg && def(arg))(argv);
}
