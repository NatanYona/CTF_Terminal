# Terminal CTF - Guía para Profesores 🎓

## 📋 Descripción General

Este Terminal CTF es una herramienta educativa interactiva que simula un entorno Linux para enseñar comandos básicos de terminal mientras los estudiantes resuelven un reto de Capture The Flag (CTF). Además, incluye easter eggs ocultos que fomentan la curiosidad y el pensamiento crítico.

## 🎯 Objetivos Educativos

### Principales:
- **Familiarización con comandos Linux básicos** (`ls`, `cd`, `cat`, `mv`, `mkdir`, `rm`)
- **Navegación por sistema de archivos** (rutas absolutas y relativas)
- **Resolución de problemas** mediante exploración y análisis
- **Pensamiento lógico** para reconstruir la bandera del CTF

### Secundarios (Easter Eggs):
- **Cultura informática e historia** de sistemas Unix/Linux
- **Curiosidad y exploración** más allá de lo obvio
- **Investigación independiente** y experimentación
- **Conocimiento de la comunidad hacker/maker**

## 🚀 Cómo Usar en el Aula

### Configuración Inicial:
1. Abra el archivo `index.html` en cualquier navegador web
2. No requiere instalación ni conexión a internet
3. Funciona en cualquier dispositivo (PC, tablet, móvil)

### Instrucciones para Estudiantes:
```bash
# Comandos básicos para comenzar
help          # Ver comandos disponibles
pwd           # Ver ubicación actual
ls            # Listar archivos y carpetas
cd [carpeta]  # Cambiar de directorio
cat [archivo] # Ver contenido de archivos
```

### Estructura del CTF:
```
/CTF_Challenge/
├── Inicio/
│   └── introduccion_ctf.txt    # Instrucciones del reto
├── Docs/
│   ├── instrucciones.txt       # Pasos para resolver
│   ├── flag.txt               # Primera parte: "CTF{HICISTE_"
│   ├── pista.txt              # Pista sobre organismos modelo
│   └── notas.txt              # Advertencias sobre trampas
├── Animales/
│   ├── raton.txt              # "LAS_MOVIDAS_" ✓
│   ├── conejo.txt             # "LOS_SALTOS_" ✗
│   ├── murcielago.txt         # "LOS_VUELOS_" ✗
│   └── zorro.txt              # "LAS_TRAMPAS_" ✗
└── Frutas/
    ├── bananas.txt            # "BIEN}" ✓
    ├── kiwi.txt               # "MAL}" ✗
    ├── manzana.txt            # "BUENAS}" ✗
    └── uva.txt                # "CORRECTAS}" ✗
```

### Solución del CTF:
1. **Leer instrucciones** en `Docs/instrucciones.txt`
2. **Crear directorio** nuevo: `mkdir solucion`
3. **Mover archivos correctos**:
   - `mv ../Docs/flag.txt solucion/`
   - `mv ../Animales/raton.txt solucion/`
   - `mv ../Frutas/bananas.txt solucion/`
4. **Concatenar contenido**: `cat flag.txt raton.txt bananas.txt`
5. **Bandera final**: `CTF{HICISTE_LAS_MOVIDAS_BIEN}`

## 🎭 Easter Eggs y Comandos Ocultos

### 🔍 Cómo los Estudiantes los Descubren

#### 1. Exploración de Archivos Ocultos
```bash
# Los archivos que empiezan con punto están ocultos
ls -a    # Muestra archivos ocultos
```

**Archivos ocultos incluidos:**
- `Inicio/.secret_readme.txt` → Mensaje oculto con pistas sobre `matrix`, `coffee` y el **Konami Code**.
- `Docs/.env` → Variables de configuración ficticias del "sistema" (versión, kernel, usuario, etc.).
- `Animales/.dinosaur.txt` → Mensaje secreto con humor sobre dinosaurios y fechas Unix.
- `.hidden/secrets.txt` → Lista de comandos ocultos/easter eggs disponibles.

#### 2. Pistas Crípticas en el Contenido
Los archivos ocultos contienen referencias sutiles:
- `.secret_readme.txt`: Menciona `matrix`, `coffee` y el **Konami Code**.
- `.env`: Incluye un `SECRET_SOUCE` con la frase "*The cake is a lie*"
- `.dinosaur.txt`: Guiño a archivos antiguos con fecha de 1970.
- `secrets.txt`: Lista comandos como `sl`, `cowsay`, `fortune`, `hack`, `debug`, etc.

### 🎮 Comandos Easter Egg Disponibles

#### `matrix`
```bash
matrix
```
**Efecto:** Muestra el efecto Matrix con código binario y mensajes de Neo
**Propósito educativo:** Referencia cultural a la película Matrix y programación

#### `coffee`
```bash
coffee
```
**Efecto:** Arte ASCII de una taza de café con mensaje sobre HTTP 418
**Propósito educativo:** Historia de protocolos web y humor en RFC

