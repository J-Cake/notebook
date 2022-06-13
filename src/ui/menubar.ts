import * as ng from '@nodegui/nodegui';

import open from '../notebook.js';``
import { config } from '../index.js';

export function NewNotebook() {

}

export async function OpenNotebook(): Promise<void> {
    const fileDialog = new ng.QFileDialog();
    fileDialog.setFileMode(ng.FileMode.AnyFile);
    fileDialog.setNameFilter('Notebooks (*.notebook *.nbk)');
    fileDialog.exec();

    config.setState({
        openNotebook: fileDialog.selectedFiles()[0],
        notebook: await open(fileDialog.selectedFiles()[0])
    });
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
    file.setTitle("File");
    file.addAction(item('New Notebook', () => NewNotebook()));
    file.addAction(item('Open Notebook', () => OpenNotebook()));

    menu.addMenu(file);

    return menu;
}
