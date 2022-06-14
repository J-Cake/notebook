import * as ng from '@nodegui/nodegui';

const win = new ng.QMainWindow();

await new Promise(function(ok) {
    win.show();
    win.addEventListener(ng.WidgetEventTypes.Close, () => ok());
});

console.log('Done');