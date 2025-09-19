// Static content for the terminal UI.
// Keep only static strings and arrays here so logic in the main component stays focused.

export const PROMPT_USER = "dyno8426";
export const PROMPT_HOST = "know-me-cli";

export const HELP_LINES = [
  "COMMANDS:",
  "  help        → Show available commands",
  "  about       → Who I am",
  "  work        → Professional background",
  "  projects    → Selected projects",
  "  books       → Recent book notes",
  "  photos      → Photo journal info",
  "  contact     → Reach me",
  "  content txt → Append arbitrary content (e.g., content Hello world)",
  "  clear       → Clear the screen",
  "  theme name  → Switch theme [green|amber|mono]",
  "  banner      → Show ASCII banner",
  "  echo txt    → Print text",
  "  whoami      → Print current user",
  "  date        → Print date/time",
  "  open <url>  → Hint to open a URL",
  "  sudo hire-me→ 😉",
  "  test        → Run built-in self-checks",
];

export const ABOUT_LINES = [
  "Hi, I'm Adarsh Chauhan (he/him).",
  "Senior Software Engineer (9+ yrs ML & large-scale systems).",
  "Currently exploring the intersection of data science and public health (health equity, cancer prevention, epidemiology).",
  "Outside code: photography, book notes, and creative projects.",
];

export const WORK_LINES = [
  "- Google | Bengaluru + Seattle | Senior Software Engineer | May 2020 - present",
  "  ",
  "  Led backend for global identity and collaboration products. Shipped security and group management features used by millions.",
  "  • Designed and launched data residency and privacy systems for enterprise customers.",
  "  • Re-architected backend flows to cut latency for users worldwide (recognized with internal awards).",
  "  • Drove cross-team launches from concept to GA, including phased rollouts and technical alignment.",
  "  • Mentored engineers and set code quality standards, especially in Java readability and backend reliability.",
  "  • Built custom monitoring and test frameworks to improve reliability and oncall experience.",
  "  ",
  "- Intel Labs | Bengaluru | Research Scientist | Aug 2016 - May 2020",
  "  ",
  "  Invented new processor core features and instruction set extensions for next-gen CPUs.",
  "  • Created hardware decompression logic for ultra-fast data access inside the core.",
  "  • Developed auto-predication and dynamic branch prediction techniques for smarter pipelines.",
  "  • Integrated algorithms with micro-architecture to optimize control flow and caching.",
  "  • Authored multiple granted patents and published research papers in computer architecture.",
  "  • Collaborated with global teams to take research from concept to silicon.",
  "  ",
  "Related links: https://www.linkedin.com/in/dyno8426/",
  "  ",
  "Tip: Try `study` to continue this story before work.",
];

export const PROJECTS_LINES = [
  "1) COVID-19 Misinformation & Behavior Signals — WA state time-series (search trends × cases)",
  "2) Smart ICU Monitoring — ML-assisted signals exploration (prototype)",
  "3) Photography Portfolio — curation & generative experiments",
  "Use 'open https://github.com/yeshi' to see GitHub (or your link).",
];

export const BOOKS_LINES = [
  "- Being Mortal — Atul Gawande (notes pending)",
  "- Invisible Women — Caroline Criado Perez (bias × data)",
  "- The Emperor of All Maladies — Siddhartha Mukherjee",
  "Use 'content <your text>' to append your own notes live.",
];

export const PHOTOS_LINES = [
  "Photography journal available in gallery view (GUI mode WIP).",
  "For now, use 'open https://your-domain.com/photos' to view.",
];

export const CONTACT_LINES = [
  "Email   : yeshi@example.com",
  "LinkedIn: https://linkedin.com/in/yeshidolma",
  "GitHub  : https://github.com/yeshi",
];

export const BANNER_ART = String.raw`
                            .-""""""""""""-.
                         .-'                '-.
                       .'                      '.
                      /                          \
                     ;                            ;
                     |                            |
                     |                       .::::|
                     |                    .:::::::|
                     |                      ':::::|
                     |                            |
                     ;                            ;
                      \                          /
                       '.                      .'
                         '-.                .-'
                            '-.__________.-'


                ._______________________________________________.
               /                                               /
              /           .-~~~~~~~~~~~~~~~~~~~~~~~~~-.        /
             /          .'                           '.      /
            /          (                             )      /
           /            '.                         .'        /
          /               '-.___________________.-'         /
         /_________________________________________________/


          "Upward, not Northward"
          — Edwin Abbott Abbott, *Flatland: A Romance of Many Dimensions*
`;

export const SUDO_HIRE_ME_LINES = [
  "Permission granted ✔️",
  "Attaching resume... (pretend)",
  "Email me if you want the PDF link.",
];
