'use client';

import { useState, useEffect } from 'react';

export function useStickyFooter(footerSelector: string) {
    const [isFooterVisible, setIsFooterVisible] = useState(false);

    useEffect(() => {
        const footer = document.querySelector(footerSelector);
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFooterVisible(entry.isIntersecting);
            },
            { threshold: 0 }
        );

        observer.observe(footer);

        return () => observer.disconnect();
    }, [footerSelector]);

    return isFooterVisible;
}