#### `sl`
```bash
sl
```
**Efecto:** Tren ASCII clásico de Unix
**Propósito educativo:** Historia de comandos Unix y tradiciones de desarrolladores

#### `cowsay [mensaje]`
```bash
cowsay Hola estudiantes
cowsay
```
**Efecto:** Vaca ASCII que "habla" el mensaje
**Propósito educativo:** Comando real de Linux usado para diversión

#### `sudo [comando]`
```bash
sudo ls
sudo hack_the_world
```
**Efecto:** Mensajes divertidos sobre permisos de administrador
**Propósito educativo:** Concepto de permisos en sistemas Unix/Linux

#### `fortune`
```bash
fortune
```
**Efecto:** Frases aleatorias relacionadas con programación
**Propósito educativo:** Comando clásico de Unix para mensajes del día

#### `hack`
```bash
hack
```
**Efecto:** Simulador de "hackeo" con barra de progreso
**Propósito educativo:** Desmitificar el concepto de hacking

#### `debug`
```bash
debug
```
**Efecto:** Información detallada del "sistema"
**Propósito educativo:** Comandos de diagnóstico en sistemas reales

#### Código Konami
**Secuencia:** `↑↑↓↓←→←→BA`
**Efecto:** Mensaje especial de logro desbloqueado
**Propósito educativo:** Historia de los videojuegos y códigos secretos

### 🛠️ Comandos Falsos (Respuestas Divertidas)
Estos comandos dan respuestas educativas/divertidas:
- `vim`, `nano`, `emacs` - Bromas sobre editores de texto
- `ssh`, `ping`, `wget` - Explicaciones sobre redes
- `ps`, `top`, `free` - Información sobre procesos y memoria
- `exit`, `logout` - Mensajes sobre no poder "salir" del CTF

## 📚 Sugerencias Didácticas

### Nivel Principiante (30-45 minutos):
1. **Introducción a la terminal** (10 min)
2. **Comandos básicos** (`ls`, `cd`, `pwd`) (15 min)
3. **Resolución del CTF principal** (20 min)

### Nivel Intermedio (60-90 minutos):
1. Todo lo anterior
2. **Exploración libre** para encontrar easter eggs (30 min)
3. **Discusión grupal** sobre descubrimientos (15 min)

### Actividades Complementarias:
- **Competencia de easter eggs**: ¿Quién encuentra más comandos ocultos?
- **Investigación histórica**: Buscar la historia real de `sl`, `cowsay`, etc.
- **Creación de pistas**: Que los estudiantes diseñen sus propios acertijos
- **Presentaciones**: Que expliquen los easter eggs que encontraron

## 🎯 Evaluación y Seguimiento

### Criterios de Evaluación:
- **Básico**: Completar el CTF principal (bandera correcta)
- **Intermedio**: Encontrar al menos 3 easter eggs
- **Avanzado**: Explicar las referencias culturales/históricas
- **Experto**: Proponer nuevos easter eggs o mejoras

### Indicadores de Aprendizaje:
✅ **Navega** eficientemente por directorios  
✅ **Usa** comandos de terminal con confianza  
✅ **Muestra** curiosidad explorando más allá de lo requerido  
✅ **Conecta** pistas para resolver problemas  
✅ **Demuestra** conocimiento de cultura informática  

## 🔧 Personalización para Profesores

### Modificar el CTF:
- Cambiar nombres de archivos en la estructura
- Modificar el contenido de la bandera final
- Agregar más directorios o archivos señuelo

### Agregar Easter Eggs:
```javascript
// En la sección easterEggs del código
miComando: function() {
    return `<span class="easter-egg">Tu mensaje aquí</span>`;
}
```

### Cambiar Mensajes:
- Mensajes de inicio del sistema
- Respuestas de comandos
- Contenido de archivos ocultos

## 📝 Notas Adicionales

- **Sin conexión a internet**: Funciona completamente offline
- **Multiplataforma**: Compatible con todos los navegadores modernos
- **Accesible**: Texto seleccionable y copiable
- **Seguro**: No ejecuta código real del sistema
- **Portable**: Un solo archivo HTML

## 🎉 Extensiones Sugeridas

1. **CTF temáticos**: Crear versiones con temas específicos (ciencias, historia, literatura)
2. **Niveles de dificultad**: Versiones más complejas con más directorios
3. **Multijugador**: Versión donde varios estudiantes colaboran
4. **Modo profesor**: Panel de administración para ver progreso

## 📞 Soporte y Contribuciones

¿Encontraste un bug o tienes una idea para mejorarlo? 
- Los estudiantes pueden usar `debug` para reportar información del sistema
- Los easter eggs son una excelente forma de mantener el engagement
- La gamificación aumenta significativamente la retención de conocimientos

---

**¡Que disfruten explorando el mundo de la terminal! 🐧**