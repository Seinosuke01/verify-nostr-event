import { useCallback, useEffect, useRef, useState } from "react";
import { SimplePool, Event } from "nostr-tools";
import { ShortTextNote } from "nostr-tools/kinds";
import { SubCloser } from "nostr-tools/abstract-pool";

import { RELAY_SERVERS } from "../constants";
import { TimelineItem } from "./timeline-item";

export const Timeline = () => {
  const [timeline, setTimeline] = useState<Event[]>([]);
  const subCloser = useRef<SubCloser>();

  const setTimelineSubscribe = useCallback(() => {
    const pool = new SimplePool();

    subCloser.current = pool.subscribeMany(
      RELAY_SERVERS,
      [
        {
          authors: undefined,
          kinds: [ShortTextNote],
        },
      ],
      {
        onevent(event) {
          setTimeline((state) => {
            return [...state, event];
          });
        },
        onclose() {
          subCloser.current?.close();
        },
      }
    );
  }, []);

  useEffect(() => {
    if (!subCloser.current) {
      setTimelineSubscribe();
    }
  }, [setTimelineSubscribe]);

  return (
    <div>
      {timeline
        .sort((a, b) => b.created_at - a.created_at)
        .map((item) => (
          <TimelineItem key={item.id} {...item} />
        ))}
    </div>
  );
};
