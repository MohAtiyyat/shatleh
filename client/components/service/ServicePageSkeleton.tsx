'use client';

export default function ServicePageSkeleton() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-[var(--primary-bg)] px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-[var(--primary-bg)] rounded-3xl shadow-[var(--shadow-md)] p-8 w-full max-w-2xl animate-pulse">
                <div className="space-y-6">
                    {/* Service Dropdown Placeholder */}
                    <div>
                        <div className="h-5 w-32 bg-gray-300 rounded mb-2" />
                        <div className="h-12 w-full bg-gray-300 rounded-lg" />
                    </div>

                    {/* Address Dropdown Placeholder */}
                    <div>
                        <div className="h-5 w-32 bg-gray-300 rounded mb-2" />
                        <div className="flex items-center gap-2">
                            <div className="h-12 w-full bg-gray-300 rounded-lg" />
                            <div className="h-10 w-10 bg-gray-300 rounded" />
                        </div>
                    </div>

                    {/* Image Upload Section Placeholder */}
                    <div className="p-4 border border-[var(--secondary-bg)] rounded-lg">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-300 rounded mr-4" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-48 bg-gray-300 rounded" />
                                <div className="flex items-center">
                                    <div className="h-10 w-32 bg-gray-300 rounded-lg" />
                                    <div className="h-4 w-48 bg-gray-300 rounded ml-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Textarea Placeholder */}
                    <div>
                        <div className="h-5 w-32 bg-gray-300 rounded mb-2" />
                        <div className="h-48 w-full bg-gray-300 rounded-lg" />
                    </div>

                    {/* Submit Button Placeholder */}
                    <div className="flex justify-center">
                        <div className="h-12 w-48 bg-gray-300 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}