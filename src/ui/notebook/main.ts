import * as ng from '@nodegui/nodegui';
import type DB from '@j-cake/jcake-utils/db';

import * as ui from '../util.js';
import config from '../../state.js';
import { translate } from '../../locale.js';
import { NewNotebook, OpenNotebook } from '../menubar.js';
import Page from './editor.js';
import PageList from './pages.js';
import * as log from '../../log.js';

export function nothingOpen() {
    return ui.box([
        ui.button(translate`New Notebook`, { onTriggered: () => NewNotebook() }),
        ui.button(translate`Open Notebook`, { onTriggered: () => OpenNotebook() }),
    ]);
}

export default async function editor(window: ng.QMainWindow): Promise<ng.QWidget<ng.QWidgetSignals>> {
    const widget = new ng.QWidget();
    const layout = new ng.QBoxLayout(ng.Direction.LeftToRight);
    widget.setLayout(layout);
    layout.setSpacing(0);

    let container = nothingOpen();
    layout.addWidget(container);

    config.on('open-notebook', async function ({ activeTab, activePage }) {
        container.delete();
        container = ui.splitter(await PageList(), await Page(activeTab, activePage), { orientation: ng.Orientation.Horizontal });
        layout.addWidget(container);
    });

    if (config.get().openNotebook) {
        const notebook = config.get().notebook as DB<any>;

        // @ts-ignore
        const pages: string[] = await notebook.keys_flat(['tabs'] as never);
        const page = pages.find(i => i.split('.').length == 4).split('.');

        config.dispatch('change-page', { activeTab: page[1], activePage: page[2] });
    }

    return widget;
}
