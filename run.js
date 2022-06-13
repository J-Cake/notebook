import chalk from 'chalk';
import app from '$app';

await app(process.argv)
    .catch(err => console.error(`${chalk.grey(`[${chalk.red('err')}]: `)}`, err));