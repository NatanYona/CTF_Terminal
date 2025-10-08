// Variables globales
let currentLevel = 1;
let currentPath = '/CTF_Challenge/Inicio';
let commandHistory = [];
let historyIndex = -1;
let terminal = document.getElementById('terminal');
let currentInputElement;
let copyNotification = document.getElementById('copy-notification');
let konami_sequence = [];
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

// Variables que se cargarán desde JSON
let filesystem_level1 = {};
let filesystem_level2 = {};
let filesystem = {}; // Sistema de archivos actual

// Estado de permisos simulados para nivel 2
let permissionsState = {
    umask: '022',
    currentUser: 'student',
    currentGroup: 'students'
};

// Sistema de ayuda detallado (se mantiene en JS)
const commandHelp = {
    ls: {
        description: "Lista los archivos y directorios en el directorio actual",
        usage: "ls [directorio] [-a para archivos ocultos] [-l para formato largo]",
        examples: [
            "ls        # Lista el contenido del directorio actual",
            "ls Animales # Lista el contenido del directorio Animales",
            "ls -a     # Muestra archivos ocultos también",
            "ls -l     # Muestra permisos y propietarios (solo nivel 2)"
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
    chmod: {
        description: "Cambia los permisos de archivos y directorios (solo nivel 2)",
        usage: "chmod [permisos] archivo",
        examples: [
            "chmod 644 archivo.txt    # rw-r--r--",
            "chmod 755 directorio     # rwxr-xr-x",
            "chmod +x script.sh       # Agrega permisos de ejecución"
        ]
    },
    chown: {
        description: "Cambia el propietario de archivos (solo nivel 2)",
        usage: "chown usuario archivo",
        examples: [
            "chown student archivo.txt  # Cambia propietario a student"
        ]
    },
    chgrp: {
        description: "Cambia el grupo de archivos (solo nivel 2)",
        usage: "chgrp grupo archivo",
        examples: [
            "chgrp hackers archivo.txt  # Cambia grupo a hackers"
        ]
    },
    umask: {
        description: "Establece la máscara de permisos por defecto (solo nivel 2)",
        usage: "umask [valor]",
        examples: [
            "umask        # Muestra umask actual",
            "umask 037    # Establece umask a 037"
        ]
    },
    sort: {
        description: "Ordena las líneas de un archivo",
        usage: "sort archivo",
        examples: [
            "sort archivo_desordenado  # Ordena las líneas del archivo"
        ]
    },
    bash: {
        description: "Ejecuta un script de shell (solo nivel 2)",
        usage: "bash script.sh o ./script.sh",
        examples: [
            "bash verificador.sh  # Ejecuta el script verificador",
            "./verificador.sh     # Forma abreviada"
        ]
    },
    stat: {
        description: "Muestra información detallada de archivos (solo nivel 2)",
        usage: "stat [-c formato] archivo",
        examples: [
            "stat archivo.txt      # Información completa",
            "stat -c '%a' archivo  # Solo permisos en octal"
        ]
    },
    level: {
        description: "Cambia entre niveles del CTF",
        usage: "level [1|2]",
        examples: [
            "level 1   # Cambia al CTF de navegación",
            "level 2   # Cambia al CTF de permisos"
        ]
    },
    help: {
        description: "Muestra ayuda sobre los comandos disponibles",
        usage: "help [comando]",
        examples: [
            "help       # Muestra todos los comandos disponibles",
            "help cat   # Muestra ayuda detallada sobre el comando cat"
        ]
    }
};

// Función para cargar filesystem desde JSON
async function loadFilesystem() {
    try {
        const response = await fetch('filesystem.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fsData = await response.json();
        
        filesystem_level1 = fsData.level1;
        filesystem_level2 = fsData.level2;
        filesystem = filesystem_level1; // Inicializar con nivel 1
        
        console.log('✅ Filesystem cargado correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error cargando filesystem:', error);
        // Fallback mínimo para evitar errores
        loadFallbackFilesystem();
        return false;
    }
}

// Fallback en caso de error
function loadFallbackFilesystem() {
    filesystem_level1 = {
        'CTF_Challenge': {
            'type': 'directory',
            'children': {
                'Inicio': {
                    'type': 'directory',
                    'children': {
                        'error.txt': {
                            'type': 'file',
                            'content': 'Error: No se pudo cargar el filesystem. Verifica que data/filesystem.json exista.'
                        }
                    }
                }
            }
        }
    };
    filesystem_level2 = {
        'CTF_Permisos': {
            'type': 'directory',
            'children': {
                'Inicio': {
                    'type': 'directory',
                    'children': {
                        'error.txt': {
                            'type': 'file', 
                            'content': 'Error: Filesystem nivel 2 no disponible.'
                        }
                    }
                }
            }
        }
    };
    filesystem = filesystem_level1;
}

// Función para obtener el sistema de archivos actual
function getCurrentFilesystem() {
    return filesystem;
}

// Función para cambiar de nivel
function changeLevel(newLevel) {
    if (newLevel === 1) {
        currentLevel = 1;
        filesystem = filesystem_level1;
        currentPath = '/CTF_Challenge/Inicio';
        return `🔄 Cambiado al Nivel 1: CTF de Navegación y Exploración
Objetivo: Encuentra y reúne las piezas de la bandera final.`;
    } else if (newLevel === 2) {
        currentLevel = 2;
        filesystem = filesystem_level2;
        currentPath = '/CTF_Permisos/Inicio';
        permissionsState = {
            umask: '022',
            currentUser: 'student',
            currentGroup: 'students'
        };
        return `🔄 Cambiado al Nivel 2: CTF de Permisos
Objetivo: Resuelve los 5 desafíos y reúne los fragmentos.
Nuevos comandos: chmod, chown, chgrp, umask, sort, bash, stat
Comienza en: cd Desafio_chmod`;
    } else {
        return `❌ Nivel inválido. Usa 'level 1' o 'level 2'.`;
    }
}

// ========== FUNCIONES DEL SISTEMA DE ARCHIVOS (se mantienen igual) ==========

function checkPermissions(item, action = 'read') {
    if (currentLevel !== 2) return true;
    if (!item.permissions) return true;

    const perms = item.permissions;
    const owner = item.owner || permissionsState.currentUser;
    const group = item.group || permissionsState.currentGroup;

    let permIndex;
    if (owner === permissionsState.currentUser) {
        permIndex = 0;
    } else if (group === permissionsState.currentGroup) {
        permIndex = 1;
    } else {
        permIndex = 2;
    }

    const permBits = Number(perms[permIndex]);
    if (action === 'read' && (permBits & 4)) return true;
    if (action === 'write' && (permBits & 2)) return true;
    if (action === 'execute' && (permBits & 1)) return true;

    return false;
}

function formatPermissions(item) {
    if (currentLevel !== 2 || !item.permissions) return '';

    const perms = item.permissions;
    let result = item.type === 'directory' ? 'd' : '-';

    const owner = parseInt(perms[0]);
    result += (owner & 4) ? 'r' : '-';
    result += (owner & 2) ? 'w' : '-';
    result += (owner & 1) ? 'x' : '-';

    const group = parseInt(perms[1]);
    result += (group & 4) ? 'r' : '-';
    result += (group & 2) ? 'w' : '-';
    result += (group & 1) ? 'x' : '-';

    const others = parseInt(perms[2]);
    result += (others & 4) ? 'r' : '-';
    result += (others & 2) ? 'w' : '-';
    result += (others & 1) ? 'x' : '-';

    return result;
}

function getDirectoryAtPath(path) {
    const rootKey = currentLevel === 1 ? 'CTF_Challenge' : 'CTF_Permisos';
    const parts = path.replace(/^\/+/, '').split('/').filter(p => p);
    let current = getCurrentFilesystem();

    if (parts.length === 0) {
        return current[rootKey] ? current[rootKey].children : null;
    }

    if (parts[0] !== rootKey) {
        return null;
    }

    current = current[rootKey].children;
    
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        if (current[part] && current[part].type === 'directory') {
            current = current[part].children;
        } else {
            return null;
        }
    }

    return current;
}

function getParentDirectory(path) {
    const parts = path.replace(/^\/+/, '').split('/').filter(p => p);
    if (parts.length === 0) return null;
    
    if (parts.length === 1) {
        return currentLevel === 1 ? '/CTF_Challenge' : '/CTF_Permisos';
    }
    
    parts.pop();
    return '/' + parts.join('/');
}

function resolvePath(targetPath) {
    if (targetPath.startsWith('/')) {
        return targetPath;
    }

    const currentParts = currentPath.replace(/^\/+/, '').split('/').filter(p => p);
    const targetParts = targetPath.split('/').filter(p => p);

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

// ========== FUNCIÓN PARA EJECUTAR SCRIPTS (se mantiene igual) ==========

function executeScript(scriptName, content, currentDir) {
    let explanation = "";

    if (scriptName === 'llave_verificadora.sh' && currentPath.includes('Desafio_chmod')) {
        const puerta = currentDir['puerta_hierro.txt'];
        if (puerta && puerta.permissions === '644') {
            const parentPath = getParentDirectory(currentPath);
            const parentDir = getDirectoryAtPath(parentPath);
            if (parentDir) {
                parentDir['fragmento_1.txt'] = {
                    type: 'file',
                    content: 'CTF{L0S_P3RM1',
                    permissions: '644',
                    owner: permissionsState.currentUser,
                    group: permissionsState.currentGroup
                };
                explanation = "\n🔓 **Explicación:** Cambiaste los permisos de 'puerta_hierro.txt' de 000 a 644.";
                return '✅ Fragmento 1 creado: fragmento_1.txt' + explanation;
            }
        } else {
            return '❌ Los permisos deben ser exactamente 644. Usa: chmod 644 puerta_hierro.txt';
        }
    }

    if (scriptName === 'cetro_verificacion.sh' && currentPath.includes('Desafio_chown')) {
        const tesoro = currentDir['tesoro_rey.txt'];
        if (tesoro && tesoro.owner === 'student') {
            const parentPath = getParentDirectory(currentPath);
            const parentDir = getDirectoryAtPath(parentPath);
            if (parentDir) {
                parentDir['fragmento_2.txt'] = {
                    type: 'file',
                    content: 'S05_S0N_L4_',
                    permissions: '644',
                    owner: permissionsState.currentUser,
                    group: permissionsState.currentGroup
                };
                explanation = "\n👑 **Explicación:** Cambiaste el propietario de 'tesoro_rey.txt' a 'student'.";
                return '✅ Fragmento 2 creado: fragmento_2.txt' + explanation;
            }
        } else {
            return '❌ Usa: chown student tesoro_rey.txt';
        }
    }

    if (scriptName === 'sello_verificador.sh' && currentPath.includes('Desafio_chgrp')) {
        const pergamino = currentDir['pergamino_secreto.txt'];
        if (pergamino && pergamino.group === 'hackers') {
            const parentPath = getParentDirectory(currentPath);
            const parentDir = getDirectoryAtPath(parentPath);
            if (parentDir) {
                parentDir['fragmento_3.txt'] = {
                    type: 'file',
                    content: 'CL4V3_P4R4_',
                    permissions: '644',
                    owner: permissionsState.currentUser,
                    group: permissionsState.currentGroup
                };
                explanation = "\n🔐 **Explicación:** Cambiaste el grupo de 'pergamino_secreto.txt' a 'hackers'.";
                return '✅ Fragmento 3 creado: fragmento_3.txt' + explanation;
            }
        } else {
            return '❌ Usa: chgrp hackers pergamino_secreto.txt';
        }
    }

    if (scriptName === 'oraculo_verificador.sh' && currentPath.includes('Desafio_umask')) {
        const susurro = currentDir['susurro.txt'];
        if (susurro) {
            if (susurro.permissions === '640') {
                const parentPath = getParentDirectory(currentPath);
                const parentDir = getDirectoryAtPath(parentPath);
                if (parentDir) {
                    parentDir['fragmento_4.txt'] = {
                        type: 'file',
                        content: '3L_T3S0R0',
                        permissions: '644',
                        owner: permissionsState.currentUser,
                        group: permissionsState.currentGroup
                    };
                    explanation = "\n🔐 **Explicación:** Configuraste umask 037 antes de crear 'susurro.txt'.";
                    return '✅ Fragmento 4 creado: fragmento_4.txt' + explanation;
                }
            } else {
                return `❌ Permisos incorrectos: ${susurro.permissions} (deben ser 640).`;
            }
        } else {
            return '❌ Primero establece umask 037, luego crea susurro.txt con: echo umask_correcto > susurro.txt';
        }
    }

    if (scriptName === 'piedra_verificadora.sh' && currentPath.includes('Desafio_sort')) {
        const ordenado = currentDir['runas_ordenadas.txt'];
        if (ordenado) {
            const expected = '1-El\n2-desvela\n3-camino\n4-secreto\n5-final';
            if (ordenado.content.trim() === expected.trim()) {
                const parentPath = getParentDirectory(currentPath);
                const parentDir = getDirectoryAtPath(parentPath);
                if (parentDir) {
                    parentDir['fragmento_5.txt'] = {
                        type: 'file',
                        content: '_D3_L0S_H4CK3R5}',
                        permissions: '644',
                        owner: permissionsState.currentUser,
                        group: permissionsState.currentGroup
                    };
                    explanation = "\n📜 **Explicación:** Ordenaste correctamente las runas con 'sort'.";
                    return '✅ Fragmento 5 creado: fragmento_5.txt' + explanation;
                }
            } else {
                return '❌ Orden incorrecto';
            }
        } else {
            return '❌ Usa: sort runas_desordenadas.txt > runas_ordenadas.txt';
        }
    }

    return 'Script ejecutado' + explanation;
}

// ========== EASTER EGGS (se mantienen en JS) ==========

const easterEggs = {
    matrix: function () {
        let output = '<span class="matrix">Wake up, Neo...\n';
        for (let i = 0; i < 5; i++) {
            output += '01001000 01100001 01100011 01101011 01100101 01110010\n';
        }
        output += 'The Matrix has you... 💊</span>';
        return output;
    },

    coffee: function () {
        return `<span class="easter-egg">
            ( (
             ) )
          ........
          |      |]
          \\      /
           \`----'
☕ Error 418: I'm a teapot
But I can still make coffee for hackers!</span>`;
    },

    sudo: function (args) {
        const phrases = [
            "We trust you have received the usual lecture from the local System Administrator.",
            "Nice try, but you're not root here!",
            "With great power comes great electricity bill.",
            "sudo: unable to resolve host 'reality'",
            "Access denied. Have you tried turning it off and on again?"
        ];
        return `<span class="easter-egg">${phrases[Math.floor(Math.random() * phrases.length)]}</span>`;
    },

    'rm -rf /': function () {
        return `<span class="error">💀 ABORT! ABORT! ABORT! 💀
Just kidding... but don't try this at home!
Your data is safe... for now. 😈</span>`;
    },

    sl: function () {
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

    cowsay: function (args) {
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

    fortune: function () {
        const fortunes = [
            "A bug in the code is worth two in the documentation.",
            "There are only 10 types of people: those who understand binary and those who don't.",
            "Programming is 10% science, 20% ingenuity, and 70% getting the ingenuity to work with the science.",
            "Always code as if the person who ends up maintaining your code is a violent psychopath who knows where you live.",
            "The best thing about a boolean is even if you are wrong, you are only off by a bit."
        ];
        return `<span class="success">🥠 ${fortunes[Math.floor(Math.random() * fortunes.length)]}</span>`;
    },

    hack: function () {
        return `<span class="matrix">
🎭 INITIATING HACK SEQUENCE...
[████████████████████████████] 100%
Access granted to mainframe...
Bypassing firewall...
Downloading the_internet.zip...
💻 HACK COMPLETE! You are now 1337 h4x0r!</span>`;
    },

    debug: function () {
        const now = new Date();
        return `<span class="help-command">🐛 System Debug Information:
OS: HackerOS 13.37-leet edition
Current Level: ${currentLevel}
Current Path: ${currentPath}
Filesystem: ${currentLevel === 1 ? 'CTF_Challenge' : 'CTF_Permisos'}
Time: ${now.toLocaleString()}
Permissions State: ${JSON.stringify(permissionsState)}
Load average: 0.42, 1.33, 7.77</span>`;
    },

    konami: function () {
        return `<span class="matrix">
🎮 KONAMI CODE ACTIVATED! 🎮
↑↑↓↓←→←→BA

⭐ You've unlocked the secret hacker achievement! ⭐
+30 Lives, +1337 Points, +∞ Coffee</span>`;
    },

    Peque: function () {
        return `<span class="easter-egg">CTF{HICISTE_LAS_MOVIDAS_BIEN}</span>`;
    },
    
    nmap: function () {
        return `<span class="success">
Starting Nmap 7.92 ( https://nmap.org )
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00042s latency).

PORT      STATE    SERVICE
22/tcp    open     ssh
80/tcp    open     http
443/tcp   open     https
1337/tcp  open     waste
3306/tcp  filtered mysql
8080/tcp  open     http-proxy
31337/tcp open     🚪 BACKDOOR DETECTED! 🚪

⚠️  ALERT: Suspicious backdoor found on port 31337
🔓 Type 'backdoor' to investigate further...

Nmap done: 1 IP address (1 host up) scanned in 13.37 seconds</span>`;
    },

    backdoor: function () {
        return `<span class="matrix">
🚪 Accessing hidden backdoor...

[████████████████████████] 100%

🎭 BACKDOOR UNLOCKED!

You've discovered the secret passage...
Hidden message: "In the shadows of /etc, wisdom awaits"

Hint: Check .shadow_config in level 2 hidden directories
</span>`;
    },

    bsod: function () {
        const bsodDiv = document.createElement('div');
        bsodDiv.id = 'bsod-overlay';
        bsodDiv.innerHTML = `
            <div class="bsod-content">
                <h1>:(</h1>
                <p>Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</p>
                <p class="error-code">0% complete</p>
                <div class="error-details">
                    <p>If you'd like to know more, you can search online later for this error: HACKER_OVERLOAD_EXCEPTION</p>
                </div>
                <div class="qr-code">█████████<br>█&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;█<br>█&nbsp;███&nbsp;█<br>█&nbsp;███&nbsp;█<br>█&nbsp;███&nbsp;█<br>█&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;█<br>█████████</div>
            </div>
        `;
        document.body.appendChild(bsodDiv);

        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) progress = 100;
            const errorCode = bsodDiv.querySelector('.error-code');
            errorCode.textContent = `${Math.floor(progress)}% complete`;

            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    bsodDiv.remove();
                }, 500);
            }
        }, 200);

        return '';
    },

    whoami: function () {
        if (currentLevel === 2) {
            return `student
But are you really just a student? 🤔
Your true identity: Permission Manipulator
Achievement unlocked: Identity Crisis`;
        }
        return `${['Neo', 'Trinity', 'Morpheus', 'A script kiddie', 'The chosen one', 'Batman'][Math.floor(Math.random() * 6)]}`;
    }
};

