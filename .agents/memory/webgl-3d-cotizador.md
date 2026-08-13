---
name: WebGL / coche holográfico del cotizador
description: El coche 3D WebGL fue rechazado y sustituido por ilustraciones x-ray + halos; limitaciones WebGL del entorno
---

- **DECISIÓN (13 ago 2026, el usuario oscila): 3D v3 + fallback, NO borrar nada sin confirmar.** Historia: rechazó 3D v1 ("robótico") → pidió 3D con 5 specs (v2 perfiles por tipo) → lo llamó "genérico" y pidió el aspecto de las ilustraciones AI → se hizo v3 (modelo base paramétrico único, motor/chasis/suspensión detallados) → volvió a pedir las ilustraciones ("no has hecho nada") → al quitar el 3D dijo "ha quedado fatal, vuélvelo a 3D". Estado actual: HoloCar3D v3 activo con HoloCarXray como fallback/error boundary; three/* instalado. **Lección: ante cualquier nueva queja sobre el coche del cotizador, preguntar con AskQuestion (¿3D interactivo o ilustraciones?) antes de tocar código, y nunca borrar HoloCar3D ni las ilustraciones — se alternan.** También rechazó (13 ago 2026) el pulido "más realista" del 3D (esculpido de la carrocería + retrovisores/parrilla): pidió revertirlo el mismo día — el 3D v3 tal cual quedó en git es la referencia estable; cambios estéticos solo pequeños y confirmando antes. Las capturas del usuario a veces muestran el fallback (su navegador o la preview sin WebGL), lo que alimenta la confusión.
- Los halos por pieza usan mapas de % (BASE_SPOTS + OVERRIDES por tamaño); las 4 imágenes comparten encuadre 3/4 frontal-izquierdo, por eso un mapa común funciona.

- **Ningún navegador del agente tiene WebGL** (ni el tester e2e ni el de screenshots): la escena R3F siempre cae al fallback. La validación visual del 3D solo puede hacerla el usuario en su navegador (tarea de proyecto abierta).
  **How to apply:** no repetir intentos de screenshot/e2e del canvas 3D; probar solo el fallback y la lógica.
- **Regla:** todo canvas WebGL debe detectar soporte antes de montar + error boundary con mensaje amable; sin esto el overlay de Vite rompe la página en navegadores sin WebGL.
- **Regla:** three/@react-three/* deben cargarse con `React.lazy` desde el componente que los usa; en eager el bundle inicial pasó de ~660 kB a 1.6 MB.
- `#personalizado` en la URL abre la pestaña del cotizador; el scroll del hash es manual (useEffect) porque el elemento se monta tarde.
- Tras instalar three, `React.ElementType` para iconos empezó a fallar en tsc (props → never); tipar iconos como `React.ComponentType<{ className?; strokeWidth? }>`.
