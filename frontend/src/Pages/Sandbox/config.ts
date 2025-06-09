import { WorldConfig, StructureData, CompanyData, TechnologyData, Position, EnvironmentData, Hitbox } from '../../types/sandbox';

export const tileSize: number = 128;

export const playerHitbox: Hitbox = {
  x: -16,
  y: -16,
  width: 32,
  height: 32
};

export const structureCentering: Position = {
  x: -256,
  y: -490
}

export const technologyCentering: Position = {
  x: -90,
  y: -200,
}

// World configuration
export const worldConfig: WorldConfig = {
  width: 2000,
  height: 3024,
  tileSize: tileSize
};

// Main path configuration
export const mainPathConfig = {
  startX: worldConfig.width / 2,
  startY: 100,
  endY: worldConfig.height,
  width: tileSize
};

export const treesEnvironments: EnvironmentData[]=[
  {
    image: '/sprites/trees/carrubba_1.png',
    position: {x:1150,y: -80},
  },
  {
    image: '/sprites/trees/carrubba_2.png',
    position: {x:100,y:550},
  },
  {
    image: '/sprites/trees/olive_1.png',
    position: {x:1700,y:200},
  },
  {
    image: '/sprites/trees/olive_2.png',
    position: {x:200,y:1400},
  },
  {
    image: '/sprites/trees/orange_1.png',
    position: {x:1700,y:1500},
  },
  {
    image: '/sprites/trees/orange_2.png',
    position: {x:200,y:2100},
  },
  {
    image: '/sprites/trees/palm_1.png',
    position: {x:1400,y:2200},
  },
  {
    image: '/sprites/trees/palm_2.png',
    position: {x:700,y:1600},
  },
  {
    image: '/sprites/trees/prickly_1.png',
    position: {x:1600,y:2600},
  },
  {
    image: '/sprites/trees/prickly_2.png',
    position: {x:1350,y:700},
  },
]

