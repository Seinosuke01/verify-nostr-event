import { Avatar, Box, Button, Divider, Input } from '@mui/material';
import { SimplePool, verifyEvent } from 'nostr-tools';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { RELAY_SERVERS } from '../constants';
import { Metadata } from 'nostr-tools/kinds';
import dayjs from 'dayjs';
import { Profile } from '../entities';

export const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>();
  const [loading, setLoading] = useState(false);

  const pool = useMemo(() => new SimplePool(), []);

  const getProfile = useCallback(async () => {
    if (!window.nostr) {
      alert('nos2xを追加してください');
      return;
    }

    const publicKey = await window.nostr.getPublicKey();

    const event = await pool.get(RELAY_SERVERS, {
      kinds: [Metadata],
      authors: [publicKey],
    });

    if (event) {
      console.log('relay: ', RELAY_SERVERS);
      const profile = JSON.parse(event.content) as Profile;
      console.log('profile', profile);

      setProfile(profile);
    }
  }, [pool]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleChangeProfileMetadata = async () => {
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

    const isValid = verifyEvent(event);

    console.log('isValid', isValid);

    if (isValid) {
      await pool.publish(RELAY_SERVERS, event);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: '600px', marginTop: 5 }}>
      <h1>Profile</h1>

      <Divider sx={{ bgcolor: 'white' }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <h2>Icon</h2>
        <Avatar src={profile?.picture} sx={{ marginBottom: 2 }} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <h2>Name</h2>
        <Input
          placeholder={profile?.display_name ?? 'No Name'}
          value={profile?.display_name ?? ''}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setProfile((state) => ({
              ...state,
              display_name: event.target.value,
            }));
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <h2>UserName</h2>
        <p>@</p>
        <Input
          placeholder={profile?.name ?? 'No About'}
          value={profile?.name ?? ''}
          multiline
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setProfile((state) => ({
              ...state,
              name: event.target.value,
            }));
          }}
          sx={{ width: '100%', whiteSpace: 'pre-wrap' }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <h2>About</h2>
        <Input
          placeholder={profile?.about ?? 'No About'}
          value={profile?.about ?? ''}
          multiline
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setProfile((state) => ({
              ...state,
              about: event.target.value,
            }));
          }}
          sx={{ width: '100%', whiteSpace: 'pre-wrap' }}
        />
      </Box>

      <Button
        variant='contained'
        color='primary'
        onClick={handleChangeProfileMetadata}
        disabled={loading}
        sx={{ marginTop: 3 }}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>

      {loading && <p>Saving...</p>}
    </Box>
  );
};
