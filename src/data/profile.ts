// All personal content lives here. Edit this file to update the site;
// both the 3D orbit view and the classic view read from it.

export const profile = {
  name: 'Yavuz Güloğlu',
  initials: 'YG',
  title: 'Front-End Engineer',
  location: 'İstanbul, Türkiye',
  summary:
    'I build complex web applications with React, TypeScript and modern JavaScript, with a focus on seamless user experiences. Most of my work is large-scale e-commerce: checkout flows, payment integration and micro frontend architecture used by hundreds of thousands of people every day.',
  summaryExtra:
    'Experienced in agile workflows, I have maintained large-scale apps, fixed cross-browser issues and integrated RESTful APIs. I enjoy working closely with UX designers and I am always eager to learn what is next in frontend.',
  email: 'yavuzguloglu@outlook.com',
  links: {
    github: 'https://github.com/YavuzGuloglu',
    linkedin: 'https://www.linkedin.com/in/yavuzguloglu/',
  },
};

export type Experience = {
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: 'PttAVM',
    role: 'Frontend Developer',
    location: 'İstanbul',
    period: 'May 2025 – Present',
    summary:
      'Frontend development focusing on e-commerce solutions and user experience optimization.',
    highlights: [],
    stack: [],
  },
  {
    company: 'Hepsiburada (NASDAQ: HEPS)',
    role: 'Frontend Developer · Checkout & Payment Team',
    location: 'İstanbul',
    period: 'Dec 2021 – May 2025',
    summary:
      'Worked on the checkout team of a leading Turkish e-commerce company: a SPA with six routes including cart, delivery, payment, order summary and success pages.',
    highlights: [
      'Spearheaded the redevelopment of the New Checkout (New OPC) with React, TypeScript and Zustand. Load times improved by 30% and customer satisfaction scores rose significantly.',
      'Built and maintained micro frontends such as Address Select, Coupons and Hepsimat with Voltran, used across many pages.',
      'Built shared components for internal teams and implemented web and mobile (WebView) designs from Figma.',
      'Ran A/B tests with Statsig and event tracking with Davinci.',
      'Full-stack work with Vue and Node.js on back-office projects.',
    ],
    stack: ['React', 'TypeScript', 'Redux', 'Zustand', 'Voltran', 'Cypress', 'Webpack', 'SCSS'],
  },
  {
    company: 'Moor Software Engineering',
    role: 'Frontend Developer',
    location: 'İstanbul',
    period: 'Jan 2021 – Dec 2021',
    summary:
      'Delivered the frontend of turnkey and support projects for insurance companies and international clients.',
    highlights: [
      'Responsive design and generic, reusable component architecture.',
      'Build and deploy operations within Scrum teams.',
    ],
    stack: ['React', 'Redux', 'Context API', 'SCSS', 'Bootstrap'],
  },
  {
    company: 'MapCodeX – RK Soft',
    role: 'Software Developer (Intern)',
    location: 'Ankara · ODTÜ Teknokent',
    period: 'Jun 2019 – Aug 2019',
    summary: 'Built the company website end to end, both backend and frontend.',
    highlights: [],
    stack: ['.NET MVC', 'Entity Framework', 'Bootstrap', 'MS SQL', 'MySQL'],
  },
];

export type SkillGroup = { title: string; description: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend Development',
    description:
      'Complex web applications with React, TypeScript and modern JavaScript, built together with UX designers.',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'SCSS/Sass',
      'Redux',
      'Zustand',
      'Context API',
      'REST API',
      'Responsive Design',
    ],
  },
  {
    title: 'Tools & Testing',
    description:
      'Modern workflows: version control, build tooling, testing and deployment for maintainable code.',
    skills: ['Git', 'Webpack', 'Cypress', 'Postman', 'Node.js', 'Micro Frontend', 'Voltran', 'Material UI', 'Bootstrap'],
  },
  {
    title: 'E-commerce & UX',
    description:
      'Checkout flows, payment integration and performance for large-scale applications.',
    skills: ['Checkout Flow', 'Payment Integration', 'Shopping Cart', 'A/B Testing', 'Cross-browser', 'Performance'],
  },
];

export type Project = { name: string; description: string; url: string; image: string; tags: string[] };

export const projects: Project[] = [
  {
    name: 'Frontend Task',
    description: 'A frontend project showcasing modern JavaScript and responsive design principles.',
    url: 'https://github.com/YavuzGuloglu/frontend-task',
    image: '/projects/mock10.png',
    tags: ['JavaScript', 'Responsive'],
  },
  {
    name: 'Component Training',
    description: 'Component-based development training focused on reusable UI components.',
    url: 'https://github.com/YavuzGuloglu/component_training',
    image: '/projects/mock09.png',
    tags: ['Components', 'JavaScript'],
  },
  {
    name: 'Country Search',
    description: 'Country search with real-time filtering and detailed country information.',
    url: 'https://github.com/YavuzGuloglu/country-search',
    image: '/projects/mock08.png',
    tags: ['API', 'Filtering'],
  },
  {
    name: 'SanOto',
    description: 'A JavaScript project demonstrating advanced frontend techniques and UI design.',
    url: 'https://github.com/YavuzGuloglu/SanOto',
    image: '/projects/mock07.png',
    tags: ['JavaScript', 'UI'],
  },
  {
    name: 'Django Blog',
    description: 'Full-stack blog with content management and user authentication.',
    url: 'https://github.com/YavuzGuloglu/Django_blog',
    image: '/projects/mock06.png',
    tags: ['Python', 'Django'],
  },
  {
    name: 'GYM Desktop App',
    description: 'A C# desktop application for gym management.',
    url: 'https://github.com/YavuzGuloglu/GYM',
    image: '/projects/mock05.png',
    tags: ['C#', 'Desktop'],
  },
  {
    name: 'React Portfolio Template',
    description: 'The previous version of this site: React, TypeScript and Material UI with dark and light modes.',
    url: 'https://github.com/YavuzGuloglu/react-portfolio-template',
    image: '/projects/mock04.png',
    tags: ['React', 'TypeScript', 'MUI'],
  },
];

export type Education = { school: string; degree: string; field: string; period: string };

export const education: Education[] = [
  {
    school: 'Trakya University',
    degree: "Bachelor's Degree",
    field: 'Computer Technologies and Information Systems',
    period: '2016 – 2020',
  },
  {
    school: 'Anadolu University',
    degree: 'Associate Degree · Open Education Faculty',
    field: 'Web Design and Coding',
    period: '2018 – 2020',
  },
];
