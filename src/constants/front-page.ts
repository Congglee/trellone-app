import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FeaturesGears from '~/assets/front-page/features-gears.svg'
import FeaturesIntegrations from '~/assets/front-page/features-integrations.svg'
import FeaturesSearch from '~/assets/front-page/features-search.svg'
import BookIcon from '~/assets/front-page/icon-book.png'
import BrainStormingIcon from '~/assets/front-page/icon-brainstorming.svg'
import CheckListsIcon from '~/assets/front-page/icon-checklists.png'
import FolderIcon from '~/assets/front-page/icon-folder.png'
import LeafIcon from '~/assets/front-page/icon-leaf.png'
import MegaPhoneIcon from '~/assets/front-page/icon-megaphone.png'
import ProductivityBoards from '~/assets/front-page/productivity-boards.png'
import ProductivityCards from '~/assets/front-page/productivity-cards.png'
import ProductivityColumns from '~/assets/front-page/productivity-columns.png'

export const productivityTabs = [
  {
    label: 'Boards',
    description:
      'Tackle any project with a single view. Trellone boards are the canvas where you can organize tasks, track progress, and see the big picture at a glance.',
    image: ProductivityBoards
  },
  {
    label: 'Cards',
    description:
      'Cards hold all the details to get work done. Add descriptions, checklists, due dates, and attachments to keep tasks clear and actionable.',
    image: ProductivityCards
  },
  {
    label: 'Columns',
    description:
      "Build a workflow that fits your team. Create custom stages and move cards from 'To Do' to 'Done' to track progress visually.",
    image: ProductivityColumns
  }
]

export const workflows = [
  {
    title: 'Project management',
    body: 'Keep tasks in order, deadlines on track, and team members aligned with trellone',
    icon: FolderIcon,
    color: 'rgb(255, 116, 82)'
  },
  {
    title: 'Meetings',
    body: 'Empower your team meetings to be more productive, empowering, and dare we say—fun.',
    icon: MegaPhoneIcon,
    color: 'rgb(38, 132, 255)'
  },
  {
    title: 'Onboarding',
    body: "Onboarding to a new company or project is a snap with Trellone's visual layout of to-do's, resources, and progress tracking.",
    icon: LeafIcon,
    color: 'rgb(87, 217, 163)'
  },
  {
    title: 'Task management',
    body: "Use Trellone to track, manage, complete, and bring tasks together like the pieces of a puzzle, and make your team's projects a cohesive success every time.",
    icon: CheckListsIcon,
    color: 'rgb(255, 196, 0)'
  },
  {
    title: 'Brainstorming',
    body: "Unleash your team's creativity and keep ideas visible, collaborative, and actionable.",
    icon: BrainStormingIcon,
    color: 'rgb(0, 199, 229)'
  },
  {
    title: 'Resource hub',
    body: 'Save time with a well-designed hub that helps teams find information easily and quickly.',
    icon: BookIcon,
    color: 'rgb(249, 156, 219)'
  }
]

export const features = [
  {
    title: 'Integrations',
    body: 'Connect the apps your team already uses into your Trellone workflow or add a Power-Up to fine-tune your specific needs.',
    image: FeaturesIntegrations,
    button: 'Browse Integrations'
  },
  {
    title: 'Butler Automation',
    body: 'No-code automation is built into every Trellone board. Focus on the work that matters most and let the robots do the rest.',
    image: FeaturesGears,
    button: 'Get to know Automation'
  },
  {
    title: 'Trellone Enterprise',
    body: 'The productivity tool teams love, paired with the features and security needed for scale.',
    image: FeaturesSearch,
    button: 'Explore Enterprise'
  }
]

export const footerSections = [
  {
    title: 'About Trellone',
    links: [{ label: "What's behind the boards", href: '#' }]
  },
  {
    title: 'Apps',
    links: [{ label: 'Download the Trellone App for your Desktop or Mobile devices', href: '#' }]
  },
  {
    title: 'Contact us',
    links: [{ label: 'Need anything? Get in touch and we can help', href: '#' }]
  }
]

export const socialLinks = [
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
  { icon: YouTubeIcon, href: 'https://youtube.com', label: 'YouTube' }
]

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' }
]
