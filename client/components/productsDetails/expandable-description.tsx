"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableDescriptionProps {
    shortDescription: string;
    fullDescription: string;
    moreText?: string;
    lessText?: string;
}

export default function ExpandableDescription({
    shortDescription,
    fullDescription,
    moreText = "More ...",
    lessText = "Less",
}: ExpandableDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="space-y-2">
            <AnimatePresence initial={false} mode="wait">
                {isExpanded ? (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#337a5b] leading-relaxed"
                    >
                        {fullDescription}
                    </motion.div>
                ) : (
                    <motion.div
                        key="collapsed"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#337a5b] leading-relaxed"
                    >
                        {shortDescription}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-[#86f607] font-medium hover:text-[#27eb00] transition-colors"
            >
                {isExpanded ? (
                    <>
                        {lessText} <ChevronUp className="ml-1 w-4 h-4" />
                    </>
                ) : (
                    <>
                        {moreText} <ChevronDown className="ml-1 w-4 h-4" />
                    </>
                )}
            </button>
        </div>
    );
}