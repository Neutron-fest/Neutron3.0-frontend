"use client";

import * as React from "react";
import { ReactNode } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache, { EmotionCache } from "@emotion/cache";
import { CacheProvider, SerializedStyles } from "@emotion/react";

/* ================= TYPES ================= */

interface EmotionRegistryProps {
  children: ReactNode;
}

interface EmotionState {
  cache: EmotionCache;
  flush: () => string[];
}

/* ================= COMPONENT ================= */

export default function EmotionRegistry({
  children,
}: EmotionRegistryProps) {
  const [{ cache, flush }] = React.useState<EmotionState>(() => {
    const cache = createCache({ key: "mui" });
    cache.compat = true;

    const prevInsert = cache.insert.bind(cache);

    let inserted: string[] = [];

    cache.insert = (...args: [string, SerializedStyles, any, boolean]) => {
      const [, serialized] = args;

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }

      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();

    if (names.length === 0) return null;

    let styles = "";

    for (const name of names) {
      styles += cache.inserted[name] as string;
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}