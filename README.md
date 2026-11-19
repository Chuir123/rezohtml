# Ora

Aplicación web de oración católica en español. Incluye una cita bíblica que cambia según el día de la semana, temporizador de 5, 10 o 15 minutos, cronómetro libre, oraciones tradicionales, rosario guiado e intenciones privadas guardadas en el dispositivo.

## Abrir e instalar

Abre la web publicada por GitHub Pages. En iPhone o iPad, abre la URL con Safari y toca **Compartir → Añadir a pantalla de inicio**. La aplicación puede abrirse sin conexión después de cargarla por primera vez. Las intenciones y los ajustes se guardan en el navegador o en la aplicación instalada y no se sincronizan entre dispositivos.

## Recordatorio diario

La campana permite elegir la hora local de un aviso mientras Ora está abierta. Si el navegador concede permiso, Ora intenta mostrar también una notificación del sistema. El navegador puede suspender la página si bloqueas la pantalla o cambias de aplicación.

Para un aviso con Ora cerrada, descarga el archivo de calendario desde la campana. Si tu dispositivo no ofrece importarlo desde Safari, puedes importarlo en Calendario desde un Mac y sincronizarlo mediante iCloud, o crear manualmente un evento diario en Calendario. Comprueba que el evento tiene un aviso a la hora de inicio y que Calendario tiene activadas las notificaciones. Desactivar el aviso en Ora no elimina el evento del calendario.

## Publicar o probar

En GitHub, activa **Settings → Pages → Build and deployment → Source → GitHub Actions**. El flujo publica al actualizar `main` y también se puede ejecutar desde la pestaña Actions. El repositorio debe disponer de GitHub Pages.

Para probar en el ordenador, ejecuta `python3 -m http.server 8000` desde esta carpeta y abre `http://localhost:8000`. También puedes descargar el código con **Code → Download ZIP**. No hay dependencias de ejecución ni compilación.

Las oraciones son fórmulas católicas tradicionales en español. La guía del examen de conciencia es una pauta breve redactada para Ora.

## Racha de oración

En Inicio puedes marcar que has rezado hoy. Completar un temporizador de cuenta atrás o terminar el rosario también registra la oración. Cada fecha local cuenta una sola vez. Se muestran los últimos siete días, la racha actual y la mejor racha. Si aún no has registrado hoy, la racha de ayer sigue vigente hasta medianoche. El historial se guarda en el dispositivo.

## Biblioteca de oraciones

En **Oraciones** puedes buscar por título o tema y elegir un tema del submenú. Además de las fórmulas tradicionales, la biblioteca incluye plegarias redactadas para Ora sobre la familia, las relaciones, la salud, los estudios, el viaje y otros momentos cotidianos. La biblioteca está disponible sin conexión después de la primera visita.

## Biblia católica

La pestaña **Biblia** reúne una selección de citas breves traducidas para Ora a partir de la Nova Vulgata, con contexto, una pregunta para meditar y una lista de versículos por situaciones. El Evangelio completo y el santoral se consultan en Vatican News y requieren conexión. Ora incluye algunas referencias del leccionario y celebraciones para consultar de un vistazo.