export const detailsEnvironments: EnvironmentData[] = [
    {
    image: "/sprites/details/barrel_1.png",
    position: {"x": 550, "y": 20}
  },
  {
    image: "/sprites/details/barrel_2.png",
    position: {"x": 1200, "y": 2880}
  },
  {
    image: "/sprites/details/bench.png",
    position: {"x": 830, "y": 300}
  },
  {
    image: "/sprites/details/box_1.png",
    position: {"x": 450, "y": 320}
  },
  {
    image: "/sprites/details/box_2.png",
    position: {"x": 1670, "y": 1380}
  },
  {
    image: "/sprites/details/box_leaf_1.png",
    position: {"x": 1800, "y": 900}
  },
  {
    image: "/sprites/details/box_leaf_2.png",
    position: {"x": 530, "y": 2750}
  },
  {
    image: "/sprites/details/box_leaf_3.png",
    position: {"x": 650, "y": 1100}
  },
  {
    image: "/sprites/details/bucket.png",
    position: {"x": 570, "y": 2300}
  },
  {
    image: "/sprites/details/firepit.png",
    position: {"x": 1100, "y": 1300}
  },
  {
    image: "/sprites/details/flower_1.png",
    position: {"x": 180, "y": 480}
  },
  {
    image: "/sprites/details/flower_2.png",
    position: {"x": 1580, "y": 320}
  },
  {
    image: "/sprites/details/flower_3.png",
    position: {"x": 1050, "y": 2050}
  },
  {
    image: "/sprites/details/flower_4.png",
    position: {"x": 1050, "y": 1150}
  },
  {
    image: "/sprites/details/flower_5.png",
    position: {"x": 280, "y": 1750}
  },
  {
    image: "/sprites/details/flower_6.png",
    position: {"x": 1650, "y": 1850}
  },
  {
    image: "/sprites/details/pot_1.png",
    position: {"x": 860, "y": 450}
  },
  {
    image: "/sprites/details/lamp_2.png",
    position: {"x": 1050, "y": 870}
  },
  {
    image: "/sprites/details/lamp.png",
    position: {"x": 1050, "y": 1900}
  },
  {
    image: "/sprites/details/log_1.png",
    position: {"x": 1750, "y": 2050}

  },
  {
    image: "/sprites/details/log_2.png",
    position: {"x": 1250, "y": 1450}
  },
  {
    image: "/sprites/details/log_3.png",
    position: {"x": 850, "y": 1900}
  },
  {
    image: "/sprites/details/pond.png",
    position: {"x": 450, "y": 2300}
  },
  {
    image: "/sprites/details/rocks_1.png",
    position: {"x": 150, "y": 1050}
  },
  {
    image: "/sprites/details/rocks_2.png",
    position: {"x": 1850, "y": 1150}
  },
  {
    image: "/sprites/details/rocks_3.png",
    position: {"x": 320, "y": 2650}
  },
  {
    image: "/sprites/details/rocks_4.png",
    position: {"x": 1620, "y": 2350}
  },
  {
    image: "/sprites/details/small_tree.png",
    position: {"x": 870, "y": 2730}
  }
]

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
    position: { x: mainPathConfig.startX + 646, y: 216 },
    image: "/sprites/buildings/eikony.png",
    signpost: "/sprites/signpost/eikony_signpost.png",
    easteregg: "Once upon a time, Dude spent his days debugging Java classes in a small app development company. After 6 months of internship, he looked at the career ladder… and decided to climb a different one: university. Fair choice, honestly.",
    collisionHitbox: {
      x: -140,
      y: -390,
      width: 285,
      height: 370
    }
  },
  {
    id: "unipa",
    company: "University - Computer Science",
    role: "Student",
    period: "2015 - 2019",
    technologies: ["Java", "MySQL", "C", "Open Data", "CSN"],
    description: "Bachelor's Degree in Computer Science",
    website: "https://www.unipa.it/",
    position: { x: mainPathConfig.startX - 768, y: 462 },
    image: "/sprites/buildings/unipa.png",
    signpost: "/sprites/signpost/unipa_signpost.png",
    easteregg: "Ah, UniPA. Four long years of Computer Science – plus a bonus one, just for fun. Dude didn’t finish the degree (money stuff, life stuff), but that’s probably where the spark for coding truly ignited. Thanks, UniPA!",
    collisionHitbox: {
      x: -165,
      y: -460,
      width: 335,
      height: 415
    }
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
    position: { x: mainPathConfig.startX + 768, y: 954 },
    image: "/sprites/buildings/foryouviaggi.png",
    signpost: "/sprites/signpost/foryouviaggi_signpost.png",
    easteregg: "Codesour. The final form. Here, Dude became the backend warrior he was always meant to be – Java master, MongoDB/Cassandra tamer, Python spellcaster. Built a GCP beast handling thousands of requests per second. Daily scrums, Jira... the usual grind. But now? A new chapter begins.",
    collisionHitbox: {
      x: -175,
      y: -467,
      width: 345,
      height: 445
    }
  },
  {
    id: "alessi",
    company: "Alessi S.p.a (IT)",
    role: "Software Developer",
    period: "2018 - 2019",
    technologies: ["JavaScript", "PHP", "MySQL", "SQL", "Talend", "Pentaho", "365 API"],
    description: "Developed a monitoring tool for advertising and managed internal databases.",
    website: "https://alessipubblicita.it/",
    position: { x: mainPathConfig.startX - 512, y: 1228 },
    image: "/sprites/buildings/alessi.png",
    signpost: "/sprites/signpost/alessi_signpost.png",
    easteregg: "Alessi – a Sicilian giant in outdoor advertising. Here, Dude leveled up: Talend pipelines, database wizardry, little apps keeping track of big ad campaigns. Not bad for a guy who once feared SQL!",
    collisionHitbox: {
      x: -145,
      y: -480,
      width: 285,
      height: 430
    }
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
    position: { x: mainPathConfig.startX + 512, y: 1520 },
    image: "/sprites/buildings/codesour.png",
    signpost: "/sprites/signpost/codesour_signpost.png",
    easteregg: "Codesour. The final form. Here, Dude became the backend warrior he was always meant to be – Java master, MongoDB/Cassandra tamer, Python spellcaster. Built a GCP beast handling thousands of requests per second. Daily scrums, Jira... the usual grind. But now? A new chapter begins.",
    collisionHitbox: {
      x: -135,
      y: -500,
      width: 285,
      height: 470
    }
  },
  {
    id:"???",
    company: "???",
    role: "Your Next Great Hire",
    period: "2025 - Future",
    technologies: ["Your Tech Stack", "Innovation", "Growth"],
    description: "Ready to bring my skills and passion to your team. Let's build something amazing together!",
    position: { x: mainPathConfig.startX - 640, y: mainPathConfig.endY - 108 },
    image: "/sprites/buildings/new_opportunity.png",
    signpost: "/sprites/signpost/new_opportunity_signpost.png",
    easteregg: "Classified location. Undisclosed mission. All we know is that Dude is heading there, armed with Java, Python, and a healthy skepticism of spaghetti code. Something big is coming.",
    collisionHitbox: {
      x: -185,
      y: -480,
      width: 375,
      height: 450
    }
  }
];

