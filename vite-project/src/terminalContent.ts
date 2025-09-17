// Static content for the terminal UI.
// Keep only static strings and arrays here so logic in the main component stays focused.

export const PROMPT_USER = "dyno8426";
export const PROMPT_HOST = "know-me-cli";

export const HELP_LINES = [
  "COMMANDS:",
  "  help        → Show available commands",
  "  about       → Who I am",
  "  resume      → Professional background",
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

export const RESUME_LINES = [
  "Experience:",
  "- Microsoft · Applied Scientist / Data Scientist — user modeling, click prediction, large-scale ML",
  "Education:",
  "- MTech CS/ML | BTech CS",
  "Skills:",
  "- Python, PyTorch, Spark, Airflow, SQL, Typescript/React, Next.js, Tailwind",
  "- Causal inference, time-series, epidemiological modeling (in progress)",
  "Tip: try 'projects' or 'contact'.",
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
