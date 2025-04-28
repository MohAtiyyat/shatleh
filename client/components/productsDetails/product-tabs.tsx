"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";

type Tab = {
    id: string;
    label: string;
    content: React.ReactNode;
};

interface ProductTabsProps {
    tabs: Tab[];
    initialTab?: string;
}

export function ProductTabs({ tabs, initialTab }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState(initialTab || tabs[0].id);

    return (
        <div className="w-full max-w-4xl">
            {/* Tab Navigation */}
            <div className="relative flex border-b border-[#d0d5dd] mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`md:px-6 px-3 py-3 text-lg font-medium relative ${activeTab === tab.id ? "text-[#337a5b]" : "text-[#667085]"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-[#337a5b]"
                                layoutId="activeTab"
                                initial={false}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="relative overflow-hidden min-h-[300px]">
                {tabs.map((tab) => (
                    <motion.div
                        key={tab.id}
                        initial={{ opacity: 0, x: activeTab === tab.id ? 0 : activeTab === tabs[0].id ? 100 : -100 }}
                        animate={{
                            opacity: activeTab === tab.id ? 1 : 0,
                            x: activeTab === tab.id ? 0 : activeTab === tabs[0].id ? 100 : -100,
                            position: activeTab === tab.id ? "relative" : "absolute",
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="w-full text-[#337a5b]"
                    >
                        {tab.content}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}