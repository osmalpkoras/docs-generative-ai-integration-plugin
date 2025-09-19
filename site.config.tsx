// Site configuration for the launcher/hub
// This configuration is for the main documentation hub

import type { SiteConfig } from '@/types/sites';
import { getBaseUrl } from '@/lib/env';

export default {
    name: 'oakisnotree',
    url: getBaseUrl(),
    description: 'Documentation Hub for Unreal Engine 5 plugins and tools',
    links: {
        github: 'https://github.com/oakisnotree/plugin-docs',
        discord: 'https://discord.gg/oakisnotree',
    },
    github: {
        baseUrl: 'https://github.com/oakisnotree/plugin-docs',
        branch: 'main',
        owner: 'oakisnotree',
        repo: 'plugin-docs',
    },
    headerLinks: {},
} satisfies SiteConfig;

