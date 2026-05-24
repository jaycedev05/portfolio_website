export const SITE_NAME = 'Jayce Garcia'
export const SITE_TITLE = 'Jayce Garcia — Full-Stack Developer'
export const SITE_HANDLE = 'jayce.garcia'
export const SITE_EMAIL = 'hello@jaycegarcia.dev'
export const PORTRAIT_IMAGE = 'https://picsum.photos/seed/jayce-garcia-portrait/600/800.jpg'

export type ProjectCategory = 'saas' | 'mobile' | 'platform' | 'ai'

export type ProjectFilter = 'all' | ProjectCategory

export interface ModalStat {
  value: string
  label: string
}

export interface Project {
  id: string
  category: ProjectCategory
  title: string
  description: string
  image: string
  cardImage: string
  tags: string[]
  techStack: string[]
  modalTags: string[]
  summary: string
  url: string
  challenge?: string
  approach?: string[]
  results: ModalStat[]
  modalTechStack: string[]
  role?: string
}

export const HERO_TAGLINE =
  'I build AI-powered web and mobile apps with startup speed, clean execution, and real product thinking — MVPs built to launch, learn, and scale.'

export const ABOUT_HEADLINE = 'Built for founders who need a product partner'

export const ABOUT_PARAGRAPHS = [
  "Hi, I'm a Full-Stack Developer who builds AI-powered web and mobile apps with startup speed, clean execution, and real product thinking.",
  "I've worked with multiple startups and helped launch 20+ applications, so I understand what founders actually need: someone who can move fast, communicate clearly, solve problems without drama, and take ownership like a true product partner — not just \"write code.\"",
  'I specialize in full-stack development, mobile apps, Claude AI integrations, AI-powered workflows, and MVPs that are built to launch, learn, and scale.',
]

export const ABOUT_DIFFERENTIATOR = {
  title: "Why I'm different",
  body: 'I only take on a few projects at a time because I want to be fully invested in the work. I care about the product, the user experience, the business goals, and the long-term outcome — not just closing a ticket or pushing code. If you\'re building something meaningful, I\'ll help you make the right technical decisions, avoid wasted development, and turn your idea into a product people actually want to use.',
}

export const ABOUT_STARTUP_INTRO =
  "I've worked with fast-moving startup teams where speed, clarity, and ownership matter every day."

export interface CaseStudy {
  id: string
  category: string
  year: string
  title: string
  description: string
  image: string
  imageRight?: boolean
  stats: ModalStat[]
  skills: string[]
  projectId: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  avatar: string
}

export interface Skill {
  label: string
  percent: number
  highlight?: boolean
}

export interface Experience {
  title: string
  company: string
  period: string
  active?: boolean
}

export const PROJECT_FILTERS: { id: ProjectFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'saas', label: 'SaaS' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'platform', label: 'Platform' },
  { id: 'ai', label: 'AI/ML' },
]

export const STATS = [
  { value: '20+', label: 'Apps Launched', highlight: false },
  { value: '9+', label: 'Years Experience', highlight: false },
  { value: '3', label: 'Startup Products', highlight: false },
  { value: '10K+', label: 'Educators Reached', highlight: true },
]

