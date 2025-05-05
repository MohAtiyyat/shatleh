import { motion } from 'framer-motion';

export default function UserSkeleton() {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10vh)] bg-[var(--primary-bg)] px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[var(--primary-bg)] rounded-3xl shadow-[var(--shadow-md)] p-8 w-full max-w-2xl"
            >
                {/* Title Skeleton */}
                <div className="h-8 bg-[var(--secondary-bg)] rounded w-1/3 mx-auto mb-8 animate-pulse"></div>

                {/* Profile Photo and Info Skeleton */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                    <div className="w-32 h-32 rounded-full bg-[var(--secondary-bg)] animate-pulse"></div>
                    <div className="flex-1 text-center md:text-start">
                        <div className="h-6 bg-[var(--secondary-bg)] rounded w-3/4 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-[var(--secondary-bg)] rounded w-1/2 mb-4 animate-pulse"></div>
                        <div className="flex gap-3 justify-center md:justify-start">
                            <div className="h-10 bg-[var(--secondary-bg)] rounded w-24 animate-pulse"></div>
                            <div className="h-10 bg-[var(--secondary-bg)] rounded w-24 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-[var(--secondary-bg)]" />

                {/* Form Fields Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="h-4 bg-[var(--secondary-bg)] rounded w-1/4 mb-2 animate-pulse"></div>
                        <div className="h-10 bg-[var(--secondary-bg)] rounded w-full animate-pulse"></div>
                    </div>
                    <div>
                        <div className="h-4 bg-[var(--secondary-bg)] rounded w-1/4 mb-2 animate-pulse"></div>
                        <div className="h-10 bg-[var(--secondary-bg)] rounded w-full animate-pulse"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <div className="h-4 bg-[var(--secondary-bg)] rounded w-1/4 mb-2 animate-pulse"></div>
                        <div className="h-10 bg-[var(--secondary-bg)] rounded w-full animate-pulse"></div>
                    </div>
                    <div>
                        <div className="h-4 bg-[var(--secondary-bg)] rounded w-1/4 mb-2 animate-pulse"></div>
                        <div className="h-10 bg-[var(--secondary-bg)] rounded w-full animate-pulse"></div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="h-4 bg-[var(--secondary-bg)] rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="flex items-center gap-2">
                        <div className="h-10 bg-[var(--secondary-bg)] rounded w-full animate-pulse"></div>
                        <div className="h-10 w-10 bg-[var(--secondary-bg)] rounded animate-pulse"></div>
                    </div>
                </div>

                <hr className="my-6 border-[var(--secondary-bg)]" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div>
                        <div className="h-4 bg-[var(--secondary-bg)] rounded w-1/4 mb-2 animate-pulse"></div>
                        <div className="h-10 bg-[var(--secondary-bg)] rounded w-full animate-pulse"></div>
                    </div>
                    <div>
                        <div className="h-4 bg-[var(--secondary-bg)] rounded w-1/4 mb-2 animate-pulse"></div>
                        <div className="h-10 bg-[var(--secondary-bg)] rounded w-full animate-pulse"></div>
                    </div>
                </div>

                {/* Buttons Skeleton */}
                <div className="flex justify-end gap-4">
                    <div className="h-10 bg-[var(--secondary-bg)] rounded w-24 animate-pulse"></div>
                    <div className="h-10 bg-[var(--secondary-bg)] rounded w-24 animate-pulse"></div>
                </div>
            </motion.div>
        </div>
    );
}