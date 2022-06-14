import { promises as fs, constants, stat } from 'node:fs';
import os from 'node:os';
import * as ng from '@nodegui/nodegui';

import open from '../notebook.js'; ``
import config from '../state.js';
import * as ui from './util.js';

import pkg from '../../package.json';
import { translate } from '../locale.js';
import { getPageIndex } from './notebook/pages.js';

export async function NewNotebook() {
    const tmpPath = `${os.tmpdir()}/notebook-${Date.now()}.nbk`;
    const currentFile = import.meta.url.match(/^.+:\/\/(.+)(\/[^\/]*){2}$/)[1]; // find the directory that package.json is in
    await fs.copyFile(`${currentFile}/${pkg.resources['blank.nbk']}`, tmpPath, constants.COPYFILE_EXCL);
    open(tmpPath);
}

export async function OpenNotebook(): Promise<void> {
    const fileDialog = new ng.QFileDialog();
    fileDialog.setFileMode(ng.FileMode.AnyFile);
    fileDialog.setNameFilter('Notebooks (*.notebook *.nbk)');
    if (fileDialog.exec()) {
        if (await fs.stat(fileDialog.selectedFiles()[0]).then(stat => stat.isFile()))
            open(fileDialog.selectedFiles()[0]);
        else {
            const err = new ng.QMessageBox();
            err.setText(translate`The selected file is not a notebook.`)
            err.addButton(ui.button(translate`OK`, { role: ng.ButtonRole.AcceptRole }));
        }
    }
}

export function OpenPreferences() {

}

export default function mkMenuBar(): ng.QMenuBar {
    const menu = new ng.QMenuBar();
    const item = (title: string, handler: any) => {
        const action = new ng.QAction();
        action.setText(title);
        action.addEventListener('triggered', (event: any) => handler(event));
        return action;
    };

    const file = new ng.QMenu();
    file.setTitle(translate`File`);
    file.addAction(item(translate`New Notebook`, () => NewNotebook()));
    file.addAction(item(translate`Open Notebook`, () => OpenNotebook()));
    file.addAction(item(translate`Notebook Preferences`, () => OpenPreferences()));

    menu.addMenu(file);

    return menu;
}
