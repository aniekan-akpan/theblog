import { withBase } from "./utils/helpers";

export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    eyebrowText?: string;
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type About = {
    title?: string;
    text?: string;
};

export type Blog = {
    description?: string;
};

export type ContactInfo = {
    title?: string;
    text?: string;
    email?: {
        text?: string;
        href?: string;
        email?: string;
    };
    socialProfiles?: {
        text?: string;
        href?: string;
    }[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    website: string;
    logo?: Image;
    title: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    about?: About;
    contactInfo?: ContactInfo;
    subscribe?: Subscribe;
    blog?: Blog;
    postsPerPage?: number;
    recentPostLimit: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    website: 'https://aniekan-akpan.github.io',
    title: 'Aniekan Akpan',
    description: 'A digital garden where ideas grow and flourish - a personal space for thoughts, projects, and creative explorations',
    image: {
        src: '/aniekan-blog-preview.jpeg',
        alt: 'Aniekan Blog - A digital garden for thoughts and ideas.'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: withBase('/')
        },
        {
            text: 'Blog',
            href: withBase('/blog')
        },
        // {
        //     text: 'Podcasts',
        //     href: withBase('/podcasts')
        // },
        {
            text: 'Projects',
            href: withBase('/projects')
        },
        {
            text: 'About',
            href: withBase('/about')
        },
        // {
        //     text: 'Contact',
        //     href: withBase('/contact')
        // }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: withBase('/about')
        },
        {
            text: 'Blog',
            href: withBase('/blog')
        },
        // {
        //     text: 'Podcasts',
        //     href: withBase('/podcasts')
        // },
        {
            text: 'Projects',
            href: withBase('/projects')
        },
        // {
        //     text: 'Contact',
        //     href: withBase('/contact')
        // },
        {
            text: 'RSS Feed',
            href: withBase('/rss.xml')
        },
                {
            text: 'Sitemap',
            href: withBase('/sitemap-index.xml')
        }
    ],
    socialLinks: [
        {
            text: 'Dribbble',
            href: 'https://dribbble.com/'
        },
        {
            text: 'Instagram',
            href: 'https://instagram.com/'
        },
        {
            text: 'X/Twitter',
            href: 'https://twitter.com/'
        }
    ],
    hero: {
        eyebrowText: 'my personal online space',
        title: 'Hi, I\'m Aniekan',
        text: "I'm a software developer passionate about building elegant solutions to complex problems. I write about web development, design, and the things I learn along the way.",
        image: {
            src: '/assets/images/1.png',
            alt: 'Aniekan profile photo'
        },
        actions: [
            {
                text: 'Read My Blog',
                href: withBase('/blog')
            },
            {
                text: 'View Projects',
                href: withBase('/projects')
            }
        ]
    },
    about: {
        title: 'About',
        text: 'Aniekan Blog is a blog about space exploration and travel. It is written by Aniekan, a space explorer at Beyond Earth. Aniekan is known for his love of adventure and his insatiable curiosity about the universe. He has explored countless planets, discovered new life forms, and made friends with aliens along the way. 🚀',
    },
    contactInfo: {
        title: 'Contact',
        text: "Hi! Whether you have a question, a suggestion, or just want to share your thoughts, I'm all ears. Feel free to get in touch through any of the methods below:",
        email: {
            text: "Drop me an email and I’ll do my best to respond as soon as possible.",
            href: "mailto:example@example.com",
            email: "example@example.com"
        },
        socialProfiles: [
            {
                text: "LinkedIn",
                href: "https://www.linkedin.com/"
            },
            {
                text: "Peerlist",
                href: "https://www.peerlist.io/"
            },
            {
                text: "GitHub",
                href: "https://github.com/"
            }
        ]
    },
    subscribe: {
        title: 'Subscribe to Aniekan Blog',
        text: 'One update per week. All the latest stories in your inbox.',
        formUrl: '#'
    },
    blog: {
        description: "Read about my space adventures, explorations and the aliens I've met on my journeys."
    },
    postsPerPage: 5,
    projectsPerPage: 9,
    recentPostLimit: 3
};

export default siteConfig;
