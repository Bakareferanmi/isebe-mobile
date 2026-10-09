import type { Persistence } from 'firebase/auth';

// At runtime Metro resolves `firebase/auth` -> `@firebase/auth` using the "react-native"
// export condition, which provides getReactNativePersistence. The public typings that
// `firebase/auth` ships don't include it, so declare it here.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
