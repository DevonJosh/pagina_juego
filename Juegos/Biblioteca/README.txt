BIBLIOTECA DE HISTORIAS

Abre index.html o Biblioteca.html. Ambas entradas muestran la misma biblioteca.
Puedes usar los archivos directamente o servir la carpeta en tu página web.

ESTRUCTURA
- audio/: músicas de fondo y efectos compartidos entre historias.
- assets/: fondos, estantería y portadas de la biblioteca.
- js/catalogo.js: listado de historias para el carrusel.
- cuentos/bertha-benz/: historia de Bertha, actividades, páginas y narraciones.
- cuentos/bertha-benz/assets/nuevos/carta-1.png a carta-4.png: escenas de la actividad final del viaje.

CAMBIOS DE ESTA VERSIÓN
- Biblioteca de Historias con seis libros en el catálogo y tres portadas visibles.
- Transición suave: las portadas se deslizan y cambian de tamaño hasta ocupar su posición.
- Navegación por flechas, teclado, indicadores y deslizamiento táctil.
- Dos libros nuevos muestran Próximamente.
- Controles de música en la parte inferior de la biblioteca.
- Título compacto, estante más grande y apoyado visualmente en el piso, sin deformar las imágenes.
- Ada Lovelace figura como Próximamente; no se abre una historia incompleta.
- Músicas Beyond_the_Gilded_Spine.mp3 y Tales_Beneath_the_Lamp.mp3 en audio/.
- Las narraciones capitulo1.mp3 a capitulo8.mp3 y moraleja.mp3 permanecen con Bertha.
- Panel inicial: Solo historia (8 capítulos y moraleja, 9 vistas) o Historia con actividades (14 vistas).
- Cambiar modo permite elegir otra modalidad durante la lectura; una nueva elección empieza desde el inicio.
- Leer de nuevo conserva la modalidad elegida.
- La narración empieza cinco segundos después de seleccionar el modo.
- Las cinco actividades tienen Saltar actividad para continuar sin resolverlas.
- Respuestas correctas mantienen el avance a los cinco segundos.
- Panel final al terminar la narración de la moraleja, o al pulsar la flecha siguiente de esa página.
- Panel final con Volver a la biblioteca, Leer de nuevo y Volver a la moraleja.
- Sonido breve de destellos al terminar, generado en JavaScript; no se inicia música larga ni en bucle.
- Se conserva el sonido de botones y actividades con el volumen aumentado.

PARA AÑADIR HISTORIAS
Edita js/catalogo.js y agrega una entrada al arreglo window.HISTORIAS.
Usa id, title, cover, description y href. cover apunta a la portada y href al HTML de la historia.
Si no agregas href, se mostrará Próximamente. La portada puede omitirse temporalmente.
Las flechas y los indicadores se actualizan automáticamente.

Para agregar una música compartida, colócala en audio/ y añade su opción en los selectores de la biblioteca y de la historia.
Conservamos el nombre de la carpeta cuentos/ para mantener los enlaces existentes.

El navegador puede necesitar un primer toque para permitir la reproducción de audio.
