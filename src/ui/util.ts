import * as ng from '@nodegui/nodegui'

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

export function button(text: string, options?: Options & { onTriggered?: Function }): ng.QPushButton {
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
    widget.setLayout(layout);

    for (const child of children)
        layout.addWidget(child);


    return widget;
}

export function rbox(children: Iterable<ng.QWidget>, options?: Options & { container?: ng.QWidget, direction?: ng.Direction }): ng.QBoxLayout {
    const layout = new ng.QBoxLayout(options?.direction ?? ng.Direction.TopToBottom);

    for (const child of children)
        layout.addWidget(child);

    return layout;
}