// ========== COMANDOS PRINCIPALES (se mantienen en JS) ==========

const commands = {
    ls: function (args) {
        let showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
        let showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
        let targetPath = currentPath;

        const dirArg = args.find(arg => !arg.startsWith('-'));
        if (dirArg) {
            targetPath = resolvePath(dirArg);
        }

        const dir = getDirectoryAtPath(targetPath);
        if (!dir) {
            return 'ls: cannot access directory';
        }

        let items = Object.keys(dir).sort();
        if (!showHidden) {
            items = items.filter(item => !item.startsWith('.'));
        }

        if (items.length === 0) {
            return '';
        }

        return items.map(item => {
            const itemObj = dir[item];
            const isDir = itemObj.type === 'directory';
            const className = isDir ? 'directory' : 'file';
            const prefix = item.startsWith('.') ? '<span class="easter-egg">🕵️</span> ' : '';

            if (showLong && currentLevel === 2) {
                const perms = formatPermissions(itemObj);
                const owner = itemObj.owner || permissionsState.currentUser;
                const group = itemObj.group || permissionsState.currentGroup;
                return `${perms} ${owner} ${group} ${prefix}<span class="${className}">${item}</span>`;
            } else {
                return prefix + `<span class="${className}">${item}</span>`;
            }
        }).join(showLong ? '\n' : '  ');
    },

    cd: function (args) {
        if (args.length === 0) {
            const rootPath = currentLevel === 1 ? '/CTF_Challenge' : '/CTF_Permisos';
            currentPath = rootPath;
            return '';
        }

        const target = args[0];
        let newPath;

        if (target === '..') {
            const rootPath = currentLevel === 1 ? '/CTF_Challenge' : '/CTF_Permisos';
            if (currentPath === rootPath) {
                return '';
            }
            newPath = getParentDirectory(currentPath);
        } else if (target === '.') {
            return '';
        } else if (target.startsWith('/')) {
            const rootPath = currentLevel === 1 ? '/CTF_Challenge' : '/CTF_Permisos';
            if (!target.startsWith(rootPath)) {
                return 'bash: cd: permission denied';
            }
            newPath = target;
        } else {
            newPath = currentPath + (currentPath.endsWith('/') ? '' : '/') + target;
        }

        const targetDir = getDirectoryAtPath(newPath);
        if (!targetDir) {
            return `bash: cd: ${target}: No such file or directory`;
        }

        if (currentLevel === 2) {
            const parts = newPath.replace(/^\/+/, '').split('/');
            const dirName = parts[parts.length - 1];
            const parentPath = '/' + parts.slice(0, -1).join('/');
            const parentDir = getDirectoryAtPath(parentPath);

            if (parentDir && parentDir[dirName] && !checkPermissions(parentDir[dirName], 'execute')) {
                return `bash: cd: ${target}: Permission denied`;
            }
        }

        currentPath = newPath;
        return '';
    },

    pwd: function (args) {
        return currentPath;
    },

    cat: function (args) {
        if (args.length === 0) {
            return 'cat: missing file operand';
        }

        let output = '';
        for (const filename of args) {
            let filePath = filename;
            let targetDir = getDirectoryAtPath(currentPath);

            if (filename.includes('../') || filename.includes('..')) {
                const resolvedPath = resolvePath(filename);
                const pathParts = resolvedPath.split('/').filter(p => p);
                const fileName = pathParts.pop();
                const dirPath = '/' + pathParts.join('/');
                targetDir = getDirectoryAtPath(dirPath);
                filePath = fileName;
            }

            if (!targetDir || !targetDir[filePath]) {
                output += `cat: ${filename}: No such file or directory\n`;
                continue;
            }

            if (targetDir[filePath].type !== 'file') {
                output += `cat: ${filename}: Is a directory\n`;
                continue;
            }

            if (currentLevel === 2 && !checkPermissions(targetDir[filePath], 'read')) {
                output += `cat: ${filename}: Permission denied\n`;
                continue;
            }

            let content = targetDir[filePath].content;
            if (typeof content === 'string') {
                content = content.replace(/\n+$/, '');
            }
            output += content;
        }
        return output;
    },

    chmod: function (args) {
        if (currentLevel !== 2) {
            return 'chmod: command not available in this level';
        }

        if (args.length < 2) {
            return 'chmod: missing operand';
        }

        const perms = args[0];
        const filename = args[1];
        const dir = getDirectoryAtPath(currentPath);

        if (!dir || !dir[filename]) {
            return `chmod: cannot access '${filename}': No such file or directory`;
        }

        if (!/^[0-7]{3}$/.test(perms) && !/^[+-][rwx]+$/.test(perms)) {
            return `chmod: invalid mode: '${perms}'`;
        }

        if (/^[0-7]{3}$/.test(perms)) {
            dir[filename].permissions = perms;
        } else {
            const currentPerms = dir[filename].permissions || '644';
            let newPerms = parseInt(currentPerms, 8);

            if (perms.includes('+x')) {
                newPerms |= 0o111;
            }

            dir[filename].permissions = newPerms.toString(8).padStart(3, '0');
        }

        return '';
    },

    chown: function (args) {
        if (currentLevel !== 2) {
            return 'chown: command not available in this level';
        }

        if (args.length < 2) {
            return 'chown: missing operand';
        }

        const owner = args[0];
        const filename = args[1];
        const dir = getDirectoryAtPath(currentPath);

        if (!dir || !dir[filename]) {
            return `chown: cannot access '${filename}': No such file or directory`;
        }

        if (owner !== permissionsState.currentUser && owner !== 'root') {
            return `chown: invalid user: '${owner}'`;
        }

        dir[filename].owner = owner;
        return '';
    },

    chgrp: function (args) {
        if (currentLevel !== 2) {
            return 'chgrp: command not available in this level';
        }

        if (args.length < 2) {
            return 'chgrp: missing operand';
        }

        const group = args[0];
        const filename = args[1];
        const dir = getDirectoryAtPath(currentPath);

        if (!dir || !dir[filename]) {
            return `chgrp: cannot access '${filename}': No such file or directory`;
        }

        const validGroups = ['student', 'hackers', 'users', 'guardias', 'students'];
        if (!validGroups.includes(group)) {
            return `chgrp: invalid group: '${group}'`;
        }

        dir[filename].group = group;
        return '';
    },

    umask: function (args) {
        if (currentLevel !== 2) {
            return 'umask: command not available in this level';
        }

        if (args.length === 0) {
            return permissionsState.umask;
        }

        const newUmask = args[0];
        if (!/^[0-7]{3}$/.test(newUmask)) {
            return `umask: invalid mode: '${newUmask}'`;
        }

        permissionsState.umask = newUmask;
        return '';
    },

    sort: function (args) {
        if (args.length === 0) {
            return 'sort: missing file operand';
        }

        const filename = args[0];
        const dir = getDirectoryAtPath(currentPath);

        if (!dir || !dir[filename]) {
            return `sort: cannot read: ${filename}: No such file or directory`;
        }

        if (dir[filename].type !== 'file') {
            return `sort: ${filename}: Is a directory`;
        }

        if (currentLevel === 2 && !checkPermissions(dir[filename], 'read')) {
            return `sort: ${filename}: Permission denied`;
        }

        const content = dir[filename].content;
        const lines = content.split('\n');
        return lines.sort().join('\n');
    },

    bash: function (args) {
        if (currentLevel !== 2) {
            return 'bash: command not available in this level';
        }

        if (args.length === 0) {
            return 'bash: missing script file';
        }

        const scriptName = args[0];
        const dir = getDirectoryAtPath(currentPath);

        if (!dir || !dir[scriptName]) {
            return `bash: ${scriptName}: No such file or directory`;
        }

        const script = dir[scriptName];

        if (script.type !== 'file') {
            return `bash: ${scriptName}: Is a directory`;
        }

        if (!script.executable && !checkPermissions(script, 'execute')) {
            return `bash: ${scriptName}: Permission denied`;
        }

        return executeScript(scriptName, script.content, dir);
    },

    stat: function (args) {
        if (currentLevel !== 2) {
            return 'stat: command not available in this level';
        }

        if (args.length === 0) {
            return 'stat: missing operand';
        }

        const filename = args[args.length - 1];
        const dir = getDirectoryAtPath(currentPath);

        if (!dir || !dir[filename]) {
            return `stat: cannot stat '${filename}': No such file or directory`;
        }

        const item = dir[filename];
        const perms = item.permissions || '644';

        if (args.includes('-c') && args.includes('%a')) {
            return perms;
        }

        return `File: ${filename}
Size: 0    Permissions: (0${perms}/${formatPermissions(item)})
Access: ${item.owner || permissionsState.currentUser}  Group: ${item.group || permissionsState.currentGroup}`;
    },

    level: function (args) {
        if (args.length === 0) {
            return `Current level: ${currentLevel}
Available levels:
  1 - CTF de Navegación y Exploración
  2 - CTF de Permisos y Criptografía`;
        }

        const targetLevel = parseInt(args[0]);
        if (targetLevel !== 1 && targetLevel !== 2) {
            return 'level: invalid level. Use 1 or 2';
        }

        if (targetLevel === currentLevel) {
            return `Already in level ${currentLevel}`;
        }

        return changeLevel(targetLevel);
    },

    more: function (args) {
        if (args.length === 0) {
            return 'more: missing file operand';
        }
        return commands.cat(args);
    },

    less: function (args) {
        return commands.more(args);
    },

    mkdir: function (args) {
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

        let permissions = '755';
        if (currentLevel === 2) {
            const umask = parseInt(permissionsState.umask, 8);
            const defaultPerms = 0o777;
            const finalPerms = defaultPerms & ~umask;
            permissions = finalPerms.toString(8);
        }

        dir[dirname] = {
            type: 'directory',
            children: {},
            permissions: permissions
        };

        return '';
    },

    mv: function (args) {
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

        const resolvedDestPath = resolvePath(dest);
        const destDirPath = getParentDirectory(resolvedDestPath);
        const destName = resolvedDestPath.split('/').pop();

        let destDir;
        if (destDirPath) {
            destDir = getDirectoryAtPath(destDirPath);
        } else {
            destDir = currentDir;
        }

        if (destDir && destDir[destName] && destDir[destName].type === 'directory') {
            destDir[destName].children[source] = currentDir[source];
            delete currentDir[source];
            return '';
        }

        if (destDir) {
            destDir[destName] = currentDir[source];
            delete currentDir[source];
        } else {
            return `mv: cannot move to '${dest}': No such file or directory`;
        }

        return '';
    },

    rm: function (args) {
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

    echo: function (args) {
        return args.join(' ');
    },

    clear: function (args) {
        terminal.innerHTML = '';
        return '';
    },

    help: function (args) {
        if (args.length === 0) {
            let helpText = `<span class="help-title">Comandos disponibles (Nivel ${currentLevel}):</span>\n`;

            const basicCommands = ['ls', 'cd', 'pwd', 'cat', 'mkdir', 'mv', 'rm', 'echo', 'clear', 'help', 'level'];
            const level2Commands = ['chmod', 'chown', 'chgrp', 'umask', 'sort', 'bash', 'stat'];

            basicCommands.forEach(cmd => {
                if (commandHelp[cmd]) {
                    helpText += `<span class="help-command">${cmd}</span> - ${commandHelp[cmd].description}\n`;
                }
            });

            if (currentLevel === 2) {
                helpText += `\n<span class="help-title">Comandos de permisos (Nivel 2):</span>\n`;
                level2Commands.forEach(cmd => {
                    if (commandHelp[cmd]) {
                        helpText += `<span class="help-command">${cmd}</span> - ${commandHelp[cmd].description}\n`;
                    }
                });
            }

            helpText += `\n<span class="help-description">Usa 'help [comando]' para obtener más información sobre un comando específico.</span>`;
            helpText += `\n<span class="easter-egg">💡 Pista: Los hackers curiosos exploran archivos ocultos con 'ls -a'...</span>`;
            return helpText;
        } else {
            const cmd = args[0];
            if (commandHelp[cmd]) {
                let helpText = `<span class="help-title">Comando: ${cmd}</span>\n`;
                helpText += `<span class="help-description">${commandHelp[cmd].description}</span>\n\n`;
                helpText += `<span class="help-title">Uso:</span>\n`;
                helpText += `<span class="help-command">${commandHelp[cmd].usage}</span>\n\n`;

                if (commandHelp[cmd].examples && commandHelp[cmd].examples.length > 0) {
                    helpText += `<span class="help-title">Ejemplos:</span>\n`;
                    commandHelp[cmd].examples.forEach(example => {
                        helpText += `<span class="help-command">${example}</span>\n`;
                    });
                }
                return helpText;
            } else {
                return `No hay ayuda disponible para el comando '${cmd}'.`;
            }
        }
    },

    reset: function (args) {
        currentLevel = 1;
        filesystem = filesystem_level1;
        currentPath = '/CTF_Challenge/Inicio';
        commandHistory = [];
        historyIndex = -1;
        terminal.innerHTML = '';
        permissionsState = {
            umask: '022',
            currentUser: 'student',
            currentGroup: 'students'
        };
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
    debug: easterEggs.debug,
    Peque: easterEggs.Peque,
    nmap: easterEggs.nmap,
    bsod: easterEggs.bsod,
    konami: easterEggs.konami,
    whoami: easterEggs.whoami,
    backdoor: easterEggs.backdoor
};

// ========== FUNCIONES DE LA TERMINAL (se mantienen igual) ==========

function handleRedirection(fullCommand) {
    const redirectOutIndex = fullCommand.indexOf('>');
    const redirectAppendIndex = fullCommand.indexOf('>>');

    if (redirectAppendIndex !== -1) {
        const commandPart = fullCommand.substring(0, redirectAppendIndex).trim();
        const filePart = fullCommand.substring(redirectAppendIndex + 2).trim();

        const output = executeCommand(commandPart, false);

        let targetDir = getDirectoryAtPath(currentPath);
        let targetFile = filePart;

        if (filePart.includes('../') || filePart.includes('..')) {
            const resolvedPath = resolvePath(filePart);
            const pathParts = resolvedPath.split('/').filter(p => p);
            targetFile = pathParts.pop();
            const dirPath = '/' + pathParts.join('/');
            targetDir = getDirectoryAtPath(dirPath);
        }

        if (!targetDir) {
            return 'Error: cannot access directory';
        }

        if (targetDir[targetFile]) {
            if (targetDir[targetFile].type === 'file') {
                targetDir[targetFile].content += output;
            } else {
                return `Error: ${targetFile} is a directory`;
            }
        } else {
            targetDir[targetFile] = {
                type: 'file',
                content: output,
                permissions: '644'
            };
        }

        return '';
    } else if (redirectOutIndex !== -1) {
        const commandPart = fullCommand.substring(0, redirectOutIndex).trim();
        const filePart = fullCommand.substring(redirectOutIndex + 1).trim();

        const output = executeCommand(commandPart, false);

        let targetDir = getDirectoryAtPath(currentPath);
        let targetFile = filePart;

        if (filePart.includes('../') || filePart.includes('..')) {
            const resolvedPath = resolvePath(filePart);
            const pathParts = resolvedPath.split('/').filter(p => p);
            targetFile = pathParts.pop();
            const dirPath = '/' + pathParts.join('/');
            targetDir = getDirectoryAtPath(dirPath);
        }

        if (!targetDir) {
            return 'Error: cannot access directory';
        }

        let permissions = '644';
        if (currentLevel === 2) {
            const umask = parseInt(permissionsState.umask, 8);
            const defaultPerms = 0o666;
            const finalPerms = defaultPerms & ~umask;
            permissions = finalPerms.toString(8);
        }

        targetDir[targetFile] = {
            type: 'file',
            content: output,
            permissions: permissions
        };

        return '';
    }

    return null;
}

function executeCommand(input, showOutput = true) {
    if (input.trim() === 'rm -rf /') {
        return easterEggs['rm -rf /']();
    }

    if (input.trim().startsWith('./')) {
        const scriptName = input.trim().substring(2);
        return commands.bash([scriptName]);
    }

    const redirectResult = handleRedirection(input);
    if (redirectResult !== null) {
        return redirectResult;
    }

    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    if (command === '') return '';

    if (commands[command]) {
        return commands[command](args);
    } else {
        const funnyCommands = [
            'vim', 'nano', 'emacs', 'exit', 'logout', 'shutdown', 'reboot',
            'whoami', 'id', 'uname', 'ps', 'top', 'htop', 'free', 'df',
            'mount', 'umount', 'ssh', 'scp', 'rsync', 'wget', 'curl',
            'ping', 'traceroute', 'netstat', 'ifconfig', 'iptables'
        ];

        if (funnyCommands.includes(command)) {
            const responses = {
                'vim': 'vim: command found, but how do you exit? 😈\nPress ESC then type :q! (just kidding, this is fake vim)',
                'nano': 'nano: too mainstream for 1337 hackers. Try vim!',
                'emacs': 'emacs: Great OS, terrible editor.',
                'exit': 'exit: There is no escape from the CTF! Muahahaha!',
                'logout': 'logout: You can check out any time you like, but you can never leave...',
                'shutdown': 'shutdown: Nice try! But this terminal runs on pure caffeine ☕',
                'reboot': 'reboot: Error 404: Physical hardware not found',
                'whoami': `You are: ${['Neo', 'Trinity', 'Morpheus', 'A script kiddie', 'The chosen one', 'Batman'][Math.floor(Math.random() * 6)]}`,
                'id': 'uid=1337(hacker) gid=31337(elite) groups=31337(elite),42(answer),69(nice)',
                'uname': 'HackerOS 13.37.0-leet #42-Ubuntu SMP Wed Apr 1 13:37:00 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux'
            };

            return `<span class="easter-egg">${responses[command] || 'Command recognized but not implemented in this CTF environment!'}</span>`;
        }

        return `bash: ${command}: command not found`;
    }
}

function writeToTerminal(text, newLine = true, animated = true) {
    let className = '';
    if (text.includes('cannot') || text.includes('Error') || text.includes('missing') || text.includes('No such') || text.includes('denied')) {
        className = 'error';
    } else if (text.includes('CTF{') || text.includes('success') || text.includes('Felicidades') || text.includes('✅')) {
        className = 'success';
    } else if (text.includes('💡') || text.includes('🎉') || text.includes('❌')) {
        className = 'help-command';
    }
    
    const wrappedText = className ? `<span class="${className}">${text}</span>` : text;
    const finalText = wrappedText + (newLine ? '' : '');
    
    const shouldAnimate = animated && (
        text.includes('CTF{') || 
        text.includes('✅') || 
        text.includes('Fragmento') ||
        text.includes('Explicación') ||
        text.length > 100
    );
    
    if (shouldAnimate) {
        typewriterEffect(finalText, null, 7);
    } else {
        terminal.innerHTML += finalText + (newLine ? '\n' : '');
        terminal.scrollTop = terminal.scrollHeight;
    }
}

function typewriterEffect(text, callback, speed = 20) {
    let i = 0;
    const tempDiv = document.createElement('div');
    tempDiv.style.display = 'inline';
    terminal.appendChild(tempDiv);
    
    function type() {
        if (i < text.length) {
            const char = text.charAt(i);
            if (char === '<') {
                const closeTag = text.indexOf('>', i);
                if (closeTag !== -1) {
                    tempDiv.innerHTML += text.substring(i, closeTag + 1);
                    i = closeTag + 1;
                } else {
                    tempDiv.innerHTML += char;
                    i++;
                }
            } else {
                tempDiv.innerHTML += char;
                i++;
            }
            terminal.scrollTop = terminal.scrollHeight;
            setTimeout(type, speed);
        } else {
            tempDiv.innerHTML += '\n';
            if (callback) callback();
        }
    }
    
    type();
}

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

function getPrompt() {
    const rootPath = currentLevel === 1 ? '/CTF_Challenge' : '/CTF_Permisos';
    const shortPath = currentPath.replace(rootPath, '~');
    const funnyIPs = ['127.0.0.1', '192.168.1.42', '10.0.0.1337', '172.16.13.37'];
    const randomIP = funnyIPs[Math.floor(Math.random() * funnyIPs.length)];
    const levelIndicator = currentLevel === 1 ? 'nav' : 'perms';
    return `<span style="color: #00ff00;">hacker@ctf-${levelIndicator}-${randomIP.replace(/\./g, '-')}</span>:${shortPath}$ `;
}

function processCommand(command) {
    const output = executeCommand(command);
    if (output) {
        writeToTerminal(output);
    }

    if (command.trim()) {
        commandHistory.push(command);
        historyIndex = commandHistory.length;
    }

    currentInputElement = createInputLine();
    setupInputHandlers();
}

function setupInputHandlers() {
    currentInputElement.addEventListener('keydown', function (e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'].includes(e.code)) {
            handleKonamiCode(e.code);
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.textContent;

            const cursor = this.nextElementSibling;
            if (cursor) cursor.remove();
            this.contentEditable = false;

            processCommand(command);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                this.textContent = commandHistory[historyIndex];
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
                const commandMatches = Object.keys(commands).filter(cmd =>
                    cmd.startsWith(lastPart)
                );

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

function showCopyNotification() {
    if (copyNotification) {
        copyNotification.style.display = 'block';
        setTimeout(() => {
            copyNotification.style.display = 'none';
        }, 2000);
    }
}

// ========== INICIALIZACIÓN ==========

function init() {
    writeToTerminal('HackerOS 13.37-leet Multi-Level CTF Terminal (GNU/Linux 5.4.0-42-generic x86_64)');
    writeToTerminal('');
    writeToTerminal('🧠 Welcome to the Multi-Level CTF Challenge, hacker...');
    writeToTerminal('Last login: ' + new Date().toString().substring(0, 24) + ' from 192.168.1.337');
    writeToTerminal('System load: 1.337  Processes: 42  Users logged in: 1337');
    writeToTerminal('Memory usage: 13%   IP address: 127.0.0.1   Swap usage: 0%');
    writeToTerminal('');
    writeToTerminal(`<span class="success">🎯 Current Level: ${currentLevel} - CTF de Navegación y Exploración</span>`);
    writeToTerminal('<span class="easter-egg">💡 Tip: Try "help" for commands, "level 2" to access the permissions challenge...</span>');
    writeToTerminal('');

    currentInputElement = createInputLine();
    setupInputHandlers();

    if (terminal) {
        terminal.addEventListener('mouseup', function () {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                document.execCommand('copy');
                showCopyNotification();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
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
document.addEventListener('click', function () {
    if (currentInputElement) {
        currentInputElement.focus();
    }
});

// Inicializar cuando la página carga
window.addEventListener('load', async function() {
    // Cargar filesystem primero, luego inicializar
    await loadFilesystem();
    init();
});
