// src/Pages/Sandbox/data/index.ts
import { WorldConfig, StructureData, CompanyData, TechnologyData } from '../types';

// World configuration
export const worldConfig: WorldConfig = {
  width: 2000,
  height: 1500,
  tileSize: 32
};

// Company data
const companiesData: CompanyData[] = [
  {
    company: "TechCorp Italia",
    role: "Full Stack Developer",
    period: "2022 - Present",
    technologies: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    description: "Developed modern web applications using React and Node.js. Implemented microservices architecture and cloud deployment strategies.",
    website: "https://techcorp.it",
  },
  {
    company: "InnovateSoft",
    role: "Frontend Developer",
    period: "2020 - 2022",
    technologies: ["React", "Vue.js", "SASS", "Webpack"],
    description: "Built responsive user interfaces and improved application performance by 40%.",
    website: "https://innovatesoft.com",
  },
  {
    company: "StartupHub",
    role: "Junior Developer",
    period: "2019 - 2020",
    technologies: ["JavaScript", "HTML5", "CSS3", "jQuery"],
    description: "Started my development journey building landing pages and simple web applications.",
  }
];

// Technology data
const technologiesData: TechnologyData[] = [
  {
    name: "React",
    category: "Frontend Framework",
    level: "Expert",
    yearsExperience: 4,
    description: "Advanced React development including hooks, context, and performance optimization.",
    projects: ["Portfolio Website", "E-commerce Platform", "Admin Dashboard"],
  },
  {
    name: "Node.js",
    category: "Backend Runtime",
    level: "Advanced",
    yearsExperience: 3,
    description: "Server-side JavaScript development with Express.js and various databases.",
    projects: ["REST APIs", "Real-time Chat App", "Authentication System"],
  },
  {
    name: "TypeScript",
    category: "Programming Language",
    level: "Advanced",
    yearsExperience: 3,
    description: "Type-safe JavaScript development for large-scale applications.",
    projects: ["Enterprise Applications", "Component Libraries", "API Development"],
  },
  {
    name: "MongoDB",
    category: "Database",
    level: "Intermediate",
    yearsExperience: 2,
    description: "NoSQL database design and optimization for modern web applications.",
    projects: ["User Management System", "Content Management", "Analytics Platform"],
  }
];

// Convert to structure data
export const companies: StructureData[] = companiesData.map((company, index) => ({
  id: `company-${index}`,
  name: company.company,
  type: 'building',
  position: {
    x: 300 + (index * 200), // Spread along the path
    y: 200 + (index % 2) * 100 // Alternate sides
  },
  sprite: '🏢',
  description: company.description,
  data: company,
  interactionRadius: 80
}));

export const technologies: StructureData[] = technologiesData.map((tech, index) => ({
  id: `tech-${index}`,
  name: tech.name,
  type: 'statue',
  position: {
    x: 400 + (index * 150), // Different spacing
    y: 800 + (index % 3) * 80 // Three rows
  },
  sprite: getTechIcon(tech.category),
  description: tech.description,
  data: tech,
  interactionRadius: 60
}));

// Debug log to verify data structure
console.log('Technologies data:', technologies.map(t => ({
  name: t.name,
  type: t.type,
  dataType: typeof t.data,
  dataKeys: Object.keys(t.data)
})));

// Helper function to get technology icons
function getTechIcon(category: string): string {
  const iconMap: { [key: string]: string } = {
    'Frontend Framework': '⚛️',
    'Backend Runtime': '🟢',
    'Programming Language': '📝',
    'Database': '🗄️',
    'Cloud Platform': '☁️',
    'DevOps Tool': '🐳',
    'Version Control': '📊'
  };
  
  return iconMap[category] || '🔧';
}