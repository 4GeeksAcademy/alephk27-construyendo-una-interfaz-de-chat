## ✅ Qué vamos a evaluar

- La API de Groq se llama correctamente con `fetch` incluyendo las cabeceras `Authorization: Bearer` y `Content-Type: application/json` en cada petición
- El historial completo de la conversación se envía en cada llamada a la API (comunicación stateless gestionada correctamente en el cliente)
- La promesa se gestiona con `async/await` y se muestra un estado de carga mientras se espera la respuesta
- Los errores de la API se capturan y se muestran al usuario como mensajes comprensibles, sin fallos silenciosos ni errores técnicos en pantalla
- `useState` gestiona correctamente los mensajes, el estado de carga y las métricas
- `useEffect` se usa para cargar y sincronizar el historial de la conversación desde `localStorage`
- Los datos de tokens del objeto `usage` se acumulan y muestran correctamente a lo largo de toda la sesión
- La conversación persiste tras una recarga de página y puede borrarse manualmente
- Al menos una métrica adicional más allá del conteo de tokens es visible en la interfaz