import * as ng from '@nodegui/nodegui';
import { ppid } from 'process';
import { config } from '../index.js';

import { translate } from '../locale.js';
import { OpenNotebook } from './menubar.js';
import * as ui from './util.js';

export function nothingOpen() {
    return ui.box([
        ui.button(translate`New Notebook`, { onTriggered: () => console.log('New') }),
        ui.button(translate`Open Notebook`, { onTriggered: () => OpenNotebook() }),
    ]);
}

export function notebook() {
    return ui.box([]);
}

export default function editor(window: ng.QMainWindow): ng.QWidget {
    const widget = new ng.QWidget();
    const layout = new ng.QBoxLayout(ng.Direction.TopToBottom);
    widget.setLayout(layout);

    const container = nothingOpen();
    layout.addWidget(container);

    config.onStateChange(function() {
        container.delete();

        layout.addWidget(notebook());
});

    return widget;
}
