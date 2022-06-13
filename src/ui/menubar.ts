import cp from 'node:child_process';
import * as ng from '@nodegui/nodegui';

export function NewNotebook() {

}

export function OpenNotebook() {
    cp.spawn('bash', ['-c', 'kdialog --getopenfilename "Open notebook" application/json']);
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
