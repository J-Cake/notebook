import * as timer from 'node:timers/promises';
import * as ng from '@nodegui/nodegui';
import _ from 'lodash';

import config from '../../state.js';
import * as ui from '../util.js';
import type { Page } from '../../notebook.js';
import * as log from '../../log.js';
import PromiseDupHandler from '../../dedup.js';

export function toolbar(): ng.QWidget {
    return ui.box([]);
}

export async function save(textEdit: ng.QTextEdit): Promise<void> {
    log.verbose`Saving`;
    console.log('Saving');
    const text = textEdit.toPlainText();

    const paragraphs = text.split(/\n{2,}/g);

    const { notebook, activePage, activeTab } = await config.get();

    // @ts-ignore // assertion is too deep and possibly infinite - blah blah blah just fuckin do it
    await notebook.set(['tabs', activeTab, activePage, paragraphs] as never, paragraphs.map(i => ({
        style: 'Paragraph',
        text: [i]
    })) as any);
}

export async function textEdit(): Promise<ng.QTextEdit> {
    const textEdit = new ng.QTextEdit();
    textEdit.setAcceptRichText(false);
    textEdit.setTabChangesFocus(false);

    const { notebook, activePage, activeTab, getStyle } = await config.get();
    if (!activePage || !activeTab)
        return textEdit;

    // @ts-ignore
    const page: Page = await notebook.getAll(['tabs', activeTab, activePage] as never) as any;

    for (const paragraph of _.values(page.paragraphs))
        for (const i of _.values(paragraph.text))
            if (typeof i == 'string')
                textEdit.append(i);

    const writeHandler = await PromiseDupHandler(() => save(textEdit), 200);
    textEdit.addEventListener('textChanged', () => writeHandler());

    return textEdit;
}

export default async function Page(tab: string, page: string): Promise<ng.QWidget> {
    const container = new ng.QWidget();
    const layout = new ng.QBoxLayout(ng.Direction.TopToBottom);
    container.setLayout(layout);

    let editor = await textEdit();
    layout.addWidget(editor);

    config.on('change-page', async function ({ activeTab, activePage }) {
        const editor2 = await textEdit();

        if (editor) {
            editor.close();
            editor.delete();
        }

        editor = editor2;

        layout.addWidget(editor);
    });

    return container;
}