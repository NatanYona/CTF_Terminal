// Variables globales
        let currentPath = '/CTF_Challenge/Inicio';
        let commandHistory = [];
        let historyIndex = -1;
        let terminal = document.getElementById('terminal');
        let currentInputElement;
        let copyNotification = document.getElementById('copy-notification');
        let konami_sequence = [];
        const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        // Sistema de archivos virtual - estructura exacta con easter eggs
        const filesystem = {
            'CTF_Challenge': {
                type: 'directory',
                children: {
                    'Inicio': {
                        type: 'directory',
                        children: {
                            'introduccion_ctf.txt': {
                                type: 'file',
                                content: `Bienvenido al reto CTF.
Tu objetivo será navegar por los directorios, explorar los archivos, y reunir las piezas necesarias para reconstruir la bandera final.
Utiliza los comandos de consola Linux como ls, cd, cat, mv, mkdir, rm.
¡Buena suerte!

P.S: Los hackers curiosos siempre encuentran secretos... 👀`
                            },
                            '.secret_readme.txt': {
                                type: 'file',
                                content: `¡Encontraste un archivo oculto!
Pista: Prueba el comando 'matrix' para ver algo genial.
También existe 'coffee' para los verdaderos programadores.
Los Konami Codes nunca pasan de moda... ↑↑↓↓←→←→BA`
                            }
                        }
                    },
                    'Docs': {
                        type: 'directory',
                        children: {
                            'instrucciones.txt': {
                                type: 'file',
                                content: `Crea un directorio nuevo dentro de esta carpeta.
Mueve dentro de él los archivos correctos que contengan la bandera.
Cuando los hayas reunido, utiliza cat para concatenar su contenido y descubrir la flag final.`
                            },
                            'flag.txt': {
                                type: 'file',
                                content: 'CTF{HICISTE_'
                            },
                            'pista.txt': {
                                type: 'file',
                                content: `Pista: un organismo modelo usado en la ciencia.
Revisa con atención la carpeta Animales.`
                            },
                            'notas.txt': {
                                type: 'file',
                                content: `Estas son tus notas:
Ten cuidado, no todos los archivos contienen partes válidas de la bandera.
Algunos están puestos como trampa.

Nota del administrador: Si encuentras bugs, prueba 'debug' 🐛`
                            },
                            '.env': {
                                type: 'file',
                                content: `# Configuración del sistema CTF
VERSION="HackerOS 13.37-leet"
KERNEL="Penguin-5.4.0-42-generic"
SHELL="/bin/bash-4-nerds"
USER_AGENT="Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0"
SECRET_SAUCE="The cake is a lie"`
                            }
                        }
                    },
                    'Animales': {
                        type: 'directory',
                        children: {
                            'raton.txt': {
                                type: 'file',
                                content: 'LAS_MOVIDAS_'
                            },
                            'conejo.txt': {
                                type: 'file',
                                content: 'LOS_SALTOS_'
                            },
                            'murcielago.txt': {
                                type: 'file',
                                content: 'LOS_VUELOS_'
                            },
                            'zorro.txt': {
                                type: 'file',
                                content: 'LAS_TRAMPAS_'
                            },
                            '.dinosaur.txt': {
                                type: 'file',
                                content: `🦕 ¿Un dinosaurio? ¡Imposible!
Estos archivos tienen millones de años...
O tal vez solo están aquí desde 1970-01-01 00:00:00 UTC 😉`
                            }
                        }
                    },
                    'Frutas': {
                        type: 'directory',
                        children: {
                            'bananas.txt': {
                                type: 'file',
                                content: 'BIEN}'
                            },
                            'kiwi.txt': {
                                type: 'file',
                                content: 'MAL}'
                            },
                            'manzana.txt': {
                                type: 'file',
                                content: 'BUENAS}'
                            },
                            'uva.txt': {
                                type: 'file',
                                content: 'CORRECTAS}'
                            }
                        }
                    },
                    '.hidden': {
                        type: 'directory',
                        children: {
                            'secrets.txt': {
                                type: 'file',
                                content: `Easter Eggs disponibles:
- matrix: Efecto Matrix
- coffee: Para programadores
- sudo: Poder supremo (o no)
- rm -rf /: Classic troll
- sl: Tren choo-choo
- cowsay: Vaca parlanchina
- fortune: Galleta de la fortuna
- hack: Modo hacker
- debug: Información del sistema`
                            }
                        }
                    }
                }
            }
        };
        
        // Sistema de ayuda detallado con easter eggs
        const commandHelp = {
            ls: {
                description: "Lista los archivos y directorios en el directorio actual",
                usage: "ls [directorio] [-a para archivos ocultos]",
                examples: [
                    "ls        # Lista el contenido del directorio actual",
                    "ls Animales # Lista el contenido del directorio Animales",
                    "ls -a     # Muestra archivos ocultos también"
                ]
            },
            cd: {
                description: "Cambia el directorio actual",
                usage: "cd [directorio]",
                examples: [
                    "cd Animales   # Cambia al directorio Animales",
                    "cd ..         # Retrocede al directorio padre",
                    "cd /          # Va al directorio raíz"
                ]
            },
            pwd: {
                description: "Muestra la ruta del directorio actual",
                usage: "pwd",
                examples: [
                    "pwd   # Muestra algo como '/CTF_Challenge/Animales'"
                ]
            },
            cat: {
                description: "Muestra el contenido de uno o más archivos",
                usage: "cat archivo1 [archivo2 ...]",
                examples: [
                    "cat flag.txt                   # Muestra el contenido de flag.txt",
                    "cat flag.txt raton.txt         # Muestra ambos archivos concatenados",
                    "cat flag.txt raton.txt > final.txt # Combina ambos archivos en final.txt"
                ]
            },
            more: {
                description: "Muestra el contenido de un archivo página por página (similar a cat)",
                usage: "more archivo",
                examples: [
                    "more instrucciones.txt   # Muestra el archivo página por página"
                ]
            },
            less: {
                description: "Alias del comando more",
                usage: "less archivo",
                examples: [
                    "less instrucciones.txt   # Muestra el archivo página por página"
                ]
            },
            mkdir: {
                description: "Crea un nuevo directorio",
                usage: "mkdir nombre_directorio",
                examples: [
                    "mkdir proyecto   # Crea un directorio llamado 'proyecto'"
                ]
            },
            mv: {
                description: "Mueve o renombra archivos y directorios",
                usage: "mv origen destino",
                examples: [
                    "mv raton.txt ../proyecto/   # Mueve raton.txt al directorio proyecto",
                    "mv viejo.txt nuevo.txt      # Renombra viejo.txt a nuevo.txt"
                ]
            },
            rm: {
                description: "Elimina archivos o directorios vacíos",
                usage: "rm archivo",
                examples: [
                    "rm archivo.txt   # Elimina archivo.txt"
                ]
            },
            clear: {
                description: "Limpia la pantalla de la terminal",
                usage: "clear",
                examples: [
                    "clear   # Limpia toda la pantalla"
                ]
            },
            help: {
                description: "Muestra ayuda sobre los comandos disponibles",
                usage: "help [comando]",
                examples: [
                    "help       # Muestra todos los comandos disponibles",
                    "help cat   # Muestra ayuda detallada sobre el comando cat"
                ]
            },
            reset: {
                description: "Reinicia la terminal al estado inicial",
                usage: "reset",
                examples: [
                    "reset   # Reinicia la terminal"
                ]
            }
        };
        
        // Función para navegar al directorio
        function getDirectoryAtPath(path) {
            // Remover slash inicial y dividir en partes
            const parts = path.replace(/^\/+/, '').split('/').filter(p => p);
            let current = filesystem;
            
            for (const part of parts) {
                if (current[part] && current[part].type === 'directory') {
                    current = current[part].children;
                } else {
                    return null;
                }
            }
            
            return current;
        }
        
        // Función para obtener el directorio padre de una ruta
        function getParentDirectory(path) {
            const parts = path.replace(/^\/+/, '').split('/').filter(p => p);
            if (parts.length === 0) return null;
            
            parts.pop(); // Eliminar el último elemento
            return '/' + parts.join('/');
        }
        
        // Función para resolver rutas relativas
        function resolvePath(targetPath) {
            if (targetPath.startsWith('/')) {
                return targetPath;
            }
            
            // Dividir la ruta actual y la ruta objetivo
            const currentParts = currentPath.replace(/^\/+/, '').split('/').filter(p => p);
            const targetParts = targetPath.split('/').filter(p => p);
            
            // Procesar cada parte de la ruta objetivo
            for (const part of targetParts) {
                if (part === '..') {
                    if (currentParts.length > 0) {
                        currentParts.pop();
                    }
                } else if (part !== '.') {
                    currentParts.push(part);
                }
            }
            
            return '/' + currentParts.join('/');
        }
        
        // Función para mostrar ayuda detallada de un comando
        function showCommandHelp(command) {
            if (!commandHelp[command]) {
                return `No hay ayuda disponible para el comando '${command}'.`;
            }
            
            let helpText = `<span class="help-title">Comando: ${command}</span>\n`;
            helpText += `<span class="help-description">${commandHelp[command].description}</span>\n\n`;
            
            helpText += `<span class="help-title">Uso:</span>\n`;
            helpText += `<span class="help-command">${commandHelp[command].usage}</span>\n\n`;
            
            if (commandHelp[command].examples && commandHelp[command].examples.length > 0) {
                helpText += `<span class="help-title">Ejemplos:</span>\n`;
                commandHelp[command].examples.forEach(example => {
                    helpText += `<span class="help-command">${example}</span>\n`;
                });
            }
            
            return helpText;
        }
        
        // Easter eggs y comandos ocultos
        const easterEggs = {
            matrix: function() {
                let output = '<span class="matrix">Wake up, Neo...\n';
                for (let i = 0; i < 5; i++) {
                    output += '01001000 01100001 01100011 01101011 01100101 01110010\n';
                }
                output += 'The Matrix has you... 💊</span>';
                return output;
            },
            
            coffee: function() {
                return `<span class="easter-egg">
                    ( (
                     ) )
                  ........
                  |      |]
                  \\      /
                   \`----'

☕ Error 418: I'm a teapot
But I can still make coffee for hackers!

"Coffee: the common man's gold, and like gold, it brings to every man the feeling of luxury and nobility." - Sheik-Abd-al-Kadir</span>`;
            },
            
            sudo: function(args) {
                const phrases = [
                    "We trust you have received the usual lecture from the local System Administrator.",
                    "Nice try, but you're not root here! 😏",
                    "With great power comes great electricity bill.",
                    "sudo: unable to resolve host 'reality'",
                    "Access denied. Have you tried turning it off and on again?"
                ];
                return `<span class="easter-egg">${phrases[Math.floor(Math.random() * phrases.length)]}</span>`;
            },
            
            'rm -rf /': function() {
                return `<span class="error">💀 ABORT! ABORT! ABORT! 💀
Just kidding... but don't try this at home!
Your data is safe... for now. 😈</span>`;
            },
            
            sl: function() {
                return `<span class="easter-egg">
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  C&O  |  |  |         ||_| |_||
  |      |  |   H  |__-------|  |   |         |__|___|
  | ________|___H__/__|_____/__|_____| 
  |_____/    |---L^L|===L^L===L^L===L

🚂 Choo-choo! You've been train-rolled!</span>`;
            },
            
            cowsay: function(args) {
                const message = args.length > 0 ? args.join(' ') : "Have you tried the Konami Code?";
                const border = '_'.repeat(message.length + 2);
                return `<span class="easter-egg">
 ${border}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||</span>`;
            },
            
            fortune: function() {
                const fortunes = [
                    "A bug in the code is worth two in the documentation.",
                    "There are only 10 types of people: those who understand binary and those who don't.",
                    "Programming is 10% science, 20% ingenuity, and 70% getting the ingenuity to work with the science.",
                    "Always code as if the person who ends up maintaining your code is a violent psychopath who knows where you live.",
                    "The best thing about a boolean is even if you are wrong, you are only off by a bit.",
                    "404: Wisdom not found. Please try again later.",
                    "In theory, there's no difference between theory and practice. In practice, there is.",
                    "A computer is like air conditioning - it works fine until you open Windows."
                ];
                return `<span class="success">🥠 ${fortunes[Math.floor(Math.random() * fortunes.length)]}</span>`;
            },
            
            hack: function() {
                return `<span class="matrix">
🎭 INITIATING HACK SEQUENCE...
[████████████████████████████] 100%
Access granted to mainframe...
Bypassing firewall...
Downloading the_internet.zip...
💻 HACK COMPLETE! You are now 1337 h4x0r!</span>`;
            },
            
            debug: function() {
                const now = new Date();
                return `<span class="help-command">🐛 System Debug Information:
OS: HackerOS 13.37-leet edition
Kernel: Linux-Penguin 5.4.0-42-generic
Shell: /bin/bash-4-nerds (GNU bash, version 4.20.69)
Terminal: xterm-256color-ultra-hacker-edition
Current time: ${now.toLocaleString()}
Uptime: ${Math.floor(Math.random() * 1000)} days, 13:37:42
Load average: 0.42, 1.33, 7.77
Memory: 31337/65536 MB (available)
Swap: 1337/2048 MB
Processes: 256 total, 42 running, 69 sleeping
Users: 1 hacker currently logged in
IPv4: 127.0.0.1 (localhost)
IPv6: ::1 (localhost)
Public IP: 192.168.1.42 (behind NAT)
Fun fact: This terminal has been compromised 0 times! 🛡️</span>`;
            },
            
            konami: function() {
                return `<span class="matrix">
🎮 KONAMI CODE ACTIVATED! 🎮
↑↑↓↓←→←→BA

⭐ You've unlocked the secret hacker achievement! ⭐
+30 Lives, +1337 Points, +∞ Coffee

"The cake is a lie, but the code is real!" - GLaDOS, probably</span>`;
            }
        };
        
        // Comandos disponibles con easter eggs
        const commands = {
            ls: function(args) {
                let showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
                let targetPath = currentPath;
                
                // Si hay argumento de directorio
                const dirArg = args.find(arg => !arg.startsWith('-'));
                if (dirArg) {
                    targetPath = resolvePath(dirArg);
                }
                
                const dir = getDirectoryAtPath(targetPath);
                if (!dir) {
                    return 'ls: cannot access directory';
                }
                
                let items = Object.keys(dir).sort();
                
                // Filtrar archivos ocultos si no se especifica -a
                if (!showHidden) {
                    items = items.filter(item => !item.startsWith('.'));
                }
                
                if (items.length === 0) {
                    return '';
                }
                
                return items.map(item => {
                    const isDir = dir[item].type === 'directory';
                    const className = isDir ? 'directory' : 'file';
                    const prefix = item.startsWith('.') ? '<span class="easter-egg">🕵️</span> ' : '';
                    return prefix + `<span class="${className}">${item}</span>`;
                }).join('  ');
            },
            
            cd: function(args) {
                if (args.length === 0) {
                    currentPath = '/CTF_Challenge';
                    return '';
                }
                
                const target = args[0];
                let newPath;
                
                if (target === '..') {
                    if (currentPath === '/CTF_Challenge') {
                        return '';
                    }
                    const parts = currentPath.split('/').filter(p => p);
                    parts.pop();
                    newPath = '/' + parts.join('/');
                } else if (target === '.') {
                    return '';
                } else if (target.startsWith('/')) {
                    if (!target.startsWith('/CTF_Challenge')) {
                        return 'bash: cd: permission denied';
                    }
                    newPath = target;
                } else {
                    newPath = currentPath + '/' + target;
                }
                
                // Verificar que el directorio existe
                const targetDir = getDirectoryAtPath(newPath);
                if (!targetDir) {
                    return `bash: cd: ${target}: No such file or directory`;
                }
                
                currentPath = newPath;
                return '';
            },
            
            pwd: function(args) {
                return currentPath;
            },
            
            cat: function(args) {
                if (args.length === 0) {
                    return 'cat: missing file operand';
                }
                
                let output = '';
                
                for (const filename of args) {
                    const dir = getDirectoryAtPath(currentPath);
                    
                    if (!dir || !dir[filename]) {
                        output += `cat: ${filename}: No such file or directory\n`;
                        continue;
                    }
                    
                    if (dir[filename].type !== 'file') {
                        output += `cat: ${filename}: Is a directory\n`;
                        continue;
                    }
                    
                    // Eliminar saltos de línea al final del contenido
                    let content = dir[filename].content;
                    if (typeof content === 'string') {
                        content = content.replace(/\n+$/, '');
                    }
                    
                    output += content;
                }
                
                return output;
            },
            
            more: function(args) {
                if (args.length === 0) {
                    return 'more: missing file operand';
                }
                
                return commands.cat(args);
            },
            
            less: function(args) {
                return commands.more(args);
            },
            
            mkdir: function(args) {
                if (args.length === 0) {
                    return 'mkdir: missing operand';
                }
                
                const dirname = args[0];
                const dir = getDirectoryAtPath(currentPath);
                
                if (!dir) {
                    return 'mkdir: cannot create directory';
                }
                
                if (dir[dirname]) {
                    return `mkdir: cannot create directory '${dirname}': File exists`;
                }
                
                dir[dirname] = {
                    type: 'directory',
                    children: {}
                };
                
                return '';
            },
            
            mv: function(args) {
                if (args.length < 2) {
                    return 'mv: missing file operand';
                }
                
                const source = args[0];
                const dest = args[1];
                const currentDir = getDirectoryAtPath(currentPath);
                
                if (!currentDir) {
                    return 'mv: cannot access directory';
                }
                
                if (!currentDir[source]) {
                    return `mv: cannot stat '${source}': No such file or directory`;
                }
                
                // Resolver la ruta de destino
                const resolvedDestPath = resolvePath(dest);
                const destDirPath = getParentDirectory(resolvedDestPath);
                const destName = resolvedDestPath.split('/').pop();
                
                let destDir;
                if (destDirPath) {
                    destDir = getDirectoryAtPath(destDirPath);
                } else {
                    destDir = currentDir;
                }
                
                // Si el destino es un directorio existente, mover el archivo dentro de él
                if (destDir && destDir[destName] && destDir[destName].type === 'directory') {
                    // Mover el archivo al directorio destino
                    destDir[destName].children[source] = currentDir[source];
                    delete currentDir[source];
                    return '';
                }
                
                // Si el destino no existe o no es un directorio, tratar como renombrado
                if (destDir) {
                    destDir[destName] = currentDir[source];
                    delete currentDir[source];
                } else {
                    return `mv: cannot move to '${dest}': No such file or directory`;
                }
                
                return '';
            },
            
            rm: function(args) {
                if (args.length === 0) {
                    return 'rm: missing operand';
                }
                
                const filename = args[0];
                const dir = getDirectoryAtPath(currentPath);
                
                if (!dir) {
                    return 'rm: cannot access directory';
                }
                
                if (!dir[filename]) {
                    return `rm: cannot remove '${filename}': No such file or directory`;
                }
                
                if (dir[filename].type === 'directory' && Object.keys(dir[filename].children).length > 0) {
                    return `rm: cannot remove '${filename}': Directory not empty`;
                }
                
                delete dir[filename];
                return '';
            },
            
            clear: function(args) {
                terminal.innerHTML = '';
                return '';
            },
            
            help: function(args) {
                if (args.length === 0) {
                    // Mostrar ayuda general
                    let helpText = `<span class="help-title">Comandos disponibles:</span>\n`;
                    Object.keys(commandHelp).forEach(cmd => {
                        helpText += `<span class="help-command">${cmd}</span> - ${commandHelp[cmd].description}\n`;
                    });
                    helpText += `\n<span class="help-description">Usa 'help [comando]' para obtener más información sobre un comando específico.</span>`;
                    helpText += `\n<span class="easter-egg">💡 Pista: Los hackers curiosos exploran archivos ocultos con 'ls -a'...</span>`;
                    return helpText;
                } else {
                    // Mostrar ayuda específica para un comando
                    return showCommandHelp(args[0]);
                }
            },
            
            reset: function(args) {
                currentPath = '/CTF_Challenge/Inicio';
                commandHistory = [];
                historyIndex = -1;
                terminal.innerHTML = '';
                return '';
            },
            
            // Easter eggs como comandos
            matrix: easterEggs.matrix,
            coffee: easterEggs.coffee,
            sudo: easterEggs.sudo,
            sl: easterEggs.sl,
            cowsay: easterEggs.cowsay,
            fortune: easterEggs.fortune,
            hack: easterEggs.hack,
            debug: easterEggs.debug
        };
        
        // Función para manejar redirección (> y >>)
        function handleRedirection(fullCommand) {
            // Buscar operadores de redirección
            const redirectOutIndex = fullCommand.indexOf('>');
            const redirectAppendIndex = fullCommand.indexOf('>>');
            
            if (redirectAppendIndex !== -1) {
                // Redirección con append (>>)
                const commandPart = fullCommand.substring(0, redirectAppendIndex).trim();
                const filePart = fullCommand.substring(redirectAppendIndex + 2).trim();
                
                // Ejecutar el comando
                const output = executeCommand(commandPart, false);
                
                // Obtener el directorio actual
                const dir = getDirectoryAtPath(currentPath);
                if (!dir) {
                    return 'Error: cannot access directory';
                }
                
                // Si el archivo ya existe, añadir contenido, sino crearlo
                if (dir[filePart]) {
                    if (dir[filePart].type === 'file') {
                        dir[filePart].content += output;
                    } else {
                        return `Error: ${filePart} is a directory`;
                    }
                } else {
                    dir[filePart] = {
                        type: 'file',
                        content: output
                    };
                }
                
                return '';
            } else if (redirectOutIndex !== -1) {
                // Redirección con overwrite (>)
                const commandPart = fullCommand.substring(0, redirectOutIndex).trim();
                const filePart = fullCommand.substring(redirectOutIndex + 1).trim();
                
                // Ejecutar el comando
                const output = executeCommand(commandPart, false);
                
                // Obtener el directorio actual
                const dir = getDirectoryAtPath(currentPath);
                if (!dir) {
                    return 'Error: cannot access directory';
                }
                
                // Crear o sobrescribir el archivo
                dir[filePart] = {
                    type: 'file',
                    content: output
                };
                
                return '';
            }
            
            // No hay redirección
            return null;
        }
        
        // Función para ejecutar comando
        function executeCommand(input, showOutput = true) {
            // Verificar easter eggs especiales
            if (input.trim() === 'rm -rf /') {
                return easterEggs['rm -rf /']();
            }
            
            // Primero verificar si hay redirección
            const redirectResult = handleRedirection(input);
            if (redirectResult !== null) {
                return redirectResult;
            }
            
            // Si no hay redirección, procesar normalmente
            const parts = input.trim().split(/\s+/);
            const command = parts[0];
            const args = parts.slice(1);
            
            if (command === '') return '';
            
            if (commands[command]) {
                return commands[command](args);
            } else {
                // Comandos divertidos que no están en el objeto commands
                const funnyCommands = [
                    'vim', 'nano', 'emacs', 'exit', 'logout', 'shutdown', 'reboot',
                    'whoami', 'id', 'uname', 'ps', 'top', 'htop', 'free', 'df',
                    'mount', 'umount', 'ssh', 'scp', 'rsync', 'wget', 'curl',
                    'ping', 'traceroute', 'netstat', 'ifconfig', 'iptables'
                ];
                
                if (funnyCommands.includes(command)) {
                    const responses = {
                        'vim': 'vim: command found, but how do you exit? 😈\nPress ESC then type :q! (just kidding, this is fake vim)',
                        'nano': 'nano: too mainstream for 1337 hackers. Try vim! 😏',
                        'emacs': 'emacs: Great OS, terrible editor. 🤪',
                        'exit': 'exit: There is no escape from the CTF! Muahahaha! 👹',
                        'logout': 'logout: You can check out any time you like, but you can never leave... 🏨',
                        'shutdown': 'shutdown: Nice try! But this terminal runs on pure caffeine ☕',
                        'reboot': 'reboot: Error 404: Physical hardware not found 🤖',
                        'whoami': `You are: ${['Neo', 'Trinity', 'Morpheus', 'A script kiddie', 'The chosen one', 'Batman'][Math.floor(Math.random() * 6)]} 🦸‍♂️`,
                        'id': 'uid=1337(hacker) gid=31337(elite) groups=31337(elite),42(answer),69(nice)',
                        'uname': 'HackerOS 13.37.0-leet #42-Ubuntu SMP Wed Apr 1 13:37:00 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux',
                        'ps': 'PID TTY          TIME CMD\n1337 pts/0    00:13:37 hack_the_planet\n31337 pts/0   00:04:20 coffee_maker',
                        'top': 'Load Avg: 1.33, 7.77, 13.37\nTasks: 42 total, 1 running, 41 sleeping\nCPU(s): 13.37%us, 4.20%sy, 0.0%ni, 82.43%id',
                        'htop': 'htop: For when top is not fancy enough 🎨',
                        'free': 'Memory: 31337 total, 1337 used, 30000 free, 420 buff/cache\nSwap: 2048 total, 0 used, 2048 free. 13370 avail Mem',
                        'df': 'Filesystem: /dev/sda1 Size: ∞TB Used: 42GB Avail: ∞TB Use%: 0.000001% Mounted on /',
                        'ssh': 'ssh: Connection to reality refused (Connection timed out) 🌐',
                        'ping': 'PING google.com (8.8.8.8): 56 data bytes\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=64 time=13.37ms\n(Just kidding, no real network here!)',
                        'curl': 'curl: The internet is not available in this simulation 🌍',
                        'wget': 'wget: --2025-09-10 13:37:00-- Error: No internet in the matrix 🔌'
                    };
                    
                    return `<span class="easter-egg">${responses[command] || 'Command recognized but not implemented in this CTF environment! 🎮'}</span>`;
                }
                
                return `bash: ${command}: command not found`;
            }
        }
        
        // Función para escribir en la terminal
        function writeToTerminal(text, newLine = true) {
            // Detectar si el texto es un error
            if (text.includes('cannot') || text.includes('Error') || text.includes('missing') || text.includes('No such')) {
                terminal.innerHTML += `<span class="error">${text}</span>` + (newLine ? '\n' : '');
            } else if (text.includes('CTF{') || text.includes('success')) {
                terminal.innerHTML += `<span class="success">${text}</span>` + (newLine ? '\n' : '');
            } else {
                terminal.innerHTML += text + (newLine ? '\n' : '');
            }
            terminal.scrollTop = terminal.scrollHeight;
        }
        
        // Función para crear nueva línea de input
        function createInputLine() {
            const inputDiv = document.createElement('div');
            inputDiv.className = 'input-line';
            
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.innerHTML = getPrompt();
            
            const inputSpan = document.createElement('span');
            inputSpan.className = 'input';
            inputSpan.contentEditable = true;
            inputSpan.style.outline = 'none';
            
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.innerHTML = '&nbsp;';
            
            inputDiv.appendChild(promptSpan);
            inputDiv.appendChild(inputSpan);
            inputDiv.appendChild(cursor);
            
            terminal.appendChild(inputDiv);
            inputSpan.focus();
            
            return inputSpan;
        }
        
        // Función para obtener el prompt con IP divertida
        function getPrompt() {
            const shortPath = currentPath.replace('/CTF_Challenge', '~');
            const funnyIPs = ['127.0.0.1', '192.168.1.42', '10.0.0.1337', '172.16.13.37'];
            const randomIP = funnyIPs[Math.floor(Math.random() * funnyIPs.length)];
            return `<span style="color: #00ff00;">hacker@ctf-${randomIP.replace(/\./g, '-')}</span>:${shortPath}$ `;
        }
        
        // Función para procesar comando
        function processCommand(command) {
            const output = executeCommand(command);
            if (output) {
                writeToTerminal(output);
            }
            
            // Agregar al historial
            if (command.trim()) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
            }
            
            // Crear nueva línea de input
            currentInputElement = createInputLine();
            setupInputHandlers();
        }
        
        // Función para manejar Konami Code
        function handleKonamiCode(key) {
            konami_sequence.push(key);
            
            if (konami_sequence.length > KONAMI_CODE.length) {
                konami_sequence.shift();
            }
            
            if (JSON.stringify(konami_sequence) === JSON.stringify(KONAMI_CODE)) {
                writeToTerminal(easterEggs.konami());
                konami_sequence = [];
                currentInputElement = createInputLine();
                setupInputHandlers();
            }
        }
        
        // Configurar event handlers para el input
        function setupInputHandlers() {
            currentInputElement.addEventListener('keydown', function(e) {
                // Manejar Konami Code
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'].includes(e.code)) {
                    handleKonamiCode(e.code);
                }
                
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const command = this.textContent;
                    
                    // Remover cursor y hacer el input no editable
                    const cursor = this.nextElementSibling;
                    if (cursor) cursor.remove();
                    this.contentEditable = false;
                    
                    processCommand(command);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (historyIndex > 0) {
                        historyIndex--;
                        this.textContent = commandHistory[historyIndex];
                        // Colocar cursor al final
                        setTimeout(() => {
                            const range = document.createRange();
                            const sel = window.getSelection();
                            if (this.childNodes.length > 0) {
                                range.setStart(this.childNodes[0], this.textContent.length);
                            } else {
                                range.setStart(this, 0);
                            }
                            range.collapse(true);
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }, 10);
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (historyIndex < commandHistory.length - 1) {
                        historyIndex++;
                        this.textContent = commandHistory[historyIndex];
                    } else {
                        historyIndex = commandHistory.length;
                        this.textContent = '';
                    }
                    // Colocar cursor al final
                    setTimeout(() => {
                        const range = document.createRange();
                        const sel = window.getSelection();
                        if (this.childNodes.length > 0) {
                            range.setStart(this.childNodes[0], this.textContent.length);
                        } else {
                            range.setStart(this, 0);
                        }
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }, 10);
                } else if (e.key === 'Tab') {
                    e.preventDefault();
                    
                    const currentText = this.textContent;
                    const parts = currentText.split(' ');
                    const lastPart = parts[parts.length - 1];
                    
                    if (parts.length === 1) {
                        // Autocompletar comandos
                        const commandMatches = Object.keys(commands).filter(cmd => 
                            cmd.startsWith(lastPart)
                        );
                        
                        // Agregar easter eggs al autocompletado
                        const easterEggCommands = ['matrix', 'coffee', 'sudo', 'sl', 'cowsay', 'fortune', 'hack', 'debug'];
                        const easterMatches = easterEggCommands.filter(cmd => cmd.startsWith(lastPart));
                        const allMatches = [...commandMatches, ...easterMatches];
                        
                        if (allMatches.length === 1) {
                            this.textContent = allMatches[0] + ' ';
                        } else if (allMatches.length > 1) {
                            writeToTerminal(`\n${allMatches.join('  ')}`);
                            currentInputElement = createInputLine();
                            setupInputHandlers();
                            currentInputElement.textContent = currentText;
                        }
                    } else {
                        // Autocompletar archivos/directorios
                        const dir = getDirectoryAtPath(currentPath);
                        if (dir) {
                            const matches = Object.keys(dir).filter(item => 
                                item.startsWith(lastPart)
                            );
                            
                            if (matches.length === 1) {
                                parts[parts.length - 1] = matches[0];
                                this.textContent = parts.join(' ');
                            } else if (matches.length > 1) {
                                writeToTerminal(`\n${matches.join('  ')}`);
                                currentInputElement = createInputLine();
                                setupInputHandlers();
                                currentInputElement.textContent = currentText;
                            }
                        }
                    }
                    
                    // Colocar cursor al final
                    setTimeout(() => {
                        const range = document.createRange();
                        const sel = window.getSelection();
                        if (this.childNodes.length > 0) {
                            range.setStart(this.childNodes[0], this.textContent.length);
                        } else {
                            range.setStart(this, 0);
                        }
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }, 10);
                }
            });
        }
        
        // Función para mostrar notificación de copiado
        function showCopyNotification() {
            copyNotification.style.display = 'block';
            setTimeout(() => {
                copyNotification.style.display = 'none';
            }, 2000);
        }
        
        // Inicializar
        function init() {
            // Mensaje inicial con versión divertida
            writeToTerminal('HackerOS 13.37-leet (GNU/Linux 5.4.0-42-generic x86_64)');
            writeToTerminal('');
            writeToTerminal('🐧 Welcome to the CTF Matrix, Neo...');
            writeToTerminal('Last login: ' + new Date().toString().substring(0, 24) + ' from 192.168.1.337');
            writeToTerminal('System load: 1.337  Processes: 42  Users logged in: 1337');
            writeToTerminal('Memory usage: 13%   IP address: 127.0.0.1   Swap usage: 0%');
            writeToTerminal('');
            writeToTerminal('<span class="easter-egg">💡 Tip: Try "help" for commands, or explore with "ls -a" to find hidden secrets...</span>');
            writeToTerminal('');
            
            // Crear primera línea de input
            currentInputElement = createInputLine();
            setupInputHandlers();
            
            // Habilitar selección de texto en toda la terminal
            terminal.addEventListener('mouseup', function() {
                const selection = window.getSelection();
                if (selection.toString().length > 0) {
                    document.execCommand('copy');
                    showCopyNotification();
                }
            });
            
            // También permitir copiar con Ctrl+C cuando hay texto seleccionado
            document.addEventListener('keydown', function(e) {
                if (e.ctrlKey && e.key === 'c') {
                    const selection = window.getSelection();
                    if (selection.toString().length > 0) {
                        document.execCommand('copy');
                        showCopyNotification();
                        e.preventDefault();
                    }
                }
            });
        }
        
        // Mantener foco en el terminal
        document.addEventListener('click', function() {
            if (currentInputElement) {
                currentInputElement.focus();
            }
        });
        
        // Inicializar cuando la página carga
        window.addEventListener('load', init);