export const PROJECTS: Project[] = [
  {
    id: 'boompop',
    category: 'platform',
    title: 'BoomPop',
    description:
      'Modern events platform for company offsites, retreats, and group events — self-serve planning or full-service execution with venue sourcing and guest management.',
    image: '/projects/boompop.jpg',
    cardImage: '/projects/boompop.jpg',
    tags: ['Platform', 'Events'],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    modalTags: ['Events', 'SaaS'],
    summary:
      'BoomPop is the operating system for group events — from offsites and SKOs to conferences and incentive trips. Teams can run everything in one platform or bring in BoomPop planners for full-service execution, including hotel and vendor sourcing, guest management, ticketing, and AI-assisted coordination.',
    url: 'https://boompop.com/',
    challenge:
      'Corporate event planning spans dozens of moving parts — budgets, venues, vendors, guest lists, and onsite logistics — yet most teams still juggle spreadsheets and email. The product needed to feel simple for organizers while supporting complex, multi-city programs at scale.',
    approach: [
      'Built product features around intuitive event-planning workflows so complex logistics feel approachable',
      'Designed scalable flows for guest management, vendor sourcing, and ticketing within a unified platform',
      'Improved performance and clarity across high-traffic planning paths used by fast-moving teams',
      'Partnered closely on UX so self-serve and full-service offerings feel like one cohesive product',
    ],
    results: [
      { value: '500K+', label: 'Attendees Hosted' },
      { value: '500+', label: 'Vendor Partners' },
      { value: '$13.9M', label: 'Customer Savings' },
      { value: 'Inc. 5000', label: 'Fast-Growing Co.' },
    ],
    modalTechStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST APIs', 'AWS', 'Real-time updates'],
    role: 'Contributed full-stack product work on event management flows — smooth user journeys, scalable architecture, and planning workflows that simplify venue sourcing, guest coordination, and multi-day corporate programs.',
  },
  {
    id: 'infinite-giving',
    category: 'saas',
    title: 'Infinite Giving',
    description:
      'Nonprofit financial platform for cash reserves, investments, and unified donations — cash, stock, crypto, and donor-advised funds in one embeddable experience.',
    image: '/projects/infinite-giving.jpg',
    cardImage: '/projects/infinite-giving.jpg',
    tags: ['FinTech', 'Nonprofit'],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    modalTags: ['FinTech', 'Nonprofit'],
    summary:
      'Infinite Giving helps nonprofits simplify cash management, investments, and complex donations with seamless technology and fiduciary oversight. Organizations open brokerage accounts digitally, manage reserves and growth portfolios, and accept cash, stock, crypto, and DAF gifts through a unified donation widget with QuickBooks and CRM integrations.',
    url: 'https://www.infinitegiving.com/',
    challenge:
      'Nonprofits juggle fragmented tools for banking, investing, and accepting non-cash gifts — often with high fees and slow onboarding. The platform had to earn trust, meet compliance expectations, and still feel fast and approachable for lean teams.',
    approach: [
      'Shipped clean dashboard experiences for reserves, investments, and donation activity',
      'Built secure, reliable workflows around account onboarding and financial operations',
      'Unified donation tooling so teams can accept multiple gift types without juggling vendors',
      'Focused on clarity and performance so finance leaders spend less time on admin',
    ],
    results: [
      { value: '0%', label: 'Stock Gift Fees' },
      { value: '30 min', label: 'Digital Onboarding' },
      { value: '$5M', label: 'FDIC Sweep Coverage' },
      { value: 'SEC', label: 'Registered Adviser' },
    ],
    modalTechStack: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Stripe / payments',
      'QuickBooks',
      'CRM integrations',
      'AWS',
    ],
    role: 'Contributed product and engineering work on dashboards, secure financial workflows, and donation tooling — helping nonprofits manage assets, maximize returns, and grow impact with less operational overhead.',
  },
  {
    id: 'schoolai',
    category: 'ai',
    title: 'SchoolAI',
    description:
      'AI education platform trusted by 1M+ educators — personalized learning with Dot, real-time student insights, Spaces lesson library, and teacher-safe workflows.',
    image: '/projects/schoolai.jpg',
    cardImage: '/projects/schoolai.jpg',
    tags: ['AI/ML', 'EdTech'],
    techStack: ['React', 'TypeScript', 'Node.js', 'LLM APIs'],
    modalTags: ['AI/ML', 'EdTech'],
    summary:
      'SchoolAI empowers every learner and supports every educator with a trusted AI platform built for classrooms. Teachers personalize instruction, create lessons in minutes, monitor student progress in real time, and use Dot — an adaptive learning assistant — while maintaining safety controls and district oversight through Mission Control.',
    url: 'https://schoolai.com/',
    challenge:
      'Education products must balance powerful AI with teacher control, student safety, and classroom usability. Experiences need to be fast, approachable for non-technical educators, and reliable at district scale.',
    approach: [
      'Built product experiences where usability and performance were as critical as AI capability',
      'Designed flows for lesson creation, differentiation, and real-time progress visibility',
      'Integrated AI-powered interactions that adapt to how students learn without losing teacher oversight',
      'Prioritized responsive UI and clear next steps so educators can act when students struggle',
    ],
    results: [
      { value: '100K+', label: 'Classrooms' },
      { value: '200K+', label: 'Teacher Spaces' },
      { value: '60+', label: 'Languages' },
      { value: '10+ hrs', label: 'Saved Per Week' },
    ],
    modalTechStack: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Claude / LLM APIs',
      'Chrome Extension',
      'WebSockets',
      'AWS',
    ],
    role: 'Worked on product experiences for teachers and students — usability, performance, and AI-powered flows for personalized learning, classroom resources, and progress tracking at scale.',
  },
  {
    id: 'asl-flurry',
    category: 'mobile',
    title: 'ASL Flurry',
    description:
      'Research-based ASL learning app with interactive games, authentic Deaf signers across ages 2–93, and gamified pathways from beginner to expert.',
    image: '/projects/asl-flurry.png',
    cardImage: '/projects/asl-flurry.png',
    tags: ['Mobile', 'EdTech'],
    techStack: ['React Native', 'TypeScript', 'Node.js'],
    modalTags: ['Mobile', 'EdTech'],
    summary:
      'ASL Flurry helps learners build real American Sign Language skills through interactive games and video featuring fluent Deaf signers. Vocabulary, fingerspelling, and sentences in context are organized by category and difficulty — with leaderboards, friend challenges, and premium pathways for guided micro-lessons and advanced content.',
    url: 'https://apps.apple.com/us/app/asl-flurry/id1659464785',
    challenge:
      'ASL education products often lack authentic Deaf representation and struggle to keep learners engaged beyond flashcards. The app needed to feel fun for beginners while offering expert-level depth, work on phone and tablet, and support subscription upgrades without fragmenting the core experience.',
    approach: [
      'Built mobile game flows with multiple difficulty tiers so learners progress at their own pace',
      'Designed video-first lesson and quiz experiences featuring diverse Deaf signers and real-world context',
      'Implemented leaderboards, friend invites, and breakout-style challenges to drive retention',
      'Shipped premium pathways with guided lessons while keeping the free tier valuable and complete',
    ],
    results: [
      { value: '4.6★', label: 'App Store Rating' },
      { value: '100+', label: 'Game Categories' },
      { value: '6', label: 'Difficulty Levels' },
      { value: 'iOS', label: 'iPhone & iPad' },
    ],
    modalTechStack: [
      'React Native',
      'TypeScript',
      'Node.js',
      'REST APIs',
      'In-app subscriptions',
      'Video streaming',
      'Push notifications',
    ],
    role: 'Contributed mobile engineering on game mechanics, video lesson flows, and engagement features — helping deliver an accessible, research-backed ASL experience that scales from first-time signers to advanced learners.',
  },
  {
    id: 'blip',
    category: 'mobile',
    title: 'BLIP',
    description:
      'Creator social app that turns invites into living video threads — fans RSVP with short videos, build Blip chains, and fuel organic promotion.',
    image: '/projects/blip.png',
    cardImage: '/projects/blip.png',
    tags: ['Mobile', 'Social'],
    techStack: ['React Native', 'TypeScript', 'Node.js'],
    modalTags: ['Mobile', 'Social'],
    summary:
      'BLIP transforms invites into shareable video threads where creators and fans connect, collaborate, and build momentum. Instead of forms or static posts, fans RSVP with short videos that live on a growing Blip chain — from event invites and collabs to backstage moments, duets, and challenges. Creators reward standout RSVPs with prizes, access, and shoutouts.',
    url: 'https://apps.apple.com/us/app/blip-dont-just-post-host/id6477564661',
    challenge:
      'Creator tools are fragmented across DMs, link-in-bio forms, and one-off social posts — making it hard to turn fan excitement into structured engagement. BLIP needed native video capture, real-time threads, subscription tiers for creators, and performance that holds up during live events and viral spikes.',
    approach: [
      'Built invite and RSVP flows centered on short-form video instead of traditional forms',
      'Designed Blip-chain threading so RSVPs, in-event clips, and post-event reactions stay connected',
      'Shipped collab, fan chat, and creator subscription features for music and creator culture use cases',
      'Optimized feed, recording, and sharing paths for discovery and organic promotion',
    ],
    results: [
      { value: '5.0★', label: 'App Store Rating' },
      { value: 'Video', label: 'RSVP Format' },
      { value: 'Live', label: 'Creator Threads' },
      { value: 'iOS', label: 'iPhone & iPad' },
    ],
    modalTechStack: [
      'React Native',
      'TypeScript',
      'Node.js',
      'Video upload & playback',
      'Real-time messaging',
      'In-app subscriptions',
      'Push notifications',
      'Social sharing',
    ],
    role: 'Worked on mobile features for video invites, Blip chains, collab tooling, and creator subscriptions — shipping performant capture and feed experiences built for events, releases, and fan-driven promotion.',
  },
  {
    id: 'toffy-ai',
    category: 'mobile',
    title: 'Toffy AI',
    description:
      'AI dog training coach with adaptive daily plans, step-by-step video lessons, 24/7 behavior help, and progress tracking for walks, meals, and wellness.',
    image: '/projects/toffy-ai.png',
    cardImage: '/projects/toffy-ai.png',
    tags: ['Mobile', 'AI'],
    techStack: ['React Native', 'TypeScript', 'LLM APIs'],
    modalTags: ['Mobile', 'AI'],
    summary:
      'Toffy AI is a personalized dog training and behavior app that adapts to each dog’s age, personality, routine, and history. Pet parents get evolving daily plans, short video lessons, instant AI answers for barking or leash pulling, and a single place to log walks, meals, vaccines, and mood — with badges and milestones that keep training consistent.',
    url: 'https://apps.apple.com/in/app/toffy-ai-dog-training-app/id6740557230',
    challenge:
      'Most pet apps are static tip libraries that ignore how dogs actually behave day to day. Toffy needed trustworthy AI guidance, adaptive plan logic, rich media lessons, and a polished mobile UX that feels supportive at 2am — not overwhelming for first-time dog parents.',
    approach: [
      'Integrated adaptive AI training plans that adjust when dogs progress quickly or need reinforcement',
      'Built step-by-step lesson flows with short video, clear instructions, and behavior-specific programs',
      'Shipped 24/7 AI chat for in-the-moment behavior questions with personalized, contextual answers',
      'Designed wellness logging and gamified milestones so progress stays visible and motivating',
    ],
    results: [
      { value: '5.0★', label: 'App Store Rating' },
      { value: '24/7', label: 'AI Behavior Help' },
      { value: 'Daily', label: 'Adaptive Plans' },
      { value: 'iOS', label: 'iPhone & iPad' },
    ],
    modalTechStack: [
      'React Native',
      'TypeScript',
      'Node.js',
      'LLM APIs',
      'REST APIs',
      'In-app subscriptions',
      'Video lessons',
      'Analytics',
    ],
    role: 'Contributed mobile and AI product engineering on adaptive training plans, instant behavior assistance, lesson delivery, and subscription flows — helping ship a coach that grows with each dog and owner.',
  },
]

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-boompop',
    category: 'Events',
    year: '2024',
    title: 'BoomPop: Making complex corporate events feel simple to plan',
    description:
      'BoomPop helps teams plan offsites, retreats, SKOs, and conferences in one platform — or hand planning to full-service experts. I built product features around smooth user flows and event-planning workflows so venue sourcing, guest management, and logistics feel approachable at scale.',
    image: '/projects/boompop.jpg',
    stats: [
      { value: '500K+', label: 'Attendees Hosted' },
      { value: '500+', label: 'Vendor Partners' },
      { value: '5★', label: 'Avg. Reviews' },
    ],
    skills: ['Product Engineering', 'Scalable Architecture', 'UX Flows', 'Platform'],
    projectId: 'boompop',
  },
  {
    id: 'cs-infinite-giving',
    category: 'FinTech',
    year: '2023',
    title: 'Infinite Giving: Unified nonprofit finance and modern giving',
    description:
      'Infinite Giving combines advisory services with technology so nonprofits manage cash, investments, and donations in one place. I contributed to clean dashboards, secure workflows, and reliable tools for accepting cash, stock, crypto, and DAF gifts — reducing complexity for mission-driven teams.',
    image: '/projects/infinite-giving.jpg',
    imageRight: true,
    stats: [
      { value: '3 days', label: 'Account Open' },
      { value: '0%', label: 'Stock Gift Fees' },
      { value: '$5M', label: 'FDIC Coverage' },
    ],
    skills: ['FinTech UX', 'Secure Workflows', 'Dashboards', 'Integrations'],
    projectId: 'infinite-giving',
  },
  {
    id: 'cs-schoolai',
    category: 'EdTech / AI',
    year: '2024',
    title: 'SchoolAI: AI built for classrooms, not generic chatbots',
    description:
      'SchoolAI is used in over a million classrooms to personalize learning, create resources, and surface real-time student progress. I worked on product experiences where usability, performance, and AI-powered interaction had to work together — with teacher oversight and student safety built in from day one.',
    image: '/projects/schoolai.jpg',
    stats: [
      { value: '10K+', label: 'Classrooms' },
      { value: '200K+', label: 'Spaces' },
      { value: '10+ hrs', label: 'Teacher Time Saved' },
    ],
    skills: ['AI Product', 'EdTech UX', 'Performance', 'Real-time Insights'],
    projectId: 'schoolai',
  },
  {
    id: 'cs-asl-flurry',
    category: 'EdTech / Mobile',
    year: '2023',
    title: 'ASL Flurry: Gamified ASL with authentic Deaf representation',
    description:
      'ASL Flurry makes American Sign Language learning engaging through games, video, and diverse Deaf signers — not static flashcards. I contributed to mobile game flows, video lesson experiences, and retention features like leaderboards and friend challenges that help learners build real comprehension.',
    image: '/projects/asl-flurry.png',
    imageRight: true,
    stats: [
      { value: '4.6★', label: 'App Store Rating' },
      { value: '100+', label: 'Categories' },
      { value: '6', label: 'Difficulty Levels' },
    ],
    skills: ['React Native', 'Video UX', 'Gamification', 'Subscriptions'],
    projectId: 'asl-flurry',
  },
  {
    id: 'cs-blip',
    category: 'Social / Mobile',
    year: '2024',
    title: 'BLIP: Video RSVPs that turn fans into promoters',
    description:
      'BLIP replaces boring invite links with living video threads where fans respond on camera. I worked on mobile flows for video capture, Blip chains, creator collabs, and subscriptions — built for music, events, and creator culture where engagement needs to feel immediate and shareable.',
    image: '/projects/blip.png',
    stats: [
      { value: '5.0★', label: 'App Store Rating' },
      { value: 'Video', label: 'RSVP Replies' },
      { value: 'Chain', label: 'Thread Model' },
    ],
    skills: ['React Native', 'Video', 'Social Feeds', 'Subscriptions'],
    projectId: 'blip',
  },
  {
    id: 'cs-toffy-ai',
    category: 'AI / Mobile',
    year: '2025',
    title: 'Toffy AI: Adaptive dog training that meets you in the moment',
    description:
      'Toffy AI combines adaptive training plans, short video lessons, and always-on behavior help so dog parents never feel stuck. I contributed to mobile experiences where AI guidance, lesson delivery, and progress tracking had to feel calm, personal, and trustworthy — from puppy basics to separation anxiety.',
    image: '/projects/toffy-ai.png',
    imageRight: true,
    stats: [
      { value: '5.0★', label: 'App Store Rating' },
      { value: '24/7', label: 'AI Support' },
      { value: 'Daily', label: 'Plan Updates' },
    ],
    skills: ['React Native', 'LLM Integration', 'Adaptive UX', 'Subscriptions'],
    projectId: 'toffy-ai',
  },
]

