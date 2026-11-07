"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

// Collects the Emotion styles generated while the server renders a request and
// flushes them into the HTML stream, so the first paint is already styled.
// Global styles get their own <style data-emotion="px-global ..."> tag because
// Emotion's <Global> looks for that attribute when it hydrates.
export default function EmotionRegistry({ children }) {
  const [registry] = useState(() => {
    const cache = createCache({ key: "px" });
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted = [];

    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = registry.flush();
    if (names.length === 0) return null;

    const { cache } = registry;
    const globals = [];
    let styles = "";
    let dataEmotion = cache.key;

    names.forEach(({ name, isGlobal }) => {
      const style = cache.inserted[name];
      if (typeof style !== "string") return;
      if (isGlobal) {
        globals.push({ name, style });
      } else {
        styles += style;
        dataEmotion += ` ${name}`;
      }
    });

    return (
      <>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {styles && (
          <style data-emotion={dataEmotion} dangerouslySetInnerHTML={{ __html: styles }} />
        )}
      </>
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
