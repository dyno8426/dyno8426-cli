// Static content for the terminal UI.
// Keep only static strings and arrays here so logic in the main component stays focused.

export const PROMPT_USER = "dyno8426";
export const PROMPT_HOST = "know-me-cli";

export const HELP_LINES = [
  "COMMANDS:",
  "  help           → Show available commands",
  "  about          → Who I am",
  "  work           → Professional background",
  "  acads          → Education background",
  "  publications   → Research papers & patents",
  "  projects       → Selected projects",
  "  books          → Recent book notes",
  "  photos         → Photo journal info",
  "  contact        → Reach me",
  "  content txt    → Append arbitrary content (e.g., content Hello world)",
  "  clear          → Clear the screen",
  "  theme name     → Switch theme [green|amber|mono]",
  "  banner         → Show ASCII banner",
  "  echo txt       → Print text",
  "  whoami         → Print current user",
  "  date           → Print date/time",
  "  open <url>     → Hint to open a URL",
  "  sudo hire-me   → 😉",
  "  test           → Run built-in self-checks",
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
  "Out in the world: https://www.linkedin.com/in/dyno8426/",
  "  ",
  "Tip: Try `publications` to see my side-missions originating from work.",
  "[Last updated: September 19, 2025]",
];

export const PUBLICATIONS_LINES = [
  "Select Publications & Patents:",
  "  ",
  "* Auto-predication of critical branches",
  "    • Published in ACM/IEEE 47th Annual International Symposium on Computer Architecture.",
  "* Automatic predication of hard-to-predict convergent branches",
  "    • US Patent 10,754,655",
  "* Instruction and micro-architecture support for decompression on core",
  "    • US Patents 12,182,018 and 12,028,094",
  "* Technology for dynamically tuning processor features",
  "    • US Patents 10,915,421, 11,656,971, and 11,256,599",
  "* Detecting a dynamic control flow re-convergence point for conditional branches in hardware",
  "    • US Patent 11,645,078",
  "  ",
  "Out in the world: https://scholar.google.com/citations?hl=en&user=PDupuQ0AAAAJ",
  "  ",
  "Tip: Try `acads` to continue my story before work.",
  "[Last updated: September 19, 2025]",
];

export const ACADS_LINES = [
  "- Master of Science (M.S.) in Computer Science",
  "  Indian Institute of Technology, Kanpur (July 2015 – June 2016)",
  "  ",
  "  Specialized in Image Classification using Actively Learned CNNs.",
  "  Thesis: Implemented and fine-tuned a CNN for image classification, applying architectures trained on ImageNet.",
  "  Developed and evaluated Active Learning models to improve training efficiency over state-of-the-art methods.",
  "  ",
  "- Bachelor of Technology (B.Tech.) in Computer Science",
  "  Indian Institute of Technology, Kanpur (July 2011 – June 2015)",
  "  ",
  "  Completed core curriculum: Specialized Computer Science and Engineering courses, Physics, Mathematics, Engineering Sciences.",
  "  Focused on professional courses and project work in final two years, with a wide range of electives (Humanities and other engineering department courses) to customize the curriculum.",
  "  ",
  "Tip: Try `hobbies` to continue my story beyond acads and work.",
  "[Last updated: September 19, 2025]",
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
  "Email   : dyno8426@gmail.com",
  "LinkedIn: https://linkedin.com/in/dyno8426",
  "GitHub  : https://github.com/dyno8426",
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
  "Permission granted ✅",
  "Attaching resume ✅",
  "<a href='/resources/AC_CV_Dec2022.pdf' download target='_blank' class='text-blue-400 underline break-all'>Download PDF</a> ⬇️",
];