export const SKILLS: Skill[] = [
  { label: 'Full-Stack — React / Next.js / Node.js', percent: 95 },
  { label: 'Mobile — React Native / Flutter', percent: 90 },
  { label: 'AI — Claude / LLM Workflows / RAG', percent: 92, highlight: true },
  { label: 'Product — MVPs / Architecture / UX', percent: 94 },
  { label: 'Cloud — AWS / GCP / DevOps', percent: 88 },
  { label: 'FinTech — Secure dashboards & workflows', percent: 87 },
]

export const EXPERIENCE: Experience[] = [
  {
    title: 'Senior Full Stack Engineer',
    company: 'Freelance',
    period: 'Jun 2022 — Present',
    active: true,
  },
  {
    title: 'Full Stack Engineer',
    company: 'Loadsmart',
    period: 'Jan 2020 — May 2022',
  },
  {
    title: 'Software Engineer',
    company: 'Airbnb',
    period: 'Sep 2017 — Jan 2020',
  },
  {
    title: 'Software Engineer',
    company: 'Nternow',
    period: 'Dec 2016 — Aug 2017',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "He moves fast without cutting corners. Clear communication, strong product instincts, and code we could actually scale — exactly what a startup founder needs.",
    name: 'Founder',
    role: 'Early-stage SaaS',
    avatar: 'https://picsum.photos/seed/founder-testimonial-1/80/80.jpg',
  },
  {
    quote:
      'Not just a developer — a true product partner. He helped us avoid wasted builds, made smart technical calls, and shipped an MVP we were proud to put in front of users.',
    name: 'CEO',
    role: 'Growth-stage startup',
    avatar: 'https://picsum.photos/seed/ceo-testimonial-2/80/80.jpg',
  },
  {
    quote:
      'Our AI workflows went from idea to production quickly. He integrated Claude thoughtfully, kept the UX clean, and owned the work end to end.',
    name: 'Product Lead',
    role: 'AI-powered product',
    avatar: 'https://picsum.photos/seed/product-lead-3/80/80.jpg',
  },
]

export const PROJECT_TYPES = [
  'SaaS Product',
  'Mobile App',
  'Platform / Marketplace',
  'AI / ML Integration',
  'Consulting / Advisory',
  'Other',
]
