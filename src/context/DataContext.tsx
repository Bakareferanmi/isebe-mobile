import { FALLBACK_MENU, FALLBACK_POSTS, DEFAULT_HOMEPAGE } from '@/data/fallback';
import { db } from '@/lib/firebase';
import type { BlogPost, Homepage, MenuItem } from '@/lib/types';
import { collection, doc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type DataState = {
  homepage: Required<Homepage>;
  menu: MenuItem[];
  featured: MenuItem[];
  posts: BlogPost[];
  loading: boolean;
  usingFallbackMenu: boolean;
};

const Ctx = createContext<DataState | null>(null);

// Real-time listeners — same collections and queries as the web app.
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [homepage, setHomepage] = useState<Required<Homepage>>(DEFAULT_HOMEPAGE);
  const [menu, setMenu] = useState<MenuItem[]>(FALLBACK_MENU);
  const [usingFallbackMenu, setUsingFallbackMenu] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>(FALLBACK_POSTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubHome = onSnapshot(
      doc(db, 'site', 'homepage'),
      (snap) => {
        if (snap.exists()) setHomepage({ ...DEFAULT_HOMEPAGE, ...stripEmpty(snap.data()) });
      },
      () => {},
    );

    const unsubMenu = onSnapshot(
      query(collection(db, 'menu_items'), where('active', '==', true)),
      (snap) => {
        if (snap.empty) {
          setMenu(FALLBACK_MENU);
          setUsingFallbackMenu(true);
        } else {
          const items = snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<MenuItem, 'id'>) }))
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          setMenu(items);
          setUsingFallbackMenu(false);
        }
        setLoading(false);
      },
      () => {
        setMenu(FALLBACK_MENU);
        setUsingFallbackMenu(true);
        setLoading(false);
      },
    );

    const unsubBlog = onSnapshot(
      query(
        collection(db, 'blog_posts'),
        where('published', '==', true),
        orderBy('created_at', 'desc'),
      ),
      (snap) => {
        if (snap.empty) setPosts(FALLBACK_POSTS);
        else setPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, 'id'>) })));
      },
      () => setPosts(FALLBACK_POSTS),
    );

    return () => {
      unsubHome();
      unsubMenu();
      unsubBlog();
    };
  }, []);

  const value = useMemo<DataState>(
    () => ({
      homepage,
      menu,
      featured: menu.filter((i) => i.featured),
      posts,
      loading,
      usingFallbackMenu,
    }),
    [homepage, menu, posts, loading, usingFallbackMenu],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useData must be used inside DataProvider');
  return v;
}

// Don't let empty strings from Firestore wipe out the defaults
function stripEmpty(d: Record<string, any>) {
  const out: Record<string, any> = {};
  Object.keys(d).forEach((k) => {
    if (d[k] !== '' && d[k] != null) out[k] = d[k];
  });
  return out;
}
