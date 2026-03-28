"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import type { ReactNode } from "react";

type EmotionRegistryProps = {
  children: ReactNode;
};

type EmotionState = {
  cache: ReturnType<typeof createCache> & {
    inserted: Record<string, string>;
  };
  flush: () => string[];
};

export default function EmotionRegistry({ children }: EmotionRegistryProps) {
  const [{ cache, flush }] = React.useState<EmotionState>(() => {
    const cache = createCache({ key: "mui" }) as EmotionState["cache"];

    cache.compat = true;

    const prevInsert = cache.insert.bind(cache);
    let inserted: string[] = [];

    cache.insert = (...args: any[]) => {
      const serialized = args[1];
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
      styles += cache.inserted[name];
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
