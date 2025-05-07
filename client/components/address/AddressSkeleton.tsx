'use client';

interface AddressSkeletonProps {
    count?: number;
}

export default function AddressSkeleton({ count = 2 }: AddressSkeletonProps) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="bg-green-100 rounded-lg p-4 shadow-sm animate-pulse"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Radio button placeholder */}
                            <div className="w-5 h-5 rounded-full bg-gray-300" />
                            <div className="space-y-2">
                                {/* Title placeholder */}
                                <div className="h-5 w-32 bg-gray-300 rounded" />
                                {/* City/country placeholder */}
                                <div className="h-4 w-48 bg-gray-300 rounded" />
                                {/* Address line placeholder */}
                                <div className="h-4 w-48 bg-gray-300 rounded" />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            {/* Edit button placeholder */}
                            <div className="h-8 w-16 bg-gray-300 rounded-md" />
                            {/* Delete button placeholder */}
                            <div className="h-8 w-16 bg-gray-300 rounded-md" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}