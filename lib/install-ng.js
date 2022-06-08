 
import fss, {promises as fs} from 'node:fs';
import cp from 'node:child_process';
import rl from 'node:readline';
import stream from 'node:stream';
import chalk from 'chalk';
import Iter, * as iter from '@j-cake/jcake-utils/iter';

const dirname = import.meta.url.match(/^\w+:\/\/(.+)\/[^\/]*$/)[1];

console.log(dirname);

const getProps = (obj, ...props) => props.map(i => obj[i]);
const run = (cmd, options) => new Promise(ok => stream.Readable.from([
    console.log(`> ${cmd}`),
    iter.interleave(...getProps(cp.spawn('sh', ['-s', cmd], options).once('exit', code => ok(code)), 'stdout', 'stderr'))
][1]).pipe(process.stdout));

console.error(chalk.blue(`[Info]`), 'Installing NodeGUI into /lib/nodegui');

await run(`git clone https://github.com/nodegui/nodegui ${dirname}/nodegui`, { cwd: dirname });
await run(`${process.env.npm_execpath} exec tsc`, { cwd: `${dirname}/nodegui` });
