import { useCallback, useEffect, useRef, useState } from "react";
import { SimplePool, Event } from "nostr-tools";
import { ShortTextNote } from "nostr-tools/kinds";
import { SubCloser } from "nostr-tools/abstract-pool";
import { Card } from "@mui/material";
import { CardHeader } from "@mui/material";
import { CardContent } from "@mui/material";
import { CardActions } from "@mui/material";
import { Typography } from "@mui/material";

import { RELAY_SERVERS } from "../constants";

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
          <Card key={item.id} sx={{ marginBottom: 5 }}>
            <CardHeader
              title={
                <Typography
                  sx={{
                    wordBreak: "break-all",
                  }}
                >
                  id: {item.id}
                </Typography>
              }
              subheader={
                <Typography
                  sx={{
                    wordBreak: "break-all",
                  }}
                >
                  public key: {item.pubkey}
                </Typography>
              }
            />

            <CardContent>
              <Typography>content: {item.content}</Typography>
            </CardContent>

            <CardActions>
              <Typography>created at: {item.created_at}</Typography>
            </CardActions>
          </Card>
        ))}
    </div>
  );
};
