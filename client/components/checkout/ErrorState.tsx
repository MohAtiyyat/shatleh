'use client';


interface ErrorStateProps {
    error: string;
    currentLocale: 'en' | 'ar';
}

export default function ErrorState({ error, currentLocale }: ErrorStateProps) {

    return (
        <div
            className="text-center py-10 text-red-500"
            role="alert"
            aria-live="polite"
            dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
        >
            <p>{error}</p>
        </div>
    );
}