import {
    ILayoutRestorer,
    JupyterFrontEnd
} from '@jupyterlab/application';

import {
    ICommandPalette,
    MainAreaWidget,
    WidgetTracker
} from '@jupyterlab/apputils';

// Custom Widget
import { APODWidget } from './APODWidget';

/**
* Activate the APOD widget extension.
*/
function activate(app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer) {
    console.log('JupyterLab extension jupyterlab_apod is activated!');

    // Declare a widget variable
    let widget: MainAreaWidget<APODWidget>;

    // Add an application command
    const command: string = 'apod:open';
    app.commands.addCommand(command, {
        label: 'Random Astronomy Picture',
        execute: () => {
            if (!widget || widget.isDisposed) {
                // Create a new widget if one does not exist
                // or if the previous one was disposed after closing the panel
                const content = new APODWidget();
                content.addClass('my-apodWidget'); // new line
                widget = new MainAreaWidget({ content });
                widget.id = 'apod-jupyterlab';
                widget.title.label = 'Astronomy Picture';
                widget.title.closable = true;
            }
            if (!tracker.has(widget)) {
                // Track the state of the widget for later restoration
                tracker.add(widget);
            }
            if (!widget.isAttached) {
                // Attach the widget to the main work area if it's not there
                app.shell.add(widget, 'main');
            }
            // Refresh the picture in the widget
            widget.content.update();

            // Activate the widget
            app.shell.activateById(widget.id);
        }
    });

    // Add the command to the palette.
    palette.addItem({ command, category: 'Tutorial' });

    // Track and restore the widget state
    let tracker = new WidgetTracker<MainAreaWidget<APODWidget>>({
        namespace: 'apod'
    });
    restorer.restore(tracker, {
        command,
        name: () => 'apod'
    });
}

export {
    activate
};