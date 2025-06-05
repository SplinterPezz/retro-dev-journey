import { WorldConfig, StructureData, CompanyData, TechnologyData } from './types';

export const tileSize: number = 128;

// World configuration
export const worldConfig: WorldConfig = {
  width: 2000,
  height: 2000,
  tileSize: tileSize
};

// Main path configuration
export const mainPathConfig = {
  startX: worldConfig.width / 2,
  startY: 100,
  endY: worldConfig.height,
  width: tileSize
};

// Company data with specific positions
const companiesData: CompanyData[] = [
  {
    company: "StartupHub",
    role: "Junior Developer",
    period: "2019 - 2020",
    technologies: ["JavaScript", "HTML5", "CSS3", "jQuery"],
    description: "Started my development journey building landing pages and simple web applications.",
    position: { x: mainPathConfig.startX - 400, y: 390 }
  },
  {
    company: "InnovateSoft",
    role: "Frontend Developer",
    period: "2020 - 2022",
    technologies: ["React", "Vue.js", "SASS", "Webpack"],
    description: "Built responsive user interfaces and improved application performance by 40%.",
    website: "https://innovatesoft.com",
    position: { x: mainPathConfig.startX + 390, y: 640 }
  },
  {
    company: "TechCorp Italia",
    role: "Full Stack Developer",
    period: "2022 - Present",
    technologies: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    description: "Developed modern web applications using React and Node.js. Implemented microservices architecture and cloud deployment strategies.",
    website: "https://techcorp.it",
    position: { x: mainPathConfig.startX - 260, y: 1150 }
  },
  {
    company: "???",
    role: "Your Next Great Hire",
    period: "2025 - Future",
    technologies: ["Your Tech Stack", "Innovation", "Growth"],
    description: "Ready to bring my skills and passion to your team. Let's build something amazing together!",
    position: { x: mainPathConfig.startX, y: mainPathConfig.endY - 108 }
  }
];

// Technology data with specific positions
const technologiesData: TechnologyData[] = [
  {
    name: "JavaScript",
    category: "Programming Language",
    level: "Expert",
    yearsExperience: 5,
    description: "Core language mastery including ES6+, async programming, and performance optimization.",
    projects: ["Interactive Websites", "Node.js APIs", "Browser Extensions"],
    position: { x: mainPathConfig.startX + 270, y: 260 }
  },
  {
    name: "Node.js",
    category: "Backend Runtime",
    level: "Advanced",
    yearsExperience: 3,
    description: "Server-side JavaScript development with Express.js and various databases.",
    projects: ["REST APIs", "Real-time Chat App", "Authentication System"],
    position: { x: mainPathConfig.startX + 260, y: 900 }
  },
  {
    name: "TypeScript",
    category: "Programming Language",
    level: "Advanced",
    yearsExperience: 3,
    description: "Type-safe JavaScript development for large-scale applications.",
    projects: ["Enterprise Applications", "Component Libraries", "API Development"],
    position: { x: mainPathConfig.startX - 390, y: 900 }
  },
  {
    name: "MongoDB",
    category: "Database",
    level: "Intermediate",
    yearsExperience: 2,
    description: "NoSQL database design and optimization for modern web applications.",
    projects: ["User Management System", "Content Management", "Analytics Platform"],
    position: { x: mainPathConfig.startX + 390, y: 1160 }
  },
  {
    name: "AWS",
    category: "Cloud Platform",
    level: "Intermediate",
    yearsExperience: 2,
    description: "Cloud infrastructure management and deployment using Amazon Web Services.",
    projects: ["Serverless Applications", "Auto-scaling Systems", "CI/CD Pipelines"],
    position: { x: mainPathConfig.startX - 140, y: 1410 }
  }
];

// Convert to structure data
export const companies: StructureData[] = companiesData.map((company, index) => ({
  id: `company-${index}`,
  name: company.company,
  type: 'building',
  position: company.position,
  sprite: company.company === '???' ? '❓' : '🏢',
  description: company.description,
  data: company,
  interactionRadius: 80
}));

export const technologies: StructureData[] = technologiesData.map((tech, index) => ({
  id: `tech-${index}`,
  name: tech.name,
  type: 'statue',
  position: tech.position,
  sprite: getTechIcon(tech.category),
  description: tech.description,
  data: tech,
  interactionRadius: 60
}));

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