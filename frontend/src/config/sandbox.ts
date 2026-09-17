import { WorldConfig, StructureData, CompanyData, TechnologyData, Position, EnvironmentData, Hitbox } from '../types/sandbox';

export const tileSize: number = 128;
export const downloadButtonId: string = 'download-button';
export const maxSizeFileCV : number = 5; //MB
export const downloadCVCooldown: number = 60;

export const questPrefix: string = '-quest'

export const sandboxAudioTrack: string = '/audio/kitchen_sandbox.mp3';
export const sandboxDefaultVolume: number = 25;
export const sandboxBackgroundImage: string = '/backgrounds/kitchen_sky.jpg';

// Feature flags
export const terrainAutoRotate: boolean = false; // set to false to disable random rotation of terrain tiles
export const pathGenerationEnabled: boolean = false; // set to false to disable path generation and rendering
export const hideDownloadButtonInSandbox: boolean = true; // default false (button visible); set to true to hide the Download CV button in the sandbox

export const defaultStatue: string = '/sprites/statues/default.png';
export const defaultBuilding: string = '/sprites/buildings/default.png';
export const mainTerrainImage: string = '/sprites/terrain/kitchen.png';

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
  width: 850,
  height: 1000,
  tileSize: tileSize
};

// Main path configuration
export const mainPathConfig = {
  startX: worldConfig.width / 2,
  startY: 100,
  endY: worldConfig.height,
  width: tileSize
};

// Player spawn position (where the character appears when entering the sandbox)
export const playerSpawnPosition: Position = {
  x: mainPathConfig.startX,
  y: mainPathConfig.startY + 50
};

export const downloadButton : StructureData = {
  id: downloadButtonId,
  name: 'download',
  type: 'statue',
  position: {x: 1400, y: 1400},
  description: "Download CV!",
  data: {
    animatedImage: "/sprites/others/download_button_2_frames.gif",
    id: "download",
    name: "download",
    position: {x: 0, y: 0},
    centering : {x: -130, y: -120},
    image: "/sprites/others/download_button.png",
  },
  interactionRadius: 100
}

export const treesEnvironments: EnvironmentData[]=[
  {
    image: '/sprites/trees/wood_table.png',
    position: { x: 250, y: 450 },
    imageSize: { width: 412, height: 412 },
    collisionHitbox: {
      x:110,
      y: -20,
      width: 190,
      height: 350
    }
  },
  {
    image: '/sprites/trees/metallic_table.png',
    position: { x: 650, y: 700 },
    imageSize: { width: 256, height: 256 },
    collisionHitbox: {
      x:30,
      y: -20,
      width: 190,
      height: 220
    }
  }
]

