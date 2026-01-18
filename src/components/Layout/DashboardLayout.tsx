import { useState, Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { IconMenu2, IconLoader2 } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { ThemeSwitcher } from '../ui/theme-switcher';

interface DashboardLayoutProps {
    // No specific props needed as we use Outlet
}

const ToolLoader = () => (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 text-primary">
        <IconLoader2 size={40} className="animate-spin" />
        <p className="text-sm font-bold tracking-widest uppercase opacity-50">Loading Tool...</p>
    </div>
);

export const DashboardLayout = ({ }: DashboardLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground selection:bg-primary/20">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 md:pl-72 relative min-w-0 flex flex-col h-screen overflow-hidden">
                {/* Mobile Header - Apple Style */}
                <div className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 apple-glass md:hidden shrink-0">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 text-foreground/80 hover:bg-secondary/50 rounded-lg transition-all"
                        >
                            <IconMenu2 size={22} />
                        </button>
                        <div className="ml-3 font-semibold text-[17px] tracking-tight">Privacy</div>
                    </div>
                    <ThemeSwitcher />
                </div>

                {/* Desktop Action Area */}
                <div className="absolute top-6 right-8 z-20 hidden md:block">
                    <ThemeSwitcher />
                </div>

                {/* Content Area */}
                <div className="p-4 md:p-10 lg:p-16 w-full max-w-7xl mx-auto min-h-screen custom-scrollbar overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{
                                duration: 0.3,
                                ease: [0.23, 1, 0.32, 1]
                            }}
                            className="w-full"
                        >
                            <Suspense fallback={<ToolLoader />}>
                                <Outlet />
                            </Suspense>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};
