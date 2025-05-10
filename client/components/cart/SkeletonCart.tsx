'use client';

import { memo } from 'react';

const SkeletonCart = memo(function SkeletonCart() {

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--primary-bg)' }}>
            <main className="container mx-auto max-w-5/6 px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
                {/* Breadcrumb and Title Skeleton */}
                <div className="mb-6">
                    {/* Breadcrumb Skeleton */}
                    <div className="flex items-center space-x-2">
                        <div
                            className="h-4 w-24 rounded"
                            style={{ backgroundColor: 'var(--secondary-bg)' }}
                        ></div>
                        <div
                            className="h-4 w-4 rounded"
                            style={{ backgroundColor: 'var(--secondary-bg)' }}
                        ></div>
                        <div
                            className="h-4 w-16 rounded"
                            style={{ backgroundColor: 'var(--secondary-bg)' }}
                        ></div>
                    </div>
                    {/* Title Skeleton */}
                    <div
                        className="h-8 w-48 mt-4 rounded"
                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                    ></div>
                </div>
                {/* Cart Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                    {/* CartItemList Skeleton */}
                    <div className="lg:col-span-3 space-y-3 sm:space-y-4">
                        {/* Render 3 skeleton cart items */}
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-lg overflow-hidden border shadow-sm w-full my-2 sm:my-3"
                                style={{
                                    borderColor: 'var(--secondary-bg)',
                                    backgroundColor: 'var(--accent-color)',
                                }}
                            >
                                <div className="flex sm:flex-row items-start sm:items-center p-3 sm:p-4">
                                    <div className="flex flex-col items-center sm:items-start mx-1 sm:mx-3 mb-3 sm:mb-0">
                                        <div
                                            className="w-20 h-20 sm:w-24 sm:h-24 rounded"
                                            style={{ backgroundColor: 'var(--secondary-bg)' }}
                                        ></div>
                                        <div
                                            className="h-4 w-16 sm:hidden mt-2 rounded"
                                            style={{ backgroundColor: 'var(--secondary-bg)' }}
                                        ></div>
                                    </div>
                                    <div className="flex-1 w-[40%]">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                            <div className="mb-3 sm:mb-0 max-w-[40%] sm:max-w-[60%]">
                                                <div
                                                    className="h-5 w-32 sm:w-48 rounded"
                                                    style={{ backgroundColor: 'var(--secondary-bg)' }}
                                                ></div>
                                                <div
                                                    className="h-4 w-24 sm:w-36 mt-2 rounded"
                                                    style={{ backgroundColor: 'var(--secondary-bg)' }}
                                                ></div>
                                                <div
                                                    className="h-4 w-20 sm:w-32 mt-1 rounded"
                                                    style={{ backgroundColor: 'var(--secondary-bg)' }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center sm:items-start space-x-2 sm:space-x-4 w-full sm:w-auto">
                                                <div className="flex flex-col items-center">
                                                    <div
                                                        className="flex items-center border rounded"
                                                        style={{ borderColor: 'var(--secondary-bg)' }}
                                                    >
                                                        <div
                                                            className="w-7 h-7 rounded"
                                                            style={{ backgroundColor: 'var(--secondary-bg)' }}
                                                        ></div>
                                                        <div
                                                            className="w-7 h-4 mx-1 rounded"
                                                            style={{ backgroundColor: 'var(--secondary-bg)' }}
                                                        ></div>
                                                        <div
                                                            className="w-7 h-7 rounded"
                                                            style={{ backgroundColor: 'var(--secondary-bg)' }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div
                                                        className="h-4 w-16 hidden sm:block rounded"
                                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                                    ></div>
                                                    <div
                                                        className="h-6 w-6 mt-2 rounded"
                                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* CartSummary Skeleton */}
                    <div className="lg:col-span-2 py-6 lg:py-0">
                        <div
                            className="p-6 w-full max-w-md sm:max-w-lg lg:max-w-lg min-h-[450px] flex flex-col"
                            style={{ backgroundColor: 'var(--accent-color)' }}
                        >
                            {/* Summary Title */}
                            <div
                                className="h-6 w-32 mb-10 rounded"
                                style={{ backgroundColor: 'var(--secondary-bg)' }}
                            ></div>
                            {/* Summary Details */}
                            <div className="space-y-6 mb-10 flex-grow">
                                <div className="flex justify-between">
                                    <div
                                        className="h-4 w-20 rounded"
                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                    ></div>
                                    <div
                                        className="h-4 w-16 rounded"
                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                    ></div>
                                </div>
                                <div className="flex justify-between">
                                    <div
                                        className="h-4 w-20 rounded"
                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                    ></div>
                                    <div
                                        className="h-4 w-16 rounded"
                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                    ></div>
                                </div>
                                <div className="flex justify-between">
                                    <div
                                        className="h-4 w-20 rounded"
                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                    ></div>
                                    <div
                                        className="h-4 w-16 rounded"
                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                    ></div>
                                </div>
                            </div>
                            {/* Total */}
                            <div
                                className="border-t pt-8 mb-10"
                                style={{ borderColor: 'var(--accent-color)' }}
                            >
                                <div className="flex justify-between items-center">
                                    <div
                                        className="h-5 w-20 rounded"
                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                    ></div>
                                    <div
                                        className="h-5 w-24 rounded"
                                        style={{ backgroundColor: 'var(--secondary-bg)' }}
                                    ></div>
                                </div>
                            </div>
                            {/* Checkout Button */}
                            <div
                                className="h-12 w-full rounded-md mt-auto"
                                style={{ backgroundColor: 'var(--secondary-bg)' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
});

export default SkeletonCart;
