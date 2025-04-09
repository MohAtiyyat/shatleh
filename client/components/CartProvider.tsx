'use client';

import { ReactNode } from 'react';

type CartProviderProps = {
  children: ReactNode;
};

export default function CartProvider({ children }: CartProviderProps) {
  return <>{children}</>; // No actual provider needed for Zustand, just a wrapper
}