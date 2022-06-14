import * as ng from '@nodegui/nodegui'

import config from '../state.js';
import { translate } from '../locale.js';

export default function statusbar(): ng.QStatusBar {

    const statusBar = new ng.QStatusBar();

    config.onStateChange(function(prev) {
        statusBar.showMessage(translate`${prev.openNotebook}`);
    });

    return statusBar;

}