import chalk from "chalk";
import { config } from "./index.js";
import { Locale, translate } from "./locale.js";

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
    process.stdout.write(translate(template, ...templates).replaceAll('\n', `\n${chalk.grey(`[${prettyTags[tag]}]`)} `));
}

export function err(template: TemplateStringsArray, ...templates: any[]): void {
    println(LogLevel.Err, template, ...templates);
}

export function info(template: TemplateStringsArray, ...templates: any[]): void {
    println(LogLevel.Info, template, ...templates);
}

export function verbose(template: TemplateStringsArray, ...templates: any[]): void {
    println(LogLevel.Verbose, template, ...templates);
}

export function debug(template: TemplateStringsArray, ...templates: any[]): void {
    println(LogLevel.Debug, template, ...templates);
}