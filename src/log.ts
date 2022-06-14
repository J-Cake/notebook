import chalk from "chalk";

import { translate } from "./locale.js";
import config from "./state.js";

export enum LogLevel {
    Err,
    Info,
    Verbose,
    Debug
}

const prettyTags: Record<LogLevel, string> = {
    [LogLevel.Err]: chalk.red('err'),
    [LogLevel.Info]: chalk.blue('info'),
    [LogLevel.Verbose]: chalk.cyan('verbose'),
    [LogLevel.Debug]: chalk.yellow('debug')
};

export default function println(tag: LogLevel, template: TemplateStringsArray, ...templates: any[]): void {
    const logLevel = config.get().logLevel;
    if (tag > logLevel)
        return; 

    const msg = translate(template, ...templates).split('\n').map(i => `${chalk.grey(`[${prettyTags[tag]}]`)} ${i}`).join('\n');
    console.log(msg);
}

export const err = (template: TemplateStringsArray, ...templates: any[]) => println(LogLevel.Err, template, ...templates);
export const info = (template: TemplateStringsArray, ...templates: any[]) => println(LogLevel.Info, template, ...templates);
export const verbose = (template: TemplateStringsArray, ...templates: any[]) => println(LogLevel.Verbose, template, ...templates);
export const debug = (template: TemplateStringsArray, ...templates: any[]) => println(LogLevel.Debug, template, ...templates);0