export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  emoji: string;
  archived: boolean;
  shared: boolean;
  shareId: string;
  createdAt: string;
  updatedAt: string;
  aiInteractions: number;
};

export const FOLDERS = [
  { label: "🔬 Science Magic", value: "Science Magic" },
  { label: "🚀 Space & Planets", value: "Space & Planets" },
  { label: "🦕 Dino History", value: "Dino History" },
  { label: "💻 Coding 101", value: "Coding 101" },
  { label: "🧮 Math Wizard", value: "Math Wizard" },
  { label: "🎨 Creative Arts", value: "Creative Arts" },
  { label: "📚 General", value: "General" },
];

export const FOLDER_EMOJIS: Record<string, string> = {
  "Science Magic": "🔬",
  "Space & Planets": "🚀",
  "Dino History": "🦕",
  "Coding 101": "💻",
  "Math Wizard": "🧮",
  "Creative Arts": "🎨",
  "General": "📚",
};

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export const SEED_NOTES: Note[] = [
  {
    id: "seed1",
    title: "Magic of Photosynthesis ✨",
    content: "Plants use sunlight and water to make their own food!\n\nThis magical process is called Photosynthesis.\n\nHere's how it works:\n1. 🌞 The plant absorbs sunlight with its leaves\n2. 💧 The roots suck up water from the ground\n3. 💨 The leaves breathe in Carbon Dioxide from the air\n4. ✨ Magic happens and the plant makes its own sugar!\n\nThe leftover product? Pure oxygen for us to breathe! 🌬️",
    tags: ["science", "biology", "plants"],
    folder: "Science Magic",
    emoji: "🔬",
    archived: false,
    shared: false,
    shareId: "share-seed1",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    aiInteractions: 3,
  },
  {
    id: "seed2",
    title: "How Computers Think 💻",
    content: "Computers follow step-by-step instructions called CODE to do amazing things!\n\nA program is like a recipe:\n- The computer is the chef\n- The code is the recipe\n- The output is the delicious dish!\n\nComputers use Binary (0s and 1s) to represent everything.",
    tags: ["coding", "computers", "tech"],
    folder: "Coding 101",
    emoji: "💻",
    archived: false,
    shared: true,
    shareId: "share-seed2",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    aiInteractions: 5,
  },
  {
    id: "seed3",
    title: "Awesome Dinosaur Facts 🦕",
    content: "Dinosaurs ruled the Earth for over 165 million years!\n\nCool facts:\n- T-Rex had arms too short to reach its mouth 😂\n- Triceratops had THREE horns for protection\n- Some dinosaurs were the size of a chicken!\n- Birds are actually modern-day dinosaurs 🐦",
    tags: ["history", "dinosaurs", "science"],
    folder: "Dino History",
    emoji: "🦕",
    archived: false,
    shared: false,
    shareId: "share-seed3",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    aiInteractions: 2,
  },
];
