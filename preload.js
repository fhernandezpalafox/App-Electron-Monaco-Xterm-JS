// preload.js
window.addEventListener('DOMContentLoaded', () => {
    const { Terminal } = require('xterm');
    const { FitAddon } = require('xterm-addon-fit');
    const { remote, ipcRenderer } = require('electron');

    // Personaliza el tema de la terminal
    const terminal = new Terminal({
        cursorBlink: true,
        rows: 10,
        theme: {
            background: '#1e1e1e',
            foreground: '#ffffff',
            cursor: '#ffffff',
            selection: '#4d4d4d',
            black: '#000000',
            red: '#e06c75',
            green: '#98c379',
            yellow: '#d19a66',
            blue: '#61afef',
            magenta: '#c678dd',
            cyan: '#56b6c2',
            white: '#d0d0d0',
            brightBlack: '#7f7f7f',
            brightRed: '#e06c75',
            brightGreen: '#98c379',
            brightYellow: '#d19a66',
            brightBlue: '#61afef',
            brightMagenta: '#c678dd',
            brightCyan: '#56b6c2',
            brightWhite: '#ffffff'
        }
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    const terminalContainer = document.getElementById('terminal');
    terminal.open(terminalContainer);
    terminal.writeln('Bienvenido al terminal');
    // Ajustar la terminal al cambiar el tamaño de la ventana
    //window.onresize = () => fitAddon.fit();

    // Ejecutar el código del editor Monaco
    window.executeCode = () => {
        try {
            // Redirige console.log al terminal
            console.log = (message) => {
                terminal.writeln(message.toString());
            };

            // Obtiene el valor del editor Monaco
            const code = window.editor.getValue();
            // Ejecuta el código
            eval(code);
        } catch (err) {
            // Escribe el error en el terminal si ocurre alguno
            terminal.writeln(`Error: ${err.message}`);
        }

        /*
        window.executeCode = () => {
       try {
         // Obtiene el valor del editor Monaco
         const code = window.editor.getValue();
         // Ejecuta el código y captura la salida
         let output = eval(code);
         // Verifica si 'output' es 'undefined' o 'null' y asigna un mensaje predeterminado
         if (output === undefined || output === null) {
           terminal.writeln('No hay salida para mostrar.');
         } else {
           // Convierte la salida a una cadena y la escribe en el terminal
           terminal.writeln(output.toString());
         }
       } catch (err) {
         // Escribe el error en el terminal si ocurre alguno
         terminal.writeln(`Error: ${err.message}`);
       }
     };
        */

    };


    document.getElementById('runButton').addEventListener('click', () => {
        window.executeCode();
    });

    /*
       // Forzar un re-renderizado de la terminal
            setTimeout(() => {
                terminal.refresh(0, terminal.rows - 1);
                fitAddon.fit();
            }, 1000);

    */

    // Manejar la entrada de datos en la terminal
    terminal.onData(data => {
        // Ejecutar el comando reset si se detectan caracteres extraños
        if (data === 'reset\n') {
            terminal.reset();
        }
        // ... manejar los datos de entrada
    });


    document.getElementById('min-btn').addEventListener('click', () => {
        ipcRenderer.send('minimize-window');
    });

    document.getElementById('max-btn').addEventListener('click', () => {
        ipcRenderer.send('maximize-window');
    });

    document.getElementById('close-btn').addEventListener('click', () => {
        ipcRenderer.send('close-window');
    });

    document.getElementById('close-btn').addEventListener('click', () => {
        var window = remote.getCurrentWindow();
        window.close();
    });

});


