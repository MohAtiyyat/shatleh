'use client';

import { useTranslations } from 'next-intl';

export default function AboutUs() {
    const t = useTranslations('');
    

    return (
        <main style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.8',
            color: '#333'
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: '#337a5b'
            }}>
                {t('about.title')}
            </h1>
            <p style={{ fontSize: '1.175rem', marginBottom: '1rem' }}>
                {t('about.description')}
            </p>
            <p style={{ fontSize: '1.175rem', marginBottom: '1rem' }}>
                {t('about.description-2')}
            </p>
            <p style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                marginTop: '2rem',
                color: '#337a5b'
            }}>
                {t('about.above-text')}
            </p>
        </main>
    );
}
