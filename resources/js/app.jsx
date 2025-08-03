import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title ? `${title} - Ponk` : 'Ponk',
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // HOC que aplica o hook globalmente
        const AppWithF12Logout = () => {
            const currentPage = props.initialPage.component;

            useEffect(() => {
                const handleKeyDown = (event) => {
                    if (event.key === 'F12' && currentPage !== 'Auth/Login') {
                        event.preventDefault();
                        router.post(
                            route('logout'),
                            {},
                            {
                                onFinish: () => window.location.reload(),
                            },
                        );
                    }
                };

                document.addEventListener('keydown', handleKeyDown);
                return () =>
                    document.removeEventListener('keydown', handleKeyDown);
            }, [currentPage]);

            return <App {...props} />;
        };

        root.render(<AppWithF12Logout />);
    },
    progress: {
        color: '#4B5563',
    },
});