export const detailsEnvironments: EnvironmentData[] = [
  {
    image: '/sprites/details/cooking_pot.png',
    position: { x: 690, y: 760 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/oil_pepper_salt.png',
    position: { x: 690, y: 670 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/tomato_crate.png',
    position: { x: 790, y: 700 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/basil.png',
    position: { x: 740, y: 740 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/wine.png',
    position: { x: 370, y: 510 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/pot.png',
    position: { x: 710, y: 350 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/cheese.png',
    position: { x: 380, y: 590 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/spaghetti.png',
    position: { x: 420, y: 680 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/pizza_margherita.png',
    position: { x: 420, y: 450 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/chocolate_cake.png',
    position: { x: 420, y: 550 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/moka_pot.png',
    position: { x: 110, y: 350 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/pasta_jar.png',
    position: { x: 800, y: 790 },
    imageSize: { width: 80, height: 80 },
  },
  {
    image: '/sprites/details/flag_germany.png',
    position: { x: 815, y: 400 },
    imageSize: { width: 40, height: 40 },
  },
  {
    image: '/sprites/details/flag_ireland.png',
    position: { x: 95, y: 777 },
    imageSize: { width: 40, height: 40 },
  },
  {
    image: '/sprites/details/flag_ireland.png',
    position: { x: 95, y: 497 },
    imageSize: { width: 40, height: 40 },
  },
  {
    image: '/sprites/details/flag_ireland.png',
    position: { x: 159, y: 109 },
    imageSize: { width: 33, height: 33 },
  },
  {
    image: '/sprites/details/flag_usa.png',
    position: { x: 807, y: 82 },
    imageSize: { width: 50, height: 50 },
  },
]

const companiesData: CompanyData[] = [
  {
    id: "compassgroup2",
    name: "Compass Group Aercap - Dublin IRE",
    shortName: "Compass",
    role: "Commis Chef",
    period: "2018 - 2020",
    technologies: [
      "Prepare bases",
      "Set up line",
      "Assist head chef",
      "Store food",
      "Preserve ingredients",
      "Make garnishes",
      "Decorate dishes"
    ],
    description: "Responsible for preparing the bases and setting up the line for the head chef, ensuring food is stored and preserved correctly, and producing the decorative elements that complete each dish.",
    website: "https://www.compass-group.ie/",
    position: { x: 120, y: 516 },
    image: "/sprites/buildings/compassgroup2.png",
    imageSize: {
      width: 200,
      height: 200
    },
    centering: { x:150, y:350 },
    collisionHitbox: {
      x: -80,
      y: -120,
      width: 150,
      height: 170
    },
    interactionRadius:150
  },
  {
    id: "carpenter",
    name: "Father Carpenter - Berlin DE",
    shortName: "Carpenter",
    role: "Kitchen Manager",
    period: "2024 - 2026",
    technologies: [
      "Manage kitchen",
      "Quality service",
      "Supervise staff",
      "Plan shifts",
      "Assign tasks",
      "Plan menus",
      "Seasonal menus",
      "Cost control",
      "Manage inventory",
      "Supplier orders",
      "Reduce waste",
      "HACCP compliance",
      "Food safety",
      "Improve workflow"
    ],
    description: "Managed daily kitchen operations and supervised staff shifts, planned seasonal, cost-effective menus, oversaw inventory and supplier orders to reduce waste, and ensured HACCP-compliant hygiene and an efficient, well-organized kitchen workflow.",
    website: "https://fathercarpenter.com/",
    position: { x: 800, y: 516 },
    image: "/sprites/buildings/carpenter.png",
    imageSize: {
      width: 200,
      height: 200
    },
    centering: { x:150, y:350 },
    collisionHitbox: {
      x: -80,
      y: -120,
      width: 150,
      height: 170
    },
    interactionRadius:150
  },
  {
    id: "compassgroup3",
    name: "Compass Group Aercap - Dublin IRE",
    shortName: "Compass",
    role: "Commis Chef",
    period: "2020 - 2023",
    technologies: [
      "Manage appetizers",
      "Manage soups",
      "Manage desserts",
      "Manage cold salads",
      "Plan daily menus",
      "Receive goods",
      "Store goods",
      "Inspect equipment",
      "Check fridge temps",
      "Canapé catering"
    ],
    description: "Managed multiple kitchen sections, helped finalize balanced rotating daily menus, received and stored goods to hygiene standards, inspected equipment and fridge temperatures, and prepared canapé catering for monthly social events.",
    website: "https://www.compass-group.ie/",
    position: { x: 120, y: 816 },
    image: "/sprites/buildings/compassgroup-3.png",
    imageSize: {
      width: 200,
      height: 200
    },
    centering: { x:150, y:350 },
    collisionHitbox: {
      x: -80,
      y: -120,
      width: 150,
      height: 170
    },
    interactionRadius:150
  },
  {
    id: "bergamo",
    name: "Ristorante Bergamo - Greenville SC",
    shortName: "Bergamo",
    role: "Sous Chef",
    period: "2023 - 2024",
    technologies: [
      "Oversee kitchen",
      "Create menus",
      "Set kitchen policies",
      "Seasonal menus",
      "Manage inventory",
      "Cut food waste",
      "Tasting menus",
      "Event catering",
      "Food safety",
      "Clean workstation"
    ],
    description: "Oversaw kitchen operations alongside the head chef, developed seasonal and tasting menus for special events, implemented an inventory system that cut food waste by 15%, and upheld food safety standards.",
    website: "https://www.ristorantebergamogreenville.com/",
    position: { x: 800, y: 156 },
    image: "/sprites/buildings/bergamorestaurant.png",
    imageSize: {
      width: 350,
      height: 250
    },
    centering: { x:80, y:350 },
    collisionHitbox: {
      x: -80,
      y: -130,
      width: 150,
      height: 240
    },
    interactionRadius:150
  },
  {
    id: "compassgroup",
    name: "Compass Group Aercap - Dublin IRE",
    shortName: "Compass",
    role: "Kitchen Porter",
    period: "2017 - 2018",
    technologies: [
      "Wash dishes",
      "Wash glasses",
      "Wash cutlery",
      "Wash utensils",
      "Clean ovens",
      "Clean fridges",
      "Clean hoods",
      "Clean equipment"
    ],
    description: "Responsible for keeping the kitchen clean and running smoothly: washing dishes, glasses, cutlery and utensils by hand or in the dishwasher, and cleaning ovens, refrigerators, extractor hoods and other equipment.",
    website: "https://www.compass-group.ie/",
    position: { x: 120, y: 216 },
    image: "/sprites/buildings/compassgroup.png",
    imageSize: {
      width: 200,
      height: 200
    },
    centering: { x:150, y:350 },
    collisionHitbox: {
      x: -80,
      y: -130,
      width: 150,
      height: 240
    },
    interactionRadius:150
  }
];

const technologiesData: TechnologyData[] = [
  
];

export const companies: StructureData[] = companiesData.map((company, index) => ({
  id: company.id,
  name: company.name,
  type: 'building',
  position: company.position,
  description: company.description,
  data: company,
  interactionRadius: company.interactionRadius !== undefined ? company.interactionRadius : 250
}));

export const technologies: StructureData[] = technologiesData.map((tech, index) => ({
  id: tech.id,
  name: tech.name,
  type: 'statue',
  position: tech.position,
  description: tech.description ? tech.description : '',
  data: tech,
  interactionRadius: tech.interactionRadius !== undefined ? tech.interactionRadius : 100
}));