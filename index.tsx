import { ContentPage } from '@/types/pages';

export const metadata = {
    kind: 'content',
    title: 'oakisnotree',
    description: 'Documentation Hub for Unreal Engine 5 plugins and tools.',
    order: 1,
} satisfies ContentPage;

import { SiteLauncher } from '@/components/layout';
import { SiteTile } from '@/components/site-tile';
import { GENERATED_SITES } from '@/lib/pages.generated';

export default async function LauncherHomePage() {
    // Load all available sites
    const siteConfigs = await Promise.all(
        Object.entries(GENERATED_SITES)
            .filter(([key]) => key !== '') // Exclude the root site
            .map(async ([key, loader]) => {
                const config = await loader();
                return { key, config };
            })
    );

    return (
        <SiteLauncher>
            <div className="min-h-screen flex items-center">
                <div className="container mx-auto px-4 py-16 sm:py-24">
                    {/* Hero Section */}
                    <section className="text-center mb-16 sm:mb-20">
                        <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
                            <h1 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-gray-900 dark:text-white">
                                oakisnotree
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-light">
                                Documentation Hub
                            </p>
                        </div>
                    </section>

                    {/* Sites Grid */}
                    <section className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {siteConfigs.map(({ key, config }) => (
                                <SiteTile
                                    key={key}
                                    title={config.name}
                                    description={config.description}
                                    href={`/${key}`}
                                    thumbnail={config.thumbnail?.src}
                                />
                            ))}

                            {/* Coming Soon Tile */}
                            <SiteTile
                                title="More Coming Soon"
                                description="Additional plugins and tools documentation will be available soon."
                                href="#"
                                isComingSoon={true}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </SiteLauncher>
    );
}
