import { education, experience, projects, skillGroups } from '../../data/profile';

export type SectionId = 'about' | 'experience' | 'skills' | 'projects' | 'education' | 'contact';

export type SurfaceType = 'rocky' | 'gas' | 'ice';

export type PlanetConfig = {
  id: Exclude<SectionId, 'about' | 'contact'>;
  label: string;
  caption: string;
  radius: number;
  distance: number;
  /** radians per second at full sim speed */
  speed: number;
  phase: number;
  tilt: number;
  surface: SurfaceType;
  colors: [string, string, string];
  atmosphere: string;
  ring?: boolean;
  moons: number;
};

export const SUN_RADIUS = 1.7;

// Each planet is one part of my story. Moons = items inside that section.
// I'm the astronaut drifting around the sun; the ship at the screen edge is Contact.
export const planets: PlanetConfig[] = [
  {
    id: 'experience',
    label: 'Experience',
    caption: `${experience.length} companies`,
    radius: 0.62,
    distance: 5.4,
    speed: 0.3,
    phase: 0.4,
    tilt: 0.2,
    surface: 'rocky',
    colors: ['#3a1410', '#c2532f', '#f2b37a'],
    atmosphere: '#ff8a5c',
    moons: experience.length,
  },
  {
    id: 'skills',
    label: 'Skills',
    caption: `${skillGroups.reduce((n, g) => n + g.skills.length, 0)} technologies`,
    radius: 0.82,
    distance: 7.9,
    speed: 0.21,
    phase: 2.3,
    tilt: 0.35,
    surface: 'gas',
    colors: ['#2a1b5e', '#7b5cff', '#c7b8ff'],
    atmosphere: '#9d85ff',
    moons: skillGroups.length,
  },
  {
    id: 'projects',
    label: 'Projects',
    caption: `${projects.length} projects`,
    radius: 1.02,
    distance: 11.8,
    speed: 0.15,
    phase: 4.1,
    tilt: 0.45,
    surface: 'gas',
    colors: ['#0b3b44', '#22b8b0', '#d6fff4'],
    atmosphere: '#5ef2df',
    ring: true,
    moons: 0,
  },
  {
    id: 'education',
    label: 'Education',
    caption: `${education.length} degrees`,
    radius: 0.55,
    distance: 14.4,
    speed: 0.11,
    phase: 0.9,
    tilt: 0.15,
    surface: 'ice',
    colors: ['#1d3a6e', '#6fa8ff', '#f0f7ff'],
    atmosphere: '#8ec5ff',
    moons: education.length,
  },
];

export const ORDER: SectionId[] = ['about', ...planets.map((p) => p.id), 'contact'];

export const LABELS: Record<SectionId, string> = {
  about: 'About',
  contact: 'Contact',
  ...Object.fromEntries(planets.map((p) => [p.id, p.label])),
} as Record<SectionId, string>;