// Technology data with specific positions
const technologiesData: TechnologyData[] = [
  {
    name: "Java",
    category: "Programming Language",
    level: "Expert",
    yearsExperience: 5,
    description: "Core enterprise language with Spring Boot, microservices, OAUTH2, event-driven design and cloud scaling via GCP and AWS.",
    projects: [
      "OAUTH2 with Gateway Service with guest access",
      "File Parser Service with Chain of responsibility",
      "Advertising Tracking Service scaling on GCP",
      "Aggregation data Service for revenue reporting platform with realtime data",
      "Advertising Company Platform",
      "Mobile Application for EU project"
    ],
    extras: ["SpringBoot", "Maven", "CI/CD", "MVC", "FeignClient", "OAUTH2", "Zuul", "Kafka", "PubSub", "Redis Server", "Ribbon", "Design Pattern", "Prometheus", "MongoDB", "CassandraDB", "SQL", "MySQL", "InfluxDB", "ElasticSearch", "GCP", "AWS", "Docker", "Git"],
    position: { x: mainPathConfig.startX + 256, y: 708 },
    image: "/sprites/statues/java.png",
    shadow: { height: 50, width:220 , position: {x: 85, y:230}},
    centering : {x: -50, y: 30}
  },
  {
    name: "Python",
    category: "Programming Language",
    level: "Expert",
    yearsExperience: 4,
    description: "Used for APIs, real-time analytics, computer vision, and NLP. Flask-based services with forecasting and audience tracking.",
    projects: [
      "Audience Tracking Real Time",
      "Contextual text with NLP",
      "Forecast Service for revenue income",
      "Headless CMS: ReactJS + Python + MetaAPI Hooks",
      "Gender & Age Analysis Service"
    ],
    extras: ["Flask", "Notebook", "OAUTH2", "CI/CD", "Forecast", "NLP", "Scrapy", "Computer Vision", "Gender Analysis", "Age Analysis", "Meta API", "Kafka", "PubSub", "Prometheus", "MongoDB", "MySQL", "InfluxDB", "Docker", "Git"],
    position: { x: mainPathConfig.startX - 160, y: 944 },
    image: "/sprites/statues/python.png",
    centering : {x: 0, y: 20},
    shadow: { height: 30, width:140 , position: {x:135, y:240}}
  },
  {
    name: "Golang",
    category: "Programming Language",
    level: "Beginner",
    yearsExperience: 1,
    description: "Built REST APIs and WebSocket chat apps with Gin. Implemented OAUTH2 flow and studied event-driven patterns.",
    projects: [
      "This Awesome Website",
      "Chat App in real time"
    ],
    extras: ["Gin", "WebSocket", "OAUTH2", "MongoDB", "Docker", "Git"],
    position: { x: mainPathConfig.startX + 512, y: 2776 },
    image: "/sprites/statues/golang.png",
    centering : {x: -70, y: -10},
    shadow: { height: 20, width:140 , position: {x: 65, y:220}},

  },
  {
    name: "JavaScript",
    category: "Programming Language",
    level: "Advanced",
    yearsExperience: 3,
    description: "Developed frontend apps using ES6+, ReactJS, React Native, and CRM integrations. Used for ads, tracking, and utility scripts.",
    projects: [
      "This Awesome Website",
      "Headless CMS: ReactJS + Python + MetaAPI Hooks",
      "Chat App in real time",
      "Advertising Company Platform"
    ],
    extras: ["ES7", "CI/CD", "TypeScript", "ReactJS", "React Native", "365 SDK", "GAM", "Tracking Script"],
    position: { x: mainPathConfig.startX + 256, y: 442 },
    image: "/sprites/statues/javascript.png",
    centering : {x: -70, y: 10},
    shadow: { height: 30, width:180 , position: {x: 60, y:230}},
  },
  {
    name: "Kafka & Google PubSub",
    category: "Messaging and Queue",
    level: "Advanced",
    yearsExperience: 3,
    description: "Used Kafka and PubSub for scalable, event-driven microservices handling over 10M+ messages on cloud and local infra.",
    projects: [
      "Advertising Tracking Service Scaling on GCP",
      "Advertising Company Platform"
    ],
    extras: ["10M+ Requests", "Java", "Python", "Docker", "Git"],
    position: { x: mainPathConfig.startX - 256, y: 2372 },
    image: "/sprites/statues/kafka.png",
    centering : {x: -10, y: 10},
    shadow: { height: 40, width:170 , position: {x:120, y:230}},

  },
  {
    name: "MongoDB",
    category: "Database",
    level: "Expert",
    yearsExperience: 4,
    description: "Document-based DB used with various languages. Clustered 2B+ records with indexing optimizations.",
    projects: [
      "Headless CMS: ReactJS + Python + MetaAPI Hooks",
      "This Awesome Website",
      "Chat App In Real Time",
      "Mobile Application for EU project",
      "Advertising Company Platform",
      "OAUTH2 with Gateway Service with guest access",
      "File Parser Service with Chain of responsibility",
      "Aggregation Service for revenue reporting with realtime data",
      "Contextual text with NLP"
    ],
    extras: ["2B+ data", "Cluster", "Indexes Optimization", "Docker"],
    position: { x: mainPathConfig.startX - 256, y: 1476 },
    image: "/sprites/statues/mongodb.png",
    shadow: { height: 15, width:100 , position: {x:130, y:230}},

  },
  {
    name: "CassandraDB",
    category: "Database",
    level: "Advanced",
    yearsExperience: 3,
    description: "Used for high-throughput real-time data tracking. Clustered over 5B+ records efficiently.",
    projects: [
      "Audience Tracking Real Time",
      "Advertising Company Platform",
      "Aggregation Service for revenue reporting with realtime data"
    ],
    extras: ["5B+ data", "Cluster", "Indexes Optimization", "Docker"],
    position: { x: mainPathConfig.startX + 256, y: 2480 },
    image: "/sprites/statues/cassandra.png",
    centering : {x: -50, y: 0},
    shadow: { height: 15, width:180 , position: {x:80, y:250}},

  },
  {
    name: "ElasticSearch",
    category: "Other",
    level: "Intermediate",
    yearsExperience: 2,
    description: "Centralized logging solution deployed both on cloud and self-hosted environments.",
    projects: ["Advertising Company Platform"],
    extras: ["Cloud", "Docker"],
    position: { x: mainPathConfig.startX + 512, y: 1968 },
    image: "/sprites/statues/elastic.png",
    centering : {x: -70, y: 0},
    shadow: { height: 15, width:180 , position: {x:60, y:250}},

  },
  {
    name: "MySQL & SQL",
    category: "Database",
    level: "Expert",
    yearsExperience: 5,
    description: "Strong background in relational databases. Designed reporting infrastructure with clustering and optimized indexing.",
    projects: [
      "Aggregation Service for revenue reporting with realtime data",
      "Headless CMS: ReactJS + Python + MetaAPI Hooks"
    ],
    extras: ["Cluster", "Indexes Optimization", "Docker"],
    position: { x: mainPathConfig.startX - 256, y: 698 },
    image: "/sprites/statues/sql.png",
    centering : {x: 10, y: 10},
    shadow: { height: 15, width:240 , position: {x:145, y:245}},

  },
  {
    name: "Docker",
    category: "Dev/Ops",
    level: "Expert",
    yearsExperience: 5,
    description: "Containerized all projects using Docker Compose and Dockerfiles. Built private/public images.",
    projects: [
      "OAUTH2 with Gateway Service with guest access",
      "File Parser Service with Chain of responsibility",
      "Aggregation Service for revenue reporting with realtime data",
      "Audience Tracking Real Time",
      "Contextual text with NLP",
      "Headless CMS: ReactJS + Python + MetaAPI Hooks",
      "This Awesome Website",
      "Chat App In Real Time",
      "Mobile Application for EU project",
      "Advertising Company Platform",
      "Forecast Service for revenue income"
    ],
    extras: ["Docker", "Docker Compose", "Docker Hub"],
    position: { x: mainPathConfig.startX + 156, y: 1732 },
    image: "/sprites/statues/docker.png",
    centering : {x: -40, y: 0},
    shadow: { height: 15, width:250 , position: {x:80, y:230}},

  },
  {
    name: "Amazon AWS",
    category: "Cloud",
    level: "Intermediate",
    yearsExperience: 2,
    description: "Integrated AWS services with Java/Python. Used AWS CLI and buckets in ETL workflows.",
    projects: ["Advertising Company Platform"],
    extras: ["Java", "NiFi", "AWS Cli", "ETL"],
    position: { x: mainPathConfig.startX - 512, y: 1860 },
    image: "/sprites/statues/aws.png",
    shadow: { height:30, width:210 , position: {x:135, y:220}},

  },
  {
    name: "Google Cloud Platform",
    category: "Cloud",
    level: "Advanced",
    yearsExperience: 3,
    description: "Built scalable cloud infrastructure using PubSub, VMs, and Terraform on GCP.",
    projects: [
      "Advertising Company Platform",
      "Aggregation Service for revenue reporting with realtime dat",
      "Audience Tracking Real Time"
    ],
    extras: ["Java", "Python", "Terraform", "PubSub"],
    position: { x: mainPathConfig.startX - 256, y: 2116 },
    image: "/sprites/statues/gcp.png",
    centering : {x: -30, y: 0},
    shadow: { height: 30, width:220 , position: {x:110, y:220}},

  },
  {
    name: "Pipelines",
    category: "Other",
    level: "Expert",
    yearsExperience: 5,
    description: "Built CI/CD, ETL, OLAP pipelines with Java, Python, and Terraform. Scheduled via PM2 and Chron jobs.",
    projects: [
      "Audience Tracking Real Time",
      "Contextual text with NLP",
      "Forecast Service for revenue income",
      "Advertising Company Platform",
      "Aggregation Service for revenue reporting with realtime data"
    ],
    extras: ["Java", "Python", "CI/CD", "Talend", "Nifi", "PM2", "ChronJob", "ETL", "OLAP", "Terraform"],
    position: { x: mainPathConfig.startX + 256, y: 2244 },
    image: "/sprites/statues/pipelines.png",
    centering : {x: -60, y: 0},
    shadow: { height: 30, width:150 , position: {x:70, y:225}},

  },
  {
    name: "ETL & OLAP",
    category: "Other",
    level: "Expert",
    yearsExperience: 5,
    description: "Managed complex ETL flows and OLAP cubes using Nifi, Talend, Superset, and Pentaho.",
    projects: [
      "Audience Tracking Real Time",
      "Contextual text with NLP",
      "Forecast Service for revenue income",
      "Advertising Company Platform",
      "Aggregation Service for revenue reporting with realtime data"
    ],
    extras: ["Nifi", "Talend", "Pentaho", "Superset"],
    position: { x: mainPathConfig.startX + 256, y: 1230 },
    image: "/sprites/statues/etl.png",
    centering : {x: -50, y: 0},
    shadow: { height: 25, width:120 , position: {x:70, y:225}},
  },
  {
    name: "Git",
    category: "Dev/Ops",
    level: "Expert",
    yearsExperience: 5,
    description: "Used GitLab and GitHub to manage all projects. Integrated CI/CD for Java and ReactJS.",
    projects: [
      "OAUTH2 with Gateway Service with guest access",
      "File Parser Service with Chain of responsibility",
      "Aggregation Service for revenue reporting with realtime data",
      "Audience Tracking Real Time",
      "Contextual text with NLP",
      "Headless CMS: ReactJS + Python + MetaAPI Hooks",
      "This Awesome Website",
      "Chat App In Real Time",
      "Mobile Application for EU project",
      "Advertising Company Platform",
      "Forecast Service for revenue income"
    ],
    extras: ["CI/CD", "GitLab", "GitHub", "Java", "SpringBoot", "ReactJS", "Python", "Go", "Javascript"],
    position: { x: mainPathConfig.startX - 256, y: 186 },
    image: "/sprites/statues/git.png",
    centering : {x: 60, y: 0},
    shadow: { height: 25, width:220 , position: {x:135, y:240}},

  },
  {
    name: "Artificial Intelligence",
    category: "Other",
    level: "Beginner",
    yearsExperience: 1,
    description: "Used Computer Vision, NLP, forecasting and gender/age analysis for real-time and contextual data solutions.",
    projects: [
      "Contextual text with NLP",
      "Forecast Service for revenue income",
      "Audience Tracking Real Time",
      "Gender & Age Analysis Service"
    ],
    extras: ["Python", "NLP", "Gender Analysis", "Age Analysis", "Computer Vision", "Forecast"],
    position: { x: mainPathConfig.startX - 256, y: 2628 },
    image: "/sprites/statues/machinelearning.png",
    centering : {x:-30, y: -10},
    shadow: { height: 25, width:200 , position: {x:105, y:225}},
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
  interactionRadius: 250
}));

export const technologies: StructureData[] = technologiesData.map((tech, index) => ({
  id: `tech-${index}`,
  name: tech.name,
  type: 'statue',
  position: tech.position,
  description: tech.description,
  data: tech,
  interactionRadius: 100
}));