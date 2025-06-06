import { WorldConfig, StructureData, CompanyData, TechnologyData, Position } from './types';

export const tileSize: number = 128;

export const structureCentering: Position = {
  x: -256,
  y: -490
}

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
    id: "eikony",
    company: "Eikony (IT)",
    role: "IT Intern",
    period: "2014 - 2014",
    technologies: ["Java", "Android SDK", "Objective-C"],
    description: "Development of two mobile apps for managing restaurant reservations",
    website: "https://www.linkedin.com/company/eikony/?originalSubdomain=it",
    position: { x: mainPathConfig.startX - 400, y: 390 },
    image: "/sprites/buildings/eikony.png",
    signpost: "/signpost/eikony_signpost.png",
    easteregg: "Once upon a time, Dude spent his days debugging Java classes in a small app development company. After 6 months of internship, he looked at the career ladder… and decided to climb a different one: university. Fair choice, honestly."
  },
  {
    id: "unipa",
    company: "University - Computer Science",
    role: "Student",
    period: "2015 - 2019",
    technologies: ["Java", "MySQL", "C", "Open Data", "CSN"],
    description: "Bachelor's Degree in Computer Science",
    website: "https://www.unipa.it/",
    position: { x: mainPathConfig.startX + 390, y: 640 },
    image: "/sprites/buildings/unipa.png",
    signpost: "/signpost/unipa_signpost.png",
    easteregg: "Ah, UniPA. Four long years of Computer Science – plus a bonus one, just for fun. Dude didn’t finish the degree (money stuff, life stuff), but that’s probably where the spark for coding truly ignited. Thanks, UniPA!"
  },
  {
    id: "foryouviaggi",
    company: "ForYou Viaggi (IT)",
    role: "Software Developer",
    period: "2020 - 2020",
    technologies: [
      "PHP", "Python", "Java", "ReactJs", "MongoDB", "MySQL", "Facebook API"
    ],
    description: "Developed and architected an Headless CMS for web and promotion management also integrated with Facebook API for dynamic content.",
    position: { x: mainPathConfig.startX + 700, y: 1560 },
    image: "/sprites/buildings/foryouviaggi.png",
    signpost: "/signpost/foryouviaggi_signpost.png",
    easteregg: "Codesour. The final form. Here, Dude became the backend warrior he was always meant to be – Java master, MongoDB/Cassandra tamer, Python spellcaster. Built a GCP beast handling thousands of requests per second. Daily scrums, Jira... the usual grind. But now? A new chapter begins."
  },
  {
    id: "alessi",
    company: "Alessi S.p.a (IT)",
    role: "Software Developer",
    period: "2018 - 2019",
    technologies: ["JavaScript", "PHP", "MySQL", "SQL", "Talend", "Pentaho", "365 API"],
    description: "Developed a monitoring tool for advertising and managed internal databases.",
    website: "https://alessipubblicita.it/",
    position: { x: mainPathConfig.startX - 260, y: 1150 },
    image: "/sprites/buildings/alessi.png",
    signpost: "/signpost/alessi_signpost.png",
    easteregg: "Alessi – a Sicilian giant in outdoor advertising. Here, Dude leveled up: Talend pipelines, database wizardry, little apps keeping track of big ad campaigns. Not bad for a guy who once feared SQL!"
  },
  {
    id: "codesour",
    company: "CodeSour (IT)",
    role: "Software Developer",
    period: "2019 - 2025",
    technologies: [
      "Java", "Spring Boot", "ReactJS", "MongoDB", "CassandraDB", "NiFi",
      "Kafka", "GCP", "Terraform", "Python", "SuperSet", "LLM", "NLP"
    ],
    description: "Developed and architected scalable backend advertising platform with event-driven microservices, processing 10M+ daily AD events. Implemented ML-based predictive analytics and deployed cloud-native infrastructure on GCP. Developed Computer Vision solution for audience analysis.",
    website: "https://codesour.tech/",
    position: { x: mainPathConfig.startX + 390, y: 1160 },
    image: "/sprites/buildings/codesour.png",
    signpost: "/signpost/codesour_signpost.png",
    easteregg: "Codesour. The final form. Here, Dude became the backend warrior he was always meant to be – Java master, MongoDB/Cassandra tamer, Python spellcaster. Built a GCP beast handling thousands of requests per second. Daily scrums, Jira... the usual grind. But now? A new chapter begins."
  },
  {
    id:"???",
    company: "???",
    role: "Your Next Great Hire",
    period: "2025 - Future",
    technologies: ["Your Tech Stack", "Innovation", "Growth"],
    description: "Ready to bring my skills and passion to your team. Let's build something amazing together!",
    position: { x: mainPathConfig.startX-600, y: mainPathConfig.endY - 108 },
    image: "/sprites/buildings/new_opportunity.png",
    signpost: "/signpost/new_opportunity_signpost.png",
    easteregg: "Classified location. Undisclosed mission. All we know is that Dude is heading there, armed with Java, Python, and a healthy skepticism of spaghetti code. Something big is coming."
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
  description: company.description,
  data: company,
  interactionRadius: 80
}));

export const technologies: StructureData[] = technologiesData.map((tech, index) => ({
  id: `tech-${index}`,
  name: tech.name,
  type: 'statue',
  position: tech.position,
  description: tech.description,
  data: tech,
  interactionRadius: 60
}));