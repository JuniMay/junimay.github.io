/**
 * About page content is intentionally data-only.
 *
 * Keeping this file free of JSX logic makes updates easier:
 * - add/remove entries without touching rendering code
 * - reuse the same structure for future profile-like pages
 */

export interface AboutHeroContent {
  routeLabel: string;
  title: string;
  subtitle: string;
  introParagraphs: string[];
}

export interface EducationEntry {
  institution: string;
  program: string;
  locationAndDate: string;
  courseSummary?: string;
}

export interface HonorEntry {
  title: string;
  issuerAndDate: string;
}

export interface CompetitionEntry {
  title: string;
  titleNote?: string;
  award: string;
  roleLocationAndDate: string;
  contextLines?: string[];
  highlights: string[];
}

export interface LanguageSkill {
  label: string;
  detail: string;
}

export interface SkillContent {
  languages: LanguageSkill[];
  programming: string[];
  additional: string[];
}

export interface ContactLink {
  label: string;
  href: string;
  text: string;
}

export const ABOUT_HERO: AboutHeroContent = {
  routeLabel: "/about",
  title: "About Me",
  subtitle:
    "Research-focused undergraduate interested in compilers, systems, and machine learning.",
  introParagraphs: [
    "Hello, my name is Junyi (Juni) Mei. I am currently an undergraduate student at Nankai University, pursuing double degree of Information Security and Law.",
    "Interested in compiler techniques, programming languages, computer architecture, and machine learning.",
    "Also enthusiastic about linguistics and philosophy.",
  ],
};

export const EDUCATION: EducationEntry[] = [
  {
    institution: "Nankai University",
    program: "Information Security and Law",
    locationAndDate: "Tianjin, China | 2021.9 - 2025.8",
    courseSummary:
      "Computer Architecture (92/100), Principles of Compiler (98/100), Operating System (93/100), Computer Networks (93/100), Database System (95/100), etc.",
  },
];

export const HONORS: HonorEntry[] = [
  {
    title: "Innovation Scholarship",
    issuerAndDate: "Nankai University | 2023.10",
  },
  {
    title: "Scholarship of Public Interests and All-Round Capability",
    issuerAndDate: "Nankai University | 2022.10",
  },
];

export const COMPETITIONS: CompetitionEntry[] = [
  {
    title: "2023 Compilation System Design Competition",
    award: "Second Prize",
    roleLocationAndDate: "Team Leader, Guangzhou, 2023.5-2023.8",
    contextLines: ["Computer System Development Capability Competition"],
    highlights: [
      "Developed a RISC-V targeted compiler for SysY (subset of C) with C++, Flex, and Bison.",
      "Constructed the framework and an LLVM-like intermediate representation.",
      "Designed core analysis and optimization passes.",
      "Used GitLab CI/CD to automate tests and evaluate target performance.",
    ],
  },
  {
    title: "2023 Operating System Design Competition",
    award: "Honorable Mention",
    roleLocationAndDate: "Team Leader, Guangzhou, 2023.5-2023.8",
    contextLines: [
      "Functional Design Track",
      "Computer System Development Capability Competition",
    ],
    highlights: ["Added LoongArch support to Tiny C Compiler (TCC)."],
  },
  {
    title: "Tianjin College Students' Cybersecurity Competition",
    award: "Third Prize",
    roleLocationAndDate: "Team Member, Tianjin, 2022.8",
    highlights: [
      "Solved reverse engineering and pwn challenges in the CTF competition.",
    ],
  },
  {
    title: "2022 Compilation System Design Competition",
    award: "Second Prize",
    roleLocationAndDate: "Team Member, Online, 2022.5-2022.8",
    contextLines: ["Computer System Development Capability Competition"],
    highlights: [
      "Assisted in building a compiler targeting ARM architecture.",
      "Added floating-point support and implemented peephole optimization.",
    ],
  },
  {
    title: "2022 Operating System Design Competition",
    award: "Honorable Mention",
    roleLocationAndDate: "Team Leader, Online, 2022.5-2022.8",
    contextLines: [
      "Functional Design Track",
      "Computer System Development Capability Competition",
    ],
    highlights: [
      "Developed an automated compiler tuning tool in Python.",
      "Applied statistical hypothesis testing, LinUCB, and Bayesian optimization.",
    ],
  },
  {
    title: "National University Student Information Storage Technology Competition",
    titleNote: "Massive Storage",
    award: "Third Prize",
    roleLocationAndDate: "Team Member, Tianjin, 2022.10-2023.4",
    highlights: [
      "Assisted in developing a long-term retention memory retrieval system.",
    ],
  },
  {
    title: "5th Peking University Engineering Hackathon",
    titleNote: "HackPKU",
    award: "Excellence Award",
    roleLocationAndDate: "Team Member, Online, 2022.5",
    highlights: [
      "Developed a game with RayLib and C in 36 hours.",
      "Built framework and interface; helped implement Perlin-noise map generation.",
    ],
  },
  {
    title: "Nankai University NFS Smart Vehicle Championship",
    award: "First Prize",
    roleLocationAndDate: "Team Member, Tianjin, 2022.5",
    contextLines: ["Junior Division"],
    highlights: [
      "Engineered an Arduino-based vehicle.",
      "Used infrared sensors and PID control to balance speed and stability.",
    ],
  },
];

export const SKILLS: SkillContent = {
  languages: [
    {
      label: "Languages",
      detail:
        "Chinese (native), English (fluent, CET-6 619, TOEFL 103, GRE 327+3.5), Japanese (basic, CJT-4), German (basic)",
    },
  ],
  programming: [
    "Proficient in Python",
    "Strong understanding of C++ and Rust",
    "Familiar with Mojo, Java, and TypeScript",
    "Basic knowledge of Haskell, Idris2, and Scala",
  ],
  additional: [
    "Knowledge about LLVM and MLIR frameworks and compiler optimization techniques.",
    "Well-acquainted with architectures, ISAs, and specifications such as ARM, RISC-V, and LoongArch.",
    "Understand language model mechanisms (RNNs, Transformers) and vision models (CNNs, ViTs).",
  ],
};

export const ABOUT_SITE_TEXT =
  "This is a simple personal website built with Next.js and Tailwind CSS. Building it with ChatGPT support helped me learn practical frontend development while publishing technical notes.";

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "Email",
    href: "mailto:junimayerst@gmail.com",
    text: "junimayerst@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/junyi-mei-35b524304/",
    text: "Junyi (Juni) Mei",
  },
  {
    label: "GitHub",
    href: "https://github.com/JuniMay",
    text: "JuniMay",
  },
];
