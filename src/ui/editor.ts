import * as ng from '@nodegui/nodegui';

import { translate } from '../locale.js';

export default function editor(window: ng.QMainWindow): ng.QWidget {
    const widget = new ng.QWidget();

    const layout = new ng.QBoxLayout(ng.Direction.TopToBottom);
    
    const checkbox = new ng.QCheckBox();
    checkbox.setText(`hi`);

    layout.addWidget(checkbox);

    widget.setLayout(layout);
    
    return widget;
}
