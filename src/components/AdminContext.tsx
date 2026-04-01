'use client';
import { createContext, useContext, ReactNode } from 'react';

const AdminContext = createContext<boolean>(false);

export function AdminProvider({ isAdmin, children }: { isAdmin: boolean, children: ReactNode }) {
  return (
    <AdminContext.Provider value={isAdmin}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
