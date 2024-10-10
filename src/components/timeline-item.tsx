import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { SimplePool } from "nostr-tools";
import { Metadata } from "nostr-tools/kinds";
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { RELAY_SERVERS } from "../constants";
import { Profile } from "../entities";
import dayjs from "dayjs";

type TimelineItemProps = {
  pubkey: string;
  content: string;
  created_at: number;
};

export const TimelineItem: FC<TimelineItemProps> = ({
  pubkey,
  content,
  created_at,
}) => {
  const [profile, setProfile] = useState<Profile>();
  const pool = useMemo(() => new SimplePool(), []);

  // 日付
  const createdAt = useMemo(() => dayjs(created_at * 1000), [created_at]);

  // プロフィールを取得
  const getProfile = useCallback(async () => {
    const event = await pool.get(RELAY_SERVERS, {
      kinds: [Metadata],
      authors: [pubkey],
    });

    if (event) {
      const profile = JSON.parse(event.content) as Profile;

      setProfile(profile);
    }
  }, [pool, pubkey]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <Card sx={{ marginBottom: 5 }}>
      {profile && (
        <CardHeader
          title={
            <div style={{ display: "flex" }}>
              <Avatar src={profile?.picture} sx={{ marginRight: 1 }} />

              <Typography alignContent="center">{profile.name}</Typography>
            </div>
          }
        />
      )}

      <CardContent>
        <Typography>{content}</Typography>
      </CardContent>

      <CardActions>
        <Typography>{createdAt.format("YYYY/MM/DD (ddd) HH:mm")}</Typography>
      </CardActions>
    </Card>
  );
};
