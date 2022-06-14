import _ from 'lodash';
import * as ng from '@nodegui/nodegui';
import * as iterSync from '@j-cake/jcake-utils/iterSync';

import { translate } from '../../locale.js';
import config from '../../state.js';

import * as ui from '../util.js';

export async function getPageIndex(DB?: import('@j-cake/jcake-utils/db').default<any>): Promise<Record<string, Record<string, string>>> {
    const db = DB ?? config.get().notebook as import('@j-cake/jcake-utils/db').default<any>;

    // @ts-ignore
    const keys = await db.keys_flat(['tabs'] as never)
        .filter(i => i.split('.').length == 4 && i.startsWith('tabs.') && i.endsWith('.title'));

    const pages: Record<string, Record<string, string>> = {};

    for (const [, tab, page] of keys.map(i => i.split('.')))
        (pages[tab] = pages[tab] ?? {})[page] = await db.getAll(['tabs', tab, page, 'title']);

    pages['tab2'] = {
        page1: 'hello world',
        page2: 'Hi',
        page3: 'Bye'
    }

    return pages;
}

export function pages(): ng.QTabWidget {
    const pageIndex = config.get().pageIndex;

    const tab = new ng.QTabWidget();

    tab.setTabPosition(ng.TabPosition.East);

    for (const i in pageIndex)
        tab.addTab(ui.list(Object.keys(pageIndex[i]).map(i => ui.listItem(i)), {
            onChange: item => config.dispatch('change-page', { activePage: item.text(), activeTab: i }),
        }), new ng.QIcon(), i);

    return tab;
}

export async function styles(): Promise<ng.QTreeWidget> {
    return ui.tree({

    }, { labels: [translate`Styles`] });
}

export default async function PageList(): Promise<ng.QSplitter> {
    return ui.splitter(await pages(), await styles(), { orientation: ng.Orientation.Vertical });
}