import type { SiteConfig } from '@/types/sites';
import { getSiteUrl } from '@/lib/env';
import thumbnail from '@/assets/generative-ai-launcher.jpg';

export default {
    name: 'Generative AI Integration Plugin',
    url: getSiteUrl('generative-ai'),
    thumbnail: thumbnail,
    description: 'Generative AI, native to Unreal Engine. Supports OpenAI, Claude, Gemini, and local LLMs with strongly-typed APIs, tool calling, streaming, and multimodal generation.',
    links: {
        github: 'https://github.com/oakisnotree/generate-ai-docs',
        documentation: '/generative-ai',
    },
    github: {
        baseUrl: 'https://github.com/oakisnotree/generate-ai-docs',
        branch: 'main',
        owner: 'oakisnotree',
        repo: 'generate-ai-docs',
    },
    headerLinks: {
        github: {
            label: 'GitHub',
            href: 'https://github.com/osmalpkoras/docs-generative-ai-integration-plugin',
            icon: 'Github',
            ariaLabel: 'View on GitHub'
        },
        discord: {
            label: 'Discord',
            href: 'https://discord.com/invite/VR6YMu8wb5',
            icon: 'MessageCircle',
            ariaLabel: 'Join Discord'
        },
        fab: {
            label: 'FAB',
            href: 'https://www.fab.com/',
            icon: 'ShoppingCart',
            ariaLabel: 'View on FAB - Unreal Engine Marketplace'
        },
    },
} satisfies SiteConfig;
