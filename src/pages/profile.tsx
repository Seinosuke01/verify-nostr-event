import { Avatar, Box, Divider, Input } from "@mui/material";
import { SimplePool, verifyEvent } from "nostr-tools";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { RELAY_SERVERS } from "../constants";
import { Metadata } from "nostr-tools/kinds";
import dayjs from "dayjs";

type Profile = {
  name?: string;
  picture?: string;
};

export const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>();
  const [loading, setLoading] = useState(false);

  const pool = useMemo(() => new SimplePool(), []);

  const getProfile = useCallback(async () => {
    if (!window.nostr) {
      alert("nos2xを追加してください");
      return;
    }

    const publicKey = await window.nostr.getPublicKey();

    const event = await pool.get(RELAY_SERVERS, {
      kinds: [Metadata],
      authors: [publicKey],
    });

    if (event) {
      const profile = JSON.parse(event.content) as Profile;

      setProfile(profile);
    }
  }, [pool]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProfile((state) => ({
      ...state,
      picture: event.target.value,
    }));
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProfile((state) => ({
      ...state,
      name: event.target.value,
    }));
  };

  const handleInputBlur = async () => {
    if (!window.nostr) {
      return;
    }

    setLoading(true);

    const publicKey = await window.nostr.getPublicKey();

    const event = await window.nostr.signEvent({
      kind: Metadata,
      content: JSON.stringify(profile),
      pubkey: publicKey,
      tags: [],
      created_at: dayjs().unix(),
    });

    if (verifyEvent(event)) {
      await pool.publish(RELAY_SERVERS, event);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: "600px", marginTop: 5 }}>
      <h1>Profile</h1>

      <Divider sx={{ bgcolor: "white" }} />

      <h2>Icon</h2>
      <Avatar src={profile?.picture} sx={{ marginBottom: 2 }} />
      <Input
        sx={{ color: "white" }}
        placeholder={profile?.picture ?? "No Link"}
        value={profile?.picture ?? ""}
        onChange={handleAvatarChange}
        onBlur={handleInputBlur}
      />

      <h2>Name</h2>
      <Input
        sx={{ color: "white" }}
        placeholder={profile?.name ?? "No Name"}
        value={profile?.name ?? ""}
        onChange={handleNameChange}
        onBlur={handleInputBlur}
      />

      {loading && <p>Saving...</p>}
    </Box>
  );
};
