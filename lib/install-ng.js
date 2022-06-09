 
import fss, {promises as fs} from 'node:fs';
import cp from 'node:child_process';
import rl from 'node:readline';
import stream from 'node:stream';
import assert from 'node:assert';
import chalk from 'chalk';
import Iter, * as iter from '@j-cake/jcake-utils/iter';

const dirname = import.meta.url.match(/^\w+:\/\/(.+)\/[^\/]*$/)[1];

console.error(chalk.blue(`[Info]`), `Dir: ${dirname}`);

const getProps = (obj, ...props) => props.map(i => obj[i]);

const run = (cmd, options) => new Promise(ok => [
    console.error(chalk.blue(`[CMD]`), chalk.grey(' >'), cmd),
    stream.Readable.from(Iter([])
        .interleave(...getProps(cp.spawn('sh', ['-c', cmd], options).once('exit', code => ok(code)), 'stdout', 'stderr'))
        .filter(i => i)
        .map(i => i.toString('utf8'))
        .map(i => i.split('\n'))
        .flat()
        .map(i => `${chalk.blue('[CMD')}${chalk.grey('::')}${chalk.blue(']')}: ${i}\n`)).pipe(process.stdout)
]);



console.error(chalk.blue(`[Info]`), 'Installing NodeGUI into /lib/nodegui');

await run(`git clone https://github.com/nodegui/nodegui ${dirname}/nodegui`, { cwd: dirname });

await fs.mkdir(`${dirname}/nodegui/build/Release`, { recursive: true });
if (await fs.stat(`${dirname}/nodegui/build/Release/nodegui_core.node`).then(stat => !stat.isSymbolicLink()).catch(() => false))
    await fs.unlink(`${dirname}/nodegui/build/Release/nodegui_core.node`);
await fs.symlink(`${dirname}/nodegui_core.node`, `${dirname}/nodegui/build/Release/nodegui_core.node`);

const tsc = await run(`${process.env.npm_execpath} exec tsc`, { cwd: `${dirname}/nodegui` });
const install = await run(`${process.env.npm_execpath} install`, { cwd: `${dirname}/nodegui` });

const isFile = path => fs.stat(path).then(stat => stat.isFile()).catch(() => false);
if (!await isFile(`${dirname}/nodegui/dist/index.js`) || !await isFile(`${dirname}/nodegui/dist/index.d.ts`)) {
    console.error(chalk.red('[Install]'), `Error. Unmet dependency on ${chalk.grey('/lib/nodegui/dist/index.d.ts')} or ${chalk.grey('/lib/nodegui/dist/index.js')}.`);
    console.error(chalk.red('[Install]'), `You may need to build nodegui yourself.`);
    process.exit(-1);
}

if (tsc == 0 && install == 0)
    console.error(chalk.green('[Build]'), 'Success');
else
    console.error(chalk.yellow('[Build]'), 'Success with partial failures');

await fs.mkdir(`${dirname}/ng/dist`, { recursive: true });
const pkg = JSON.parse(await fs.readFile(`${dirname}/nodegui/package.json`, 'utf8'));
await fs.writeFile(`${dirname}/ng/package.json`, JSON.stringify({
    name: pkg.name,
    main: pkg.main,
    typings: pkg.typings,
    version: pkg.version,
    dependencies: pkg.dependencies
}, null, 4), 'utf8');

await run (`${process.env.npm_execpath} install`, { cwd: `${dirname}/ng` });

await run (`cp -rf ${dirname}/nodegui/dist/lib ${dirname}/nodegui/dist/index* ${dirname}/ng/dist`, { cwd: dirname });
await run (`cp -r ${dirname}/nodegui/build ${dirname}/ng`, { cwd: dirname });

console.error(chalk.green('[Install]'), 'Done');
