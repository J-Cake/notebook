import * as ng from '@nodegui/nodegui';
import config from '../../state.js';

import * as ui from '../util.js';

export function toolbar(): ng.QWidget {
    return ui.box([]);
}

export function textEdit(): ng.QTextEdit {
    const textEdit = new ng.QTextEdit();
    textEdit.setAcceptRichText(true);
    textEdit.setTabChangesFocus(false);

    textEdit.setText('Hello');

    return textEdit;
}

export default async function Page(tab: string, page: string): Promise<ng.QWidget> {
    const container = new ng.QWidget();
    const layout = new ng.QBoxLayout(ng.Direction.TopToBottom);
    container.setLayout(layout);

    let editor = textEdit();
    layout.addWidget(editor);

    config.on('change-page', function({ activeTab, activePage }) {
        editor.close();
        editor.delete();
        
        editor = textEdit();
        layout.addWidget(editor);
    });

    return container;
}