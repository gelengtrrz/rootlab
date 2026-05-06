export type ProfileMedia = {
  type: 'image' | 'video' | 'audio' | 'text' | 'link';
  url?: string;
  content?: string;
  thumbnail?: string;
};

export type ProcessUpdate = {
  id: string;
  artistId: string;
  date: string;
  title: string;
  description: string;
  media: ProfileMedia[];
  tags: string[];
};

export type Artist = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  location: string;
  discipline: string;
  bio: string;
  themeColor: string;
  headerImage?: string;
};

export const MOCK_DISCIPLINES = [
  'Música',
  'Artes plásticas',
  'Danza',
  'Fotografía / Filmmaking',
  'Escritura',
  'Diseño gráfico / Ilustración'
];

export const MOCK_ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Alba Cienfuegos',
    username: 'alba_cien',
    avatar: 'https://images.unsplash.com/photo-1611417832260-7b17ead38087?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRyYWl0JTIwd29tYW4lMjByYXd8ZW58MXx8fHwxNzczMDY1NzExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Madrid, España',
    discipline: 'Artes plásticas',
    bio: 'Explorando la decadencia urbana a través de texturas superpuestas. Mi estudio es un caos ordenado donde el acrílico y el spray conviven con recortes de prensa antigua.',
    themeColor: '#FF3333',
    headerImage: 'https://images.unsplash.com/photo-1551192335-29371c6d5073?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBtZXNzeSUyMHN0dWRpb3xlbnwxfHx8fDE3NzMwNjU3MTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '2',
    name: 'Teo Valdés',
    username: 'teo_v',
    avatar: 'https://images.unsplash.com/photo-1636828762565-c94f54f738f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRyYWl0JTIwbWFuJTIwZmlsbXxlbnwxfHx8fHwxNzczMDY1NzEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Berlín, Alemania',
    discipline: 'Música',
    bio: 'Sintetizadores modulares, grabaciones de campo y el sonido de cables mal conectados. Buscando la armonía en el error del hardware.',
    themeColor: '#33FF77',
  },
  {
    id: '3',
    name: 'Elena Rostova',
    username: 'elena_moves',
    avatar: 'https://images.unsplash.com/photo-1772529406411-9099e96f39da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBkYW5jZXIlMjBzdHVkaW98ZW58MXx8fHwxNzczMDY1NzExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Buenos Aires, Argentina',
    discipline: 'Danza',
    bio: 'El cuerpo como archivo. Documentando ensayos, improvisaciones y la frustración antes de que la coreografía tome forma real.',
    themeColor: '#3333FF',
  }
];

export const MOCK_PROCESSES: ProcessUpdate[] = [
  {
    id: 'p1',
    artistId: '1',
    date: '2026-03-08T10:00:00Z',
    title: 'Manchas iniciales',
    description: 'Buscando el color base. Probando con pigmentos naturales mezclados con aglutinante sintético. Huele fatal pero la textura es increíble. El lienzo de 2x2m impone.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1768572019427-2ce961caaece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nJTIwcHJvY2Vzc3xlbnwxfHx8fDE3NzMwNjU3MTB8MA&ixlib=rb-4.1.0&q=80&w=1080' }
    ],
    tags: ['texturas', 'inicio', 'pigmentos']
  },
  {
    id: 'p2',
    artistId: '2',
    date: '2026-03-07T14:30:00Z',
    title: 'Patchwork nocturno',
    description: 'Ayer estuve 4 horas ruteando cables para conseguir un dron que sonaba como un motor roto. Lo grabé todo. Aquí un fragmento del setup.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1620456091222-8e39e1cd5682?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzMwMTg5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      { type: 'audio', url: '#' } // Mock audio
    ],
    tags: ['modular', 'drone', 'hardware']
  },
  {
    id: 'p3',
    artistId: '1',
    date: '2026-03-05T09:15:00Z',
    title: 'Bocetos y dudas',
    description: 'No estoy segura de la composición. La parte derecha está demasiado pesada. Quizás deba raspar todo ese azul.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1685463894505-d33387aa8430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2V0Y2hlcyUyMG5vdGVib29rcyUyMHdyaXRpbmd8ZW58MXx8fHwxNzczMDY1NzEyfDA&ixlib=rb-4.1.0&q=80&w=1080' }
    ],
    tags: ['boceto', 'dudas', 'composición']
  },
  {
    id: 'p4',
    artistId: '3',
    date: '2026-03-02T18:45:00Z',
    title: 'Ensayo 04 - Caída',
    description: 'Trabajando en el peso y la gravedad. Dejar caer el cuerpo sin protección. Me duelen las rodillas pero el movimiento empieza a ser honesto.',
    media: [
      { type: 'text', content: 'Nota mental: Respirar ANTES del impacto, no durante.' },
    ],
    tags: ['ensayo', 'cuerpo', 'gravedad']
  },
  {
    id: 'p5',
    artistId: '2',
    date: '2026-02-28T22:10:00Z',
    title: 'Error de render = Portada',
    description: 'Mi tarjeta gráfica colapsó mientras editaba un visual y generó este glitch increíble. Definitivamente se queda como portada del EP.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1762365189058-7be5b07e038b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBncmFwaGljJTIwZGVzaWduJTIwcG9zdGVyfGVufDF8fHx8MTc3MzA2NTcxMnww&ixlib=rb-4.1.0&q=80&w=1080' }
    ],
    tags: ['glitch', 'visuales', 'accidente']
  }
];
