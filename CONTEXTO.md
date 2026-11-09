# 📄 Contexto del Proyecto: El Gritón — Lotería Mexicana Tradicional

## 1. Propósito del Proyecto
Aplicación web progresiva (**PWA**) diseñada específicamente para actuar como **"El Gritón" (cantador de cartas)** en partidas presenciales de **Lotería Mexicana** donde los jugadores utilizan **tablas físicas impresas tradicionales**.

La aplicación cumple dos funciones centrales:
1. **Cantar las 54 cartas tradicionales** con voz en español (Text-to-Speech) utilizando **múltiples dichos populares y tradicionales aleatorios** por carta.
2. **Mostrar en vivo la Mesa de Cartas Cantadas**, permitiendo ver todas las cartas que ya salieron (con su imagen original de Don Clemente) para revisar rápidamente cualquier tabla física cuando alguien grita *"¡Lotería!"*.

---

## 2. Arquitectura y Estructura de Archivos

```text
g:\loteria mexicana\
├── index.html       # Estructura principal: Escenario del Gritón, Mesa de Cartas Cantadas y Modales
├── styles.css       # Diseño festivo mexicano (papel picado, animación 3D de carta, cuadrícula responsiva)
├── cards.js         # Base de datos de las 54 cartas (ID, nombre, imagen y 4 dichos por carta = 216 dichos)
├── app.js           # Motor del juego: barajeo Fisher-Yates, TTS en español, temporizador, Wake Lock y buscador
├── manifest.json    # Manifiesto Web App para instalar en celulares Android / iOS a pantalla completa
├── sw.js            # Service Worker para caché offline de las 54 imágenes y carga instantánea en móvil
├── .nojekyll        # Archivo para despliegue directo en GitHub Pages sin preprocesamiento Jekyll
├── README.md        # Resumen general del repositorio
├── CONTEXTO.md      # Este documento de contexto técnico y funcional
└── cartas/          # Imágenes tradicionales de la Lotería Mexicana (Don Clemente)
    ├── 0.PNG        # Portada / reverso de la carta
    └── 1.jpg..54.jpg# Las 54 cartas numeradas del 1 (El Gallo) al 54 (La Rana)
```

---

## 3. Funcionalidades Clave Implementadas

### 3.1. Sistema de Dichos Aleatorios Alternados (`pickRandomDicho`)
- Cada una de las 54 cartas en `cards.js` cuenta con un arreglo `dichos` de **4 versos tradicionales**.
- Al salir una carta, `app.js` selecciona un dicho al azar excluyendo el índice usado en la corrida inmediata anterior (`lastDichoIdxMap`), garantizando que los versos varíen entre partidas.
- Incluye el botón **`🎲 Otro dicho`** para cambiar y cantar otro verso de la carta actual en cualquier momento.

### 3.2. Voz Cantada (Web Speech API) y Efectos (Web Audio API)
- Prioriza voces nativas en español (`es-MX`, `es-US`, `es-419`, `es-ES`).
- Permite 3 estilos de canto:
  - **Dicho Aleatorio + Nombre** (ej. *"El que le cantó a San Pedro no le volverá a cantar... ¡El Gallo!"*)
  - **Solo el Nombre** (para partidas rápidas)
  - **Solo el Dicho (Modo Adivinanza)**: difumina temporalmente la imagen de la carta durante 3.4 segundos para que los jugadores adivinen qué carta es escuchando el verso.
- Efectos de sonido sintetizados con `AudioContext` (sin depender de archivos MP3 externos): volteo de carta, barajeo y fanfarria de ganador.

### 3.3. Modo Automático Inteligente y Modo Manual
- En **Modo Automático**, el temporizador visual espera a que el sintetizador de voz termine de pronunciar el dicho antes de iniciar la cuenta regresiva hacia la siguiente carta (`2.5s`, `4.5s`, `7s` o `10s`).
- Atajos de teclado:
  - `Espacio` / `Flecha Derecha`: Sacar siguiente carta.
  - `P`: Iniciar / Pausar modo automático.
  - `R`: Repetir el grito de la carta actual.
  - `L`: Pausar por **¡LOTERÍA!** y abrir el resumen de cartas cantadas.

### 3.4. Mesa de Cartas Cantadas y Verificación Rápida
- Muestra en tiempo real todas las cartas que ya salieron con su imagen tradicional y el número de turno (`#1`, `#2`, etc.).
- Permite ordenar por:
  - **Últimas que salieron** (la más reciente primero).
  - **Por Número (1 - 54)** (ideal para cotejar contra una tabla impresa).
  - **Ver las 54** (resalta las que ya salieron y atenúa las que faltan).
- **Buscador instantáneo**: al escribir el nombre o número de una carta, muestra una alerta verde (`✅ SÍ SALIÓ`) o roja (`❌ AÚN NO SALE`).

### 3.5. Optimización para Celulares (PWA + Screen Wake Lock)
- Implementa `navigator.wakeLock.request('screen')` para impedir que la pantalla del teléfono se apague mientras se están cantando las cartas.
- Incluye `manifest.json` y Service Worker (`sw.js`) para instalarse en la pantalla de inicio de Android/iPhone y funcionar incluso sin conexión.
