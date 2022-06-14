import * as ng from '@nodegui/nodegui'
import _ from 'lodash';

export type Options = Partial<{
    parent: ng.QWidget,
    id: string
}>

export function label(text: string, options?: Options): ng.QLabel {
    const widget = new ng.QLabel(options?.parent);
    widget.setText(text);

    if (options?.id)
        widget.setObjectName(options.id);

    return widget;
}

export function button(text: string, options?: Options & { onTriggered?: Function, role?: ng.ButtonRole }): ng.QPushButton {
    const widget = new ng.QPushButton(options?.parent);
    widget.setText(text);

    widget.addEventListener('clicked', (event: any) => options?.onTriggered(event));

    if (options?.id)
        widget.setObjectName(options.id);

    return widget;
}

export function box(children: Iterable<ng.QWidget>, options?: Options & { container?: ng.QWidget, direction?: ng.Direction }): ng.QWidget {
    const widget = options?.container ?? new ng.QWidget(options?.parent);

    if (options?.id)
        widget.setObjectName(options.id);

    const layout = new ng.QBoxLayout(options?.direction ?? ng.Direction.TopToBottom, widget);
    layout.setSpacing(0);
    widget.setLayout(layout);

    for (const child of children)
        layout.addWidget(child);


    return widget;
}

export function rbox(children: Iterable<ng.QWidget>, options?: Options & { container?: ng.QWidget, direction?: ng.Direction }): ng.QBoxLayout {
    const layout = new ng.QBoxLayout(options?.direction ?? ng.Direction.TopToBottom);
    layout.setSpacing(0)

    for (const child of children)
        layout.addWidget(child);

    return layout;
}

export function splitter(left: ng.QWidget, right: ng.QWidget, options?: Options & { orientation?: ng.Orientation }): ng.QSplitter {
    const splitter = new ng.QSplitter(options?.parent);

    if (options?.id)
        splitter.setObjectName(options.id);

    splitter.setOrientation(options?.orientation ?? ng.Orientation.Horizontal);

    splitter.addWidget(left);
    splitter.addWidget(right);

    return splitter;
}

export function list(children: ng.QListWidgetItem[], options?: Options & { onChange: (item: ng.QListWidgetItem) => void }): ng.QListWidget {
    const list = new ng.QListWidget();

    if (options?.id)
        list.setObjectName(options.id);

    for (const child of children)
        list.addItem(child);

    list.addEventListener('currentItemChanged', item => options?.onChange(item));

    return list;
}

export function listItem(text: string): ng.QListWidgetItem {
    const item = new ng.QListWidgetItem(text);
    return item;
}

export const selector = Symbol.for('Selector');
export type Tree = Record<string, [string | Tree]>

export function tree(tree: Tree, options?: Options & { labels?: string[], onChange?: (item: ng.QTreeWidgetItem, prev: ng.QTreeWidgetItem) => void }): ng.QTreeWidget {
    const treeView = new ng.QTreeWidget();

    if (options?.labels)
        treeView.setHeaderLabels(options.labels);

    if (options?.id)
        treeView.setObjectName(options.id);

    const children: ng.QTreeWidgetItem[] = [];

    // treeView.addEventListener('currentItemChanged', (item, prev) => options?.onChange(item, prev));
    treeView.addEventListener('itemSelectionChanged', () => console.log(treeView.selectedItems()));

    const add = function add(tree: Tree, label: string, parent?: ng.QTreeWidgetItem) {
        if (!tree)
            return;

        for (const [key, [value]] of Object.entries(tree)) {

            const item = new ng.QTreeWidgetItem(parent, [key]);
            item[selector] = `${label}.${key}`.slice(1);

            children.push(item);

            if (typeof value === 'string')
                continue;
            else
                add(value, `${label}.${key}`, item);
        }
    };

    add(tree, ``, treeView as any);

    return treeView;
}