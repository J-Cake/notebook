import * as Timers from 'node:timers/promises';

export default async function PromiseDupHandler(action?: () => void, delay?: number): Promise<() => void> {
    const next = class extends Error { name = "NextPromiseEvent" };

    let cancel: null | (() => void) = null;

    return () => void [cancel?.(), new Promise<void>(function (resolve, reject) {
        const timeout = setTimeout(() => void [action?.(), resolve()], delay);
        cancel = () => void [clearTimeout(timeout), reject(new next)]
    }).catch(err => {
        if (!(err instanceof next))
            throw err;
    })];
}