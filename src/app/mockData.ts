export type Discipline = 'Música' | 'Artes plásticas' | 'Danza' | 'Fotografía / Filmmaking' | 'Escritura' | 'Diseño gráfico / Ilustración';

export interface ProcessStep {
  id: string;
  type: 'image' | 'note' | 'audio' | 'link';
  content: string; // URL for image/audio/link, text for note
  caption?: string;
  date: string;
  style?: {
    rotation?: number;
    scale?: number;
    offsetX?: number;
    offsetY?: number;
    color?: string;
    fontFamily?: string;
  };
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  location: string;
  discipline: Discipline;
  bio: string;
  profileImage: string;
  process: ProcessStep[];
  themeColor: string;
  themeFont: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  artistId: string;
  coverImage: string;
  tags: string[];
}

export const disciplines: Discipline[] = [
  'Música', 'Artes plásticas', 'Danza', 'Fotografía / Filmmaking', 'Escritura', 'Diseño gráfico / Ilustración'
];

export const mockArtists: Artist[] = [
  {
    id: 'a1',
    name: 'Elara Vane',
    slug: 'elara-vane',
    location: 'Berlín, Alemania',
    discipline: 'Artes plásticas',
    bio: 'Explorando la descomposición de la materia y el color a través de texturas encontradas y quemaduras químicas. Mi proceso es más sobre destruir que construir.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    themeColor: '#ff4d00',
    themeFont: 'font-mono',
    process: [
      { id: 'p1_1', type: 'note', content: 'Día 1: Encontré estos cartones tirados. Tienen marcas de óxido perfectas.', date: '2026-02-10', style: { rotation: -3, color: '#ff4d00' } },
      { id: 'p1_2', type: 'image', content: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80', caption: 'Primera prueba con ácido', date: '2026-02-12', style: { rotation: 2, scale: 0.9 } },
      { id: 'p1_3', type: 'note', content: 'Demasiado rápido. El papel se deshizo por completo. Error.', date: '2026-02-14', style: { rotation: 1, fontFamily: 'Space Mono' } },
      { id: 'p1_4', type: 'image', content: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80', caption: 'Mejor resultado usando una esponja húmeda', date: '2026-02-16', style: { rotation: -1 } },
    ]
  },
  {
    id: 'a2',
    name: 'Jonah Cruz',
    slug: 'jonah-cruz',
    location: 'Buenos Aires, Argentina',
    discipline: 'Música',
    bio: 'Productor electrónico y diseñador sonoro. Grabo sonidos de la ciudad y los proceso hasta que pierden su identidad original.',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    themeColor: '#00ffd5',
    themeFont: 'font-serif',
    process: [
      { id: 'p2_1', type: 'image', content: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80', caption: 'Setup temporal en el balcón', date: '2026-03-01', style: { rotation: 0 } },
      { id: 'p2_2', type: 'note', content: 'El ruido de los frenos del colectivo D puede ser el bajo si lo bajo 3 octavas. Necesito aislar ese chirrido.', date: '2026-03-02', style: { rotation: 5, color: '#333' } },
      { id: 'p2_3', type: 'link', content: 'https://soundcloud.com/fake-link-chirrido', caption: 'Sample crudo', date: '2026-03-03' },
    ]
  },
  {
    id: 'a3',
    name: 'Sofia Lin',
    slug: 'sofia-lin',
    location: 'Nueva York, USA',
    discipline: 'Diseño gráfico / Ilustración',
    bio: 'Ilustradora obsesionada con tipografía cinética y pósters caóticos. Mi cerebro va más rápido que mi mano.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    themeColor: '#ff00ff',
    themeFont: 'font-sans',
    process: [
      { id: 'p3_1', type: 'image', content: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80', caption: 'Moodboard de la semana', date: '2026-03-05', style: { rotation: -4 } },
      { id: 'p3_2', type: 'note', content: 'No logro hacer que la letra A se vea como que está cayendo. Se ve como si estuviera flotando. Frustración absoluta.', date: '2026-03-06', style: { color: '#ff00ff', rotation: 2 } },
      { id: 'p3_3', type: 'image', content: 'https://images.unsplash.com/photo-1611095973763-414019e72400?auto=format&fit=crop&w=800&q=80', caption: 'Sketch 04 (tal vez funciona)', date: '2026-03-08', style: { rotation: 1 } },
    ]
  }
];

export const mockProjects: Project[] = [
  {
    id: 'proj1',
    title: 'Oxidación Guiada',
    description: 'Una serie sobre la descomposición controlada de materiales urbanos.',
    artistId: 'a1',
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    tags: ['texturas', 'caos', 'ácido']
  },
  {
    id: 'proj2',
    title: 'Frenos y Sirenas',
    description: 'EP creado exclusivamente con grabaciones de campo del tráfico de CABA.',
    artistId: 'a2',
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    tags: ['field recording', 'drone', 'industrial']
  },
  {
    id: 'proj3',
    title: 'Letras en Caída Libre',
    description: 'Exploración tipográfica sobre la gravedad visual.',
    artistId: 'a3',
    coverImage: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=800&q=80',
    tags: ['tipografía', 'póster', 'cinético']
  }
];
