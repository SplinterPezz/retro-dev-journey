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
    website: "https://techcorp.it"
  },
  {
    company: "StartupXYZ",
    role: "Frontend Developer",
    period: "2021 - 2022",
    technologies: ["Vue.js", "JavaScript", "CSS3", "REST APIs"],
    description: "Built responsive user interfaces for a fintech startup. Collaborated with UX designers to create intuitive user experiences.",
    website: "https://startupxyz.com"
  },
  {
    company: "Digital Agency Roma",
    role: "Web Developer",
    period: "2020 - 2021",
    technologies: ["WordPress", "PHP", "jQuery", "MySQL"],
    description: "Created custom WordPress themes and plugins for various clients. Optimized website performance and SEO.",
    website: "https://digitalagency.roma"
  },
  {
    company: "Freelance Projects",
    role: "Full Stack Developer",
    period: "2019 - 2020",
    technologies: ["Laravel", "Vue.js", "PostgreSQL", "Docker"],
    description: "Worked on various freelance projects including e-commerce platforms and business management systems.",
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
    projects: ["Portfolio Website", "E-commerce Platform", "Admin Dashboard"]
  },
  {
    name: "Node.js",
    category: "Backend Runtime",
    level: "Advanced",
    yearsExperience: 3,
    description: "Server-side JavaScript development with Express.js and various databases.",
    projects: ["REST APIs", "Real-time Chat App", "Authentication System"]
  },
  {
    name: "TypeScript",
    category: "Programming Language",
    level: "Advanced",
    yearsExperience: 3,
    description: "Type-safe JavaScript development for large-scale applications.",
    projects: ["Enterprise Applications", "Component Libraries", "API Development"]
  },
  {
    name: "MongoDB",
    category: "Database",
    level: "Intermediate",
    yearsExperience: 2,
    description: "NoSQL database design and optimization for modern web applications.",
    projects: ["User Management System", "Content Management", "Analytics Platform"]
  },
  {
    name: "AWS",
    category: "Cloud Platform",
    level: "Intermediate",
    yearsExperience: 2,
    description: "Cloud infrastructure management and deployment on Amazon Web Services.",
    projects: ["Serverless Applications", "Container Deployment", "Static Site Hosting"]
  },
  {
    name: "Vue.js",
    category: "Frontend Framework",
    level: "Intermediate",
    yearsExperience: 2,
    description: "Progressive JavaScript framework for building user interfaces.",
    projects: ["SPA Applications", "Component Libraries", "Admin Panels"]
  },
  {
    name: "Docker",
    category: "DevOps Tool",
    level: "Intermediate",
    yearsExperience: 2,
    description: "Containerization and orchestration for development and production environments.",
    projects: ["Development Environment", "Production Deployment", "CI/CD Pipeline"]
  },
  {
    name: "Git",
    category: "Version Control",
    level: "Expert",
    yearsExperience: 5,
    description: "Advanced Git workflows including branching strategies and collaboration.",
    projects: ["All Projects", "Open Source Contributions", "Team Collaboration"]
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