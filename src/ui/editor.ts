import * as ng from '@nodegui/nodegui';
import { translate } from '../locale.js';

export default function editor(window: ng.QMainWindow): ng.QWidget {
    const widget = new ng.QWidget();
    const layout = new ng.QBoxLayout(ng.Direction.TopToBottom);
    widget.setLayout(layout);

    const openLabel = new ng.QLabel();
    openLabel.setText(`Open Notebook`);
    layout.addWidget(openLabel);
    openLabel.setText(translate`Open a Notebook to begin`);

    return widget;
}
