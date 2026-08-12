---
name: WebGL / coche 3D del cotizador
description: Limitaciones de verificación WebGL en este entorno y reglas para la escena 3D del cotizador
---

- **Ningún navegador del agente tiene WebGL** (ni el tester e2e ni el de screenshots): la escena R3F siempre cae al fallback. La validación visual del 3D solo puede hacerla el usuario en su navegador (tarea de proyecto abierta).
  **How to apply:** no repetir intentos de screenshot/e2e del canvas 3D; probar solo el fallback y la lógica.
- **Regla:** todo canvas WebGL debe detectar soporte antes de montar + error boundary con mensaje amable; sin esto el overlay de Vite rompe la página en navegadores sin WebGL.
- **Regla:** three/@react-three/* deben cargarse con `React.lazy` desde el componente que los usa; en eager el bundle inicial pasó de ~660 kB a 1.6 MB.
- `#personalizado` en la URL abre la pestaña del cotizador; el scroll del hash es manual (useEffect) porque el elemento se monta tarde.
- Tras instalar three, `React.ElementType` para iconos empezó a fallar en tsc (props → never); tipar iconos como `React.ComponentType<{ className?; strokeWidth? }>`.
