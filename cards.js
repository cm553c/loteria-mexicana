// Base de datos completa de las 54 cartas tradicionales de la Lotería Mexicana
// Cada carta incluye múltiples dichos/versos tradicionales para alternarlos aleatoriamente entre corridas
// e incluye la ruta a su imagen tradicional en la carpeta local "cartas/"

const LOTERIA_CARDS = [
  {
    id: 1,
    name: "EL GALLO",
    image: "cartas/1.jpg",
    dichos: [
      "El que le cantó a San Pedro no le volverá a cantar.",
      "¡Quiquiriquí! Ya está despertando el sol, despierta tú también corazón.",
      "Gallo fino y peleador, el que canta en el corral al amanecer.",
      "Otro gallo nos cantara si tuvieras buen amor."
    ],
    bg: "#fde68a",
    accent: "#dc2626",
    emoji: "🐓"
  },
  {
    id: 2,
    name: "EL DIABLITO",
    image: "cartas/2.jpg",
    dichos: [
      "Pórtate bien cuatito, si no te lleva el coloradito.",
      "El diablito colorado con su trinche bien afilado.",
      "Más sabe el diablo por viejo que por diablo.",
      "No le busques tres pies al diablo porque te encuentra cuatro."
    ],
    bg: "#bae6fd",
    accent: "#dc2626",
    emoji: "😈"
  },
  {
    id: 3,
    name: "LA DAMA",
    image: "cartas/3.jpg",
    dichos: [
      "Puliendo el paso, por toda la calle real.",
      "Elegante y presumida, paseando por la avenida.",
      "La dama de buen vestir, que a todos hace suspirar al salir.",
      "Con vestido de etiqueta, va caminando coqueta."
    ],
    bg: "#fbcfe8",
    accent: "#1d4ed8",
    emoji: "💃"
  },
  {
    id: 4,
    name: "EL CATRÍN",
    image: "cartas/4.jpg",
    dichos: [
      "Don Ferruco en la alameda, su bastón quería tirar.",
      "De sombrero y de bastón, pasea el catrín por el callejón.",
      "Muy catrín y muy galán, pero sin un quinto pa'l pan.",
      "Con su traje dominguero, se cree dueño del mundo entero."
    ],
    bg: "#fef08a",
    accent: "#1e293b",
    emoji: "🎩"
  },
  {
    id: 5,
    name: "EL PARAGUAS",
    image: "cartas/5.jpg",
    dichos: [
      "Para el sol y para el agua.",
      "Ábrelo cuando llueva, ciérralo cuando escampe.",
      "El que se cubre a tiempo, ni se moja ni se quema.",
      "Cuando el cielo se nubla, el paraguas te ayuda."
    ],
    bg: "#bbf7d0",
    accent: "#1d4ed8",
    emoji: "☂️"
  },
  {
    id: 6,
    name: "LA SIRENA",
    image: "cartas/6.jpg",
    dichos: [
      "Con los cantos de sirena, no te vayas a marear.",
      "Medio pez y medio dama, desde las olas te llama.",
      "En el mar canta bonito, pa' llevarse al marinerito.",
      "Por oír a la sirena, el marinero olvidó su pena."
    ],
    bg: "#bae6fd",
    accent: "#0284c7",
    emoji: "🧜‍♀️"
  },
  {
    id: 7,
    name: "LA ESCALERA",
    image: "cartas/7.jpg",
    dichos: [
      "Súbeme paso a pasito, no quieras pegar brinquitos.",
      "Peldaño tras peldaño, se llega hasta lo más alto.",
      "No pases por debajo, que te quedas sin trabajo.",
      "Para subir al cielo se necesita una escalera grande y otra chiquita."
    ],
    bg: "#fde68a",
    accent: "#92400e",
    emoji: "🪜"
  },
  {
    id: 8,
    name: "LA BOTELLA",
    image: "cartas/8.jpg",
    dichos: [
      "La herramienta del borracho.",
      "De tequila o de mezcal, para todo mal y para todo bien.",
      "Empínate la botella, que la noche está muy bella.",
      "Poquito porque es bendito, no te acabes el traguito."
    ],
    bg: "#fecdd3",
    accent: "#15803d",
    emoji: "🍾"
  },
  {
    id: 9,
    name: "EL BARRIL",
    image: "cartas/9.jpg",
    dichos: [
      "Tanto bebió el albañil, que quedó como barril.",
      "Barrilito de madera, lleno de vino por dentro y seco por fuera.",
      "De roble bien amarrado, tiene el pulque bien guardado.",
      "Rodando viene y rodando va, el barril de la vecindad."
    ],
    bg: "#e0f2fe",
    accent: "#78350f",
    emoji: "🛢️"
  },
  {
    id: 10,
    name: "EL ÁRBOL",
    image: "cartas/10.jpg",
    dichos: [
      "El que a buen árbol se arrima, buena sombra le cobija.",
      "Árbol que nace torcido, jamás su tronco endereza.",
      "Verde y frondoso en el campo, donde anidan los pajaritos.",
      "Del árbol caído todos quieren hacer leña."
    ],
    bg: "#fef08a",
    accent: "#15803d",
    emoji: "🌳"
  },
  {
    id: 11,
    name: "EL MELÓN",
    image: "cartas/11.jpg",
    dichos: [
      "Me lo das o me lo quitas.",
      "Dulce y oloroso, para el calor qué sabroso.",
      "El que parte y reparte, se queda con la mejor parte.",
      "Con agua fresca de melón, se alegra mi corazón."
    ],
    bg: "#bae6fd",
    accent: "#ea580c",
    emoji: "🍈"
  },
  {
    id: 12,
    name: "EL VALIENTE",
    image: "cartas/12.jpg",
    dichos: [
      "Por qué le corres cobarde, trayendo tan buen puñal.",
      "No le saques al parche, si te crees muy valiente.",
      "Con el sarape en el brazo y el puñal listo pa'l trazo.",
      "El valiente vive hasta que el cobarde quiere."
    ],
    bg: "#fed7aa",
    accent: "#b91c1c",
    emoji: "🗡️"
  },
  {
    id: 13,
    name: "EL GORRITO",
    image: "cartas/13.jpg",
    dichos: [
      "Ponle su gorrito al nene, no se nos vaya a resfriar.",
      "De lana bien tejidito, para cubrir al chiquito.",
      "El gorrito azul y blanco que se puso Juan en el banco.",
      "Cuídale la cabecita con su gorrito de estambre."
    ],
    bg: "#fde68a",
    accent: "#2563eb",
    emoji: "🧢"
  },
  {
    id: 14,
    name: "LA MUERTE",
    image: "cartas/14.jpg",
    dichos: [
      "La muerte tilica y flaca.",
      "La huesuda en el panteón, bailando de corazón.",
      "Estaba la media muerte sentada en un taburete.",
      "A todos nos lleva parejo, al jovencito y al viejo."
    ],
    bg: "#f5d0fe",
    accent: "#1e293b",
    emoji: "💀"
  },
  {
    id: 15,
    name: "LA PERA",
    image: "cartas/15.jpg",
    dichos: [
      "El que espera, desespera.",
      "Perita dulce y jugosa, del huerto la más sabrosa.",
      "No pidas peras al olmo, que eso ya sería el colmo.",
      "Madurita en la ramita, qué rica está la perita."
    ],
    bg: "#bae6fd",
    accent: "#65a30d",
    emoji: "🍐"
  },
  {
    id: 16,
    name: "LA BANDERA",
    image: "cartas/16.jpg",
    dichos: [
      "Verde, blanco y colorado, la bandera del soldado.",
      "Ondeando con mucho honor, mi bandera tricolor.",
      "Con el águila en el centro, la llevo muy acá adentro.",
      "Saluden todos parejos al orgullo de mi tierra."
    ],
    bg: "#fef3c7",
    accent: "#dc2626",
    emoji: "🇲🇽"
  },
  {
    id: 17,
    name: "EL BANDOLÓN",
    image: "cartas/17.jpg",
    dichos: [
      "Tocando su bandolón, está el mariachi Simón.",
      "Suenan las cuerdas de plata en media serenata.",
      "Rasgueando el bandolón se arma la fiesta en el rincón.",
      "Punteando bonito el son, con el viejo bandolón."
    ],
    bg: "#bbf7d0",
    accent: "#b45309",
    emoji: "🪕"
  },
  {
    id: 18,
    name: "EL VIOLONCELLO",
    image: "cartas/18.jpg",
    dichos: [
      "Creciendo se fue hasta el cielo, y como no fue violín, tuvo que ser violoncello.",
      "Con su arco va llorando una canción de amor.",
      "El hermano grandulón del violín en el salón.",
      "Suena grave y suavecito, tocado muy despacito."
    ],
    bg: "#fde68a",
    accent: "#9a3412",
    emoji: "🎻"
  },
  {
    id: 19,
    name: "LA GARZA",
    image: "cartas/19.jpg",
    dichos: [
      "Al otro lado del río tengo mi banco de arena, donde se sienta mi chata pico de garza morena.",
      "Patitas largas y blancas en la orilla de la laguna.",
      "Con su cuello estilizado, pesca un pececito plateado.",
      "Vuela blanca por el cielo y se posa en el riachuelo."
    ],
    bg: "#bae6fd",
    accent: "#be185d",
    emoji: "🦩"
  },
  {
    id: 20,
    name: "EL PÁJARO",
    image: "cartas/20.jpg",
    dichos: [
      "Tú me traes a puros brincos, como pájaro en la rama.",
      "Más vale pájaro en mano que ciento volando.",
      "Pajarito mañanero que cantas en el alero.",
      "Brinca y canta sin cesar, listo para volar."
    ],
    bg: "#fef08a",
    accent: "#0284c7",
    emoji: "🐦"
  },
  {
    id: 21,
    name: "LA MANO",
    image: "cartas/21.jpg",
    dichos: [
      "La mano de un criminal.",
      "Cinco dedos bien abiertos, que no se quedan quietos.",
      "Manita que da cariño y también echa un buen tiro.",
      "Juego de manos es de villanos, decía mi abuelo."
    ],
    bg: "#bae6fd",
    accent: "#b45309",
    emoji: "✋"
  },
  {
    id: 22,
    name: "LA BOTA",
    image: "cartas/22.jpg",
    dichos: [
      "Una bota igual que la otra.",
      "Bota, bota y no es pelota; si no la apuntas, se te agota.",
      "De cuero bien lustrada, lista para la cabalgada.",
      "Con tacón y con espuela, suena fuerte por la escuela."
    ],
    bg: "#fde68a",
    accent: "#1e293b",
    emoji: "🥾"
  },
  {
    id: 23,
    name: "LA LUNA",
    image: "cartas/23.jpg",
    dichos: [
      "El farol de los enamorados.",
      "Lunita de queso y plata que a los novios arrebata.",
      "Sale de noche a brillar y a los lobos hace aullar.",
      "Luna menguante o creciente, alumbra a toda la gente."
    ],
    bg: "#c7d2fe",
    accent: "#ca8a04",
    emoji: "🌙"
  },
  {
    id: 24,
    name: "EL COTORRO",
    image: "cartas/24.jpg",
    dichos: [
      "Cotorro cotorro saca la pata, y empiézame a platicar.",
      "Verde y muy platicador, no se calla ni por error.",
      "Repite todo el chisme que escucha en el corredor.",
      "Dándole su semillita, el cotorro grita y grita."
    ],
    bg: "#fecdd3",
    accent: "#16a34a",
    emoji: "🦜"
  },
  {
    id: 25,
    name: "EL BORRACHO",
    image: "cartas/25.jpg",
    dichos: [
      "¡Ah qué borracho tan necio, ya no lo puedo aguantar!",
      "Haciendo el cuatro en la esquina, saliendo de la cantina.",
      "Jura que ya no va a tomar, pero pide otra pa' empezar.",
      "Cantando penas de amor, abrazado de un farol."
    ],
    bg: "#fde68a",
    accent: "#dc2626",
    emoji: "🥴"
  },
  {
    id: 26,
    name: "EL NEGRITO",
    image: "cartas/26.jpg",
    dichos: [
      "El que se comió el azúcar.",
      "Con su traje bien planchado, baila el son muy animado.",
      "Alegre y bullanguero, de la fiesta es el primero.",
      "Con sombrero de bombín, baila alegre en el jardín."
    ],
    bg: "#bbf7d0",
    accent: "#dc2626",
    emoji: "🕺"
  },
  {
    id: 27,
    name: "EL CORAZÓN",
    image: "cartas/27.jpg",
    dichos: [
      "No me extrañes corazón, que regreso en el camión.",
      "Corazón apasionado, por una flecha atravesado.",
      "Barriga llena, corazón contento.",
      "Late fuerte por tu amor, no le causes un dolor."
    ],
    bg: "#bae6fd",
    accent: "#e11d48",
    emoji: "❤️"
  },
  {
    id: 28,
    name: "LA SANDÍA",
    image: "cartas/28.jpg",
    dichos: [
      "La barriga que Juan tenía, era empacho de sandía.",
      "Verde por fuera, roja por dentro y con semillitas en el centro.",
      "Rebanada fresca y fría, qué sabrosa es la sandía.",
      "Con los colores de mi bandera, la fruta más dominguera."
    ],
    bg: "#fef08a",
    accent: "#dc2626",
    emoji: "🍉"
  },
  {
    id: 29,
    name: "EL TAMBOR",
    image: "cartas/29.jpg",
    dichos: [
      "No te arrugues, cuero viejo, que te quiero pa' tambor.",
      "Con las baquetas al compás: ¡rataplán, plan, plan!",
      "Suena fuerte en el desfile para que nadie se enfile.",
      "Cuero estirado y templado, que retumba por todo el poblado."
    ],
    bg: "#bae6fd",
    accent: "#b45309",
    emoji: "🥁"
  },
  {
    id: 30,
    name: "EL CAMARÓN",
    image: "cartas/30.jpg",
    dichos: [
      "Camarón que se duerme, se lo lleva la corriente.",
      "Chiquito y coloradito, en el caldo qué buen gustito.",
      "Con limón y con picante, en coctel sale adelante.",
      "Despierta, no te me duermas, que el río viene crecido."
    ],
    bg: "#fde68a",
    accent: "#ea580c",
    emoji: "🦐"
  },
  {
    id: 31,
    name: "LAS JARAS",
    image: "cartas/31.jpg",
    dichos: [
      "Las jaras del indio Adán, donde pegan, dan.",
      "Flechas rápidas al viento, que dan justo en el centro.",
      "Con punta bien afilada, no fallan ni una tirada.",
      "Cruzadas van las saetas, derechitas a sus metas."
    ],
    bg: "#bae6fd",
    accent: "#dc2626",
    emoji: "🏹"
  },
  {
    id: 32,
    name: "EL MÚSICO",
    image: "cartas/32.jpg",
    dichos: [
      "El músico trompa de hule, ya no me quiere tocar.",
      "Con su guitarra en la mano, canta tarde y temprano.",
      "A donde quiera que va, la fiesta empieza a sonar.",
      "Échele otra canción, maestro, para alegrar el salón."
    ],
    bg: "#fecdd3",
    accent: "#1d4ed8",
    emoji: "🎸"
  },
  {
    id: 33,
    name: "LA ARAÑA",
    image: "cartas/33.jpg",
    dichos: [
      "Atarántamela a palos, no me la dejes llegar.",
      "Teje y teje en el rincón, esperando algún moscardón.",
      "Con ocho patas camina por el techo de la cocina.",
      "Hilo de plata en la esquina, qué telaraña tan fina."
    ],
    bg: "#fde68a",
    accent: "#1e293b",
    emoji: "🕷️"
  },
  {
    id: 34,
    name: "EL SOLDADO",
    image: "cartas/34.jpg",
    dichos: [
      "Uno, dos y tres, el soldado p'al cuartel.",
      "Firme y derecho en la fila, haciendo guardia vigila.",
      "Soldado prevenido vale por dos en el camino.",
      "Marchando al paso redoblado, ahí viene nuestro soldado."
    ],
    bg: "#bae6fd",
    accent: "#15803d",
    emoji: "💂"
  },
  {
    id: 35,
    name: "LA ESTRELLA",
    image: "cartas/35.jpg",
    dichos: [
      "La guía de los marineros.",
      "Estrellita reluciente que alumbras a toda la gente.",
      "Con cinco picos dorados, brilla en los cielos despejados.",
      "Pide un deseo al mirar a la estrella relumbrar."
    ],
    bg: "#c7d2fe",
    accent: "#e11d48",
    emoji: "⭐"
  },
  {
    id: 36,
    name: "EL CASO",
    image: "cartas/36.jpg",
    dichos: [
      "El caso que te hago es poco.",
      "Cazo de cobre brillante, pa' las carnitas humeantes.",
      "En el fuego está hirviendo el dulce que están haciendo.",
      "No me hagas tanto caso, mejor pásame un pedazo."
    ],
    bg: "#bae6fd",
    accent: "#b45309",
    emoji: "🍲"
  },
  {
    id: 37,
    name: "EL MUNDO",
    image: "cartas/37.jpg",
    dichos: [
      "Este mundo es una bola, y nosotros un bolón.",
      "Dando vueltas sin parar, con sus tierras y su mar.",
      "El mundo carga en la espalda quien tiene deudas que pagar.",
      "Redondo como naranja, gira y gira sin tardanza."
    ],
    bg: "#fde68a",
    accent: "#0284c7",
    emoji: "🌍"
  },
  {
    id: 38,
    name: "EL APACHE",
    image: "cartas/38.jpg",
    dichos: [
      "¡Ah Chihuahua! Cuánto apache con pantalón y huarache.",
      "Con su penacho de plumas, baila entre las espumas.",
      "Guerrero de la pradera, que corre como una fiera.",
      "Con su lanza y su carcaj, nadie lo hace recular."
    ],
    bg: "#bbf7d0",
    accent: "#dc2626",
    emoji: "🪶"
  },
  {
    id: 39,
    name: "EL NOPAL",
    image: "cartas/39.jpg",
    dichos: [
      "Al nopal lo van a ver, nomás cuando tiene tunas.",
      "Con espinas por afuerita, pero en ensalada qué rico sabe.",
      "Orgullo del pedregal, verde y espinoso el nopal.",
      "Donde se paró el águila real a devorar la serpiente."
    ],
    bg: "#bae6fd",
    accent: "#15803d",
    emoji: "🌵"
  },
  {
    id: 40,
    name: "EL ALACRÁN",
    image: "cartas/40.jpg",
    dichos: [
      "El que con la cola pica, le dan una paliza.",
      "Sacude bien los zapatos, no te vaya a dar un mal rato.",
      "De Durango viene andando, con su ponzoña amenazando.",
      "No levantes esa piedra, que el alacrán se te enreda."
    ],
    bg: "#fde68a",
    accent: "#9a3412",
    emoji: "🦂"
  },
  {
    id: 41,
    name: "LA ROSA",
    image: "cartas/41.jpg",
    dichos: [
      "Rosita, Rosaura, ven que te quiero ahora.",
      "La flor más bella del jardín, con aroma de jazmín.",
      "No hay rosa sin espinas, ni amor sin muinas.",
      "Roja y perfumada, para la mujer amada."
    ],
    bg: "#bae6fd",
    accent: "#e11d48",
    emoji: "🌹"
  },
  {
    id: 42,
    name: "LA CALAVERA",
    image: "cartas/42.jpg",
    dichos: [
      "Al pasar por el panteón, me encontré un calaverón.",
      "Calaverita de azúcar con tu nombre en la frente.",
      "Pelando los dientes blancos, nos mira desde los bancos.",
      "Con dos huesos cruzados, asusta a los desvelados."
    ],
    bg: "#c7d2fe",
    accent: "#475569",
    emoji: "☠️"
  },
  {
    id: 43,
    name: "LA CAMPANA",
    image: "cartas/43.jpg",
    dichos: [
      "Tú con la campana y yo con tu hermana.",
      "¡Tilín, tolón! Ya llaman a misa y a la procesión.",
      "Desde lo alto del campanario, despierta a todo el vecindario.",
      "De bronce bien fundida, repica con alegría."
    ],
    bg: "#bae6fd",
    accent: "#ca8a04",
    emoji: "🔔"
  },
  {
    id: 44,
    name: "EL CANTARITO",
    image: "cartas/44.jpg",
    dichos: [
      "Tanto va el cántaro al agua, que se quiebra y te moja las enaguas.",
      "De barro rojo cocido, mantiene el agua bien fresca.",
      "Cantarito de Tonalá, el que lo llena se lo tomará.",
      "Con su jarrito al lado, en la feria bien pintado."
    ],
    bg: "#fde68a",
    accent: "#b45309",
    emoji: "🏺"
  },
  {
    id: 45,
    name: "EL VENADO",
    image: "cartas/45.jpg",
    dichos: [
      "Saltando va buscando, pero no ve nada.",
      "Con sus cuernos enramados, brinca por los prados.",
      "Ligero corre en el monte, mirando hacia el horizonte.",
      "No le tires cazador, déjalo correr mejor."
    ],
    bg: "#bae6fd",
    accent: "#92400e",
    emoji: "🦌"
  },
  {
    id: 46,
    name: "EL SOL",
    image: "cartas/46.jpg",
    dichos: [
      "La cobija de los pobres.",
      "Sol, solecito, caliéntame un poquito.",
      "No se puede tapar el sol con un solo dedo.",
      "Alumbra a buenos y malos desde que empieza la mañana."
    ],
    bg: "#fef08a",
    accent: "#dc2626",
    emoji: "🌞"
  },
  {
    id: 47,
    name: "LA CORONA",
    image: "cartas/47.jpg",
    dichos: [
      "El sombrero de los reyes.",
      "De oro y piedras preciosas, para las reinas hermosas.",
      "Al que nace pa' ser rey, del cielo le cae la corona.",
      "Brilla en lo alto del trono como ninguna otra joya."
    ],
    bg: "#bae6fd",
    accent: "#ca8a04",
    emoji: "👑"
  },
  {
    id: 48,
    name: "LA CHALUPA",
    image: "cartas/48.jpg",
    dichos: [
      "Rema y rema va Lupita, sentada en su chalupita.",
      "Por los canales de Xochimilco, cargada de flores y verduras.",
      "Chalupa y buenas, que ya casi lleno mi tabla.",
      "Deslizándose en el agua, va la linda chalupita."
    ],
    bg: "#fde68a",
    accent: "#0284c7",
    emoji: "🛶"
  },
  {
    id: 49,
    name: "EL PINO",
    image: "cartas/49.jpg",
    dichos: [
      "Fresco y oloroso, en todo tiempo hermoso.",
      "En lo alto de la sierra, da su aroma a toda la tierra.",
      "Verde en invierno y verano, el árbol más soberano.",
      "De buena madera fina, el pino de la colina."
    ],
    bg: "#bae6fd",
    accent: "#15803d",
    emoji: "🌲"
  },
  {
    id: 50,
    name: "EL PESCADO",
    image: "cartas/50.jpg",
    dichos: [
      "El que por la boca muere, aunque mudo fuere.",
      "Nadando contra corriente, cayó en el anzuelo de repente.",
      "Frito con su limoncito, qué sabroso pescadito.",
      "En el río o en el mar, no deja de coletear."
    ],
    bg: "#fecdd3",
    accent: "#0284c7",
    emoji: "🐟"
  },
  {
    id: 51,
    name: "LA PALMA",
    image: "cartas/51.jpg",
    dichos: [
      "Palmero, sube a la palma y bájame un coco real.",
      "Mecida por la brisa del mar, la palma se pone a bailar.",
      "Alta y esbelta en la playa, donde el sol nunca desmaya.",
      "Con sus hojas de abanico, da sombra al pobre y al rico."
    ],
    bg: "#bae6fd",
    accent: "#15803d",
    emoji: "🌴"
  },
  {
    id: 52,
    name: "LA MACETA",
    image: "cartas/52.jpg",
    dichos: [
      "El que nace pa' maceta, no sale del corredor.",
      "De barro y bien floreada, en el patio acomodada.",
      "Riégala todas las tardes para que sus flores alardeen.",
      "Adorno de la ventana, florida por la mañana."
    ],
    bg: "#fde68a",
    accent: "#dc2626",
    emoji: "🪴"
  },
  {
    id: 53,
    name: "EL ARPA",
    image: "cartas/53.jpg",
    dichos: [
      "Arpa vieja de mi suegra, ya no sirves pa' tocar.",
      "Treinta y seis cuerdas cantoras en manos veracruzanas.",
      "Suena el arpa jarocha y toda la fiesta derrocha.",
      "Como música del cielo, el arpa quita el desvelo."
    ],
    bg: "#bae6fd",
    accent: "#ca8a04",
    emoji: "🪉"
  },
  {
    id: 54,
    name: "LA RANA",
    image: "cartas/54.jpg",
    dichos: [
      "Al ver a la verde rana, qué brinco pegó tu hermana.",
      "Cantando en el charco está: ¡croac, croac, que ya va a llover!",
      "De un brinco cayó al estanque, antes de que el sol arranque.",
      "La última de la baraja, que brinca y nunca se raja."
    ],
    bg: "#fde68a",
    accent: "#16a34a",
    emoji: "🐸"
  }
];
