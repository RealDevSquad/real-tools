import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    IconSearch,
    IconX
} from '@tabler/icons-react';
import { TOOLS } from '../../config/tools';
import logo from '../../assets/logo.png';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = React.memo(({ isOpen, onClose }: SidebarProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    const filteredTools = TOOLS.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = Array.from(new Set(filteredTools.map(t => t.category)));

    const isToolActive = (toolId: string) => {
        return location.pathname === `/tool/${toolId}`;
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                className={`fixed left-0 top-0 h-full apple-sidebar-glass z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:rounded-r-3xl overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Header */}
                <div className="h-20 px-8 flex items-center justify-between shrink-0">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="Privacy Tools Logo" className="w-9 h-9 rounded-xl shadow-sm" />
                        <span className="font-bold text-[19px] tracking-tight text-foreground">Privacy</span>
                    </Link>
                    <button onClick={onClose} className="md:hidden p-2 text-foreground/60 hover:bg-secondary/50 rounded-lg">
                        <IconX size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 pb-6">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50">
                            <IconSearch size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 h-10 bg-secondary/60 rounded-xl text-[14px] font-medium border-transparent focus:bg-secondary/80 focus:ring-0 transition-all outline-none placeholder:text-foreground/50"
                        />
                    </div>
                </div>

                {/* Tool List */}
                <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar space-y-8">
                    {categories.length === 0 && (
                        <div className="text-center text-foreground/40 text-[13px] py-12 px-4 italic">
                            No tools match your search
                        </div>
                    )}

                    {categories.map((category) => (
                        <div key={category} className="space-y-1">
                            <div className="px-5 py-2">
                                <span className="text-[11px] font-black text-foreground/60 tracking-[0.05em] uppercase">
                                    {category}
                                </span>
                            </div>

                            <div className="space-y-[2px]">
                                {filteredTools
                                    .filter(tool => tool.category === category)
                                    .map((tool) => (
                                        <NavLink
                                            key={tool.id}
                                            to={`/tool/${tool.id}`}
                                            onMouseEnter={() => {
                                                if (tool.id === 'metadata-cleaner') import('../MetadataRemover/MetadataRemover');
                                                if (tool.id === 'editor') import('../PDFEditor/PDFEditor');
                                                if (tool.id === 'builder') import('../FormBuilder/FormBuilder');
                                            }}
                                            onClick={() => {
                                                if (window.innerWidth < 768) onClose();
                                            }}
                                            className={({ isActive }) => `
                                                group flex items-center gap-3 px-4 h-9 rounded-lg text-[14px] font-medium transition-all relative
                                                ${isActive
                                                    ? 'text-foreground bg-primary/10 shadow-sm'
                                                    : 'text-foreground/80 hover:bg-secondary/60'}
                                            `}
                                        >
                                            <tool.icon
                                                size={18}
                                                className={`shrink-0 transition-all ${isToolActive(tool.id) ? 'text-primary' : 'text-foreground/50 group-hover:text-foreground/90'}`}
                                            />
                                            <span className="truncate flex-1 tracking-tight">{tool.name}</span>

                                            {isToolActive(tool.id) && (
                                                <motion.div
                                                    layoutId="active-nav-dot"
                                                    className="w-1.5 h-1.5 bg-primary rounded-full absolute right-4"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </NavLink>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-border bg-secondary/20">
                    <div className="text-[10px] text-foreground/40 text-center font-bold tracking-[0.1em] uppercase">
                        End-to-End Privacy
                    </div>
                </div>
            </motion.aside>
        </>
    );
});
