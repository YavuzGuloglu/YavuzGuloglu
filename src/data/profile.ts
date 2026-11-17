// All personal content lives here. Edit this file to update the site;
// both the 3D orbit view and the classic view read from it.

export const profile = {
  name: 'Yavuz Güloğlu',
  initials: 'YG',
  title: 'Frontend Developer',
  location: 'İstanbul, Türkiye',
  summary:
    'Frontend Developer with experience building large-scale, performance-critical web applications for B2C e-commerce and logistics platforms. Specialised in React and TypeScript, with hands-on delivery of custom SSR architectures, micro frontend ecosystems and data-driven user interfaces.',
  summaryExtra:
    'Experienced in developing modular and reusable components, maintaining complex frontend systems, and working closely with backend, product and UX teams within agile environments.',
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
    company: 'PttAVM / PtteM Technology',
    role: 'Frontend Developer · PttAVM & Comtohome Cargo',
    location: 'İstanbul',
    period: 'May 2025 – Present',
    summary:
      'Deliver performance-critical user flows on the PttAVM B2C e-commerce platform, including homepage, basket and payment, using React and TypeScript on a custom SSR architecture.',
    highlights: [
      'Developed a modular, data-driven cargo tracking application for the Comtohome project using the Next.js App Router with API Routes and a modular service layer.',
      'Maintain and modernise Vue.js-based B2B logistics dashboards, migrating them toward a more current frontend stack.',
      'Implemented custom SSR with React Router v6 and adaptive rendering across platforms.',
      'Manage server state and data fetching with React Query (TanStack Query), Vuex and Axios.',
      'Build reusable UI components following Atomic Design principles, styled with SCSS and SCSS Modules.',
      'Integrated Google reCAPTCHA, i18n and LogRocket for security, localisation and monitoring.',
    ],
    stack: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'React Query', 'Custom SSR', 'SCSS Modules', 'LogRocket'],
  },
  {
    company: 'Hepsiburada (NASDAQ: HEPS)',
    role: 'Frontend Developer · Checkout & Payment Team',
    location: 'İstanbul',
    period: 'Dec 2021 – May 2025',
    summary:
      'Developed and maintained core purchase flows within a high-traffic SPA, covering Basket, Checkout and Success journeys for web and mobile (WebView) platforms.',
    highlights: [
      'Led the redevelopment of the New Checkout (OPC) with React, TypeScript and Zustand, reducing load times by 30% and improving customer satisfaction.',
      'Contributed to the Voltran micro frontend ecosystem, building and maintaining shared modules including Address Select, Coupons and Hepsimat across multiple product pages.',
      "Applied Statsig for A/B testing and Davinci, Hepsiburada's internal event library, for event handling.",
      'Partnered with backend and product teams to deliver scalable, performant experiences across critical checkout journeys.',
    ],
    stack: ['React', 'TypeScript', 'Redux', 'Zustand', 'Voltran', 'Statsig', 'Cypress', 'Webpack', 'SCSS'],
  },
  {
    company: 'Moor Software Engineering',
    role: 'Frontend Developer',
    location: 'İstanbul',
    period: 'Jan 2021 – Dec 2021',
    summary:
      'Delivered the frontend of turnkey and support projects for insurance clients and international customers.',
    highlights: [
      'Built responsive interfaces and reusable components with React Hooks, Redux and Context API.',
      'Produced structured, reusable UI pages and logic within Scrum-based workflows.',
      'Supported build, deployment and delivery processes.',
    ],
    stack: ['React', 'Redux', 'Context API', 'JavaScript', 'SCSS', 'Reactstrap', 'Bootstrap'],
  },
  {
    company: 'MapCodeX – RK Soft',
    role: 'Software Developer (Intern)',
    location: 'Ankara · ODTÜ Teknokent',
    period: 'Jun 2019 – Aug 2019',
    summary: 'Developed a full-stack web application using .NET MVC, Entity Framework and Bootstrap.',
    highlights: ['Worked with HTML5, CSS and relational databases (MS SQL, MySQL).'],
    stack: ['.NET MVC', 'Entity Framework', 'Bootstrap', 'MS SQL', 'MySQL'],
  },
];

export type SkillGroup = { title: string; description: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    description: 'Core languages and frameworks I build with every day.',
    skills: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Vue.js', 'HTML'],
  },
  {
    title: 'State Management',
    description: 'Server state, client state and data fetching.',
    skills: ['React Query (TanStack Query)', 'Redux', 'Zustand', 'Context API', 'Vuex'],
  },
  {
    title: 'Architecture',
    description: 'How large frontends are structured, rendered and shared across teams.',
    skills: ['Custom SSR', 'Micro Frontend', 'Atomic Design', 'Adaptive Render'],
  },
  {
    title: 'Styling',
    description: 'Maintainable styles for component-driven UIs.',
    skills: ['SCSS', 'SCSS Modules', 'CSS', 'Bootstrap', 'Reactstrap'],
  },
  {
    title: 'Tooling & Practices',
    description: 'Build tooling, code quality, monitoring and ways of working.',
    skills: ['Webpack', 'Babel', 'Biome', 'ESLint', 'Prettier', 'Husky', 'Git', 'Postman', 'REST API', 'LogRocket', 'Scrum'],
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
