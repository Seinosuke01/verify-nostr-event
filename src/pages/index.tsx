import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  Card,
  CardContent,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import dayjs from 'dayjs';
import { SimplePool, verifyEvent } from 'nostr-tools';
import { EventPostData, EventGetData } from '../entities';

export const IndexPage = () => {
  const [eventData, setEventData] = useState<EventPostData>({
    kind: '',
    content: '',
    pubkey: '',
    tags: [],
    created_at: dayjs().unix(),
  });

  const [fetchedEventData, setFetchedEventData] = useState<EventGetData | null>(
    null
  );

  const [tagsInput, setTagsInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [relay_server, setRelayServer] = useState<string>('');

  const pool = useMemo(() => new SimplePool(), []);

  const getEventData = useCallback(async () => {
    if (!window.nostr) {
      alert('Nostr 対応ウォレット(nos2x等)を追加してください');
      return;
    }
    try {
      const publicKey = await window.nostr.getPublicKey();

      const kindNumber = Number(eventData.kind) || 1;

      const event = await pool.get([relay_server], {
        kinds: [kindNumber],
        authors: [publicKey],
      });

      if (event) {
        const fetched: EventGetData = {
          id: event.id,
          kind: String(event.kind),
          content: event.content,
          pubkey: event.pubkey,
          tags: event.tags ?? [],
          created_at: event.created_at,
        };
        setFetchedEventData(fetched);
      } else {
        setFetchedEventData(null);
        setTagsInput('');
      }
    } catch (error) {
      console.error('Failed to fetch event data:', error);
    }
  }, [eventData.kind, pool, relay_server]);

  const handlePublishEvent = useCallback(async () => {
    if (!window.nostr) {
      alert('Nostr 対応ウォレットが利用できません。');
      return;
    }
    setLoading(true);

    try {
      const publicKey = await window.nostr.getPublicKey();

      const kindNumber = Number(eventData.kind) || 1;

      const signedEvent = {
        kind: kindNumber,
        content: eventData.content,
        pubkey: publicKey,
        tags: eventData.tags,
        created_at: dayjs().unix(),
      };

      const event = await window.nostr.signEvent(signedEvent);
      const isValid = verifyEvent(event);

      if (isValid) {
        pool.publish([relay_server], event);
        console.log('Event published:', event);
      }
    } catch (error) {
      console.error('Event publish error:', error);
    } finally {
      await getEventData();
      setLoading(false);
    }
  }, [eventData, getEventData, pool, relay_server]);

  useEffect(() => {
    getEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTagsChange = (text: string) => {
    setTagsInput(text);

    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    const tagPairs = lines.map((line) =>
      line
        .split(',')
        .map((segment) => segment.trim())
        .filter((segment) => segment !== '')
    );

    setEventData((prev) => ({
      ...prev,
      tags: tagPairs,
    }));
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 2,
      }}
    >
      <Typography variant='h4' fontWeight='bold' gutterBottom>
        Nostr イベント管理
      </Typography>
      <Typography variant='subtitle1' fontWeight='bold' gutterBottom>
        選択しているリレーサーバー
      </Typography>
      <FormControl fullWidth>
        <InputLabel id='relay-select-label'>RELAY SERVER</InputLabel>
        <Select
          labelId='relay-select-label'
          id='relay-select'
          value={relay_server}
          label='リレーサーバー'
          onChange={(e) => setRelayServer(e.target.value as string)}
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#007bff',
            },
          }}
        >
          <MenuItem value='wss://relay.damus.io'>
            <Box display='flex' alignItems='center'>
              🌐 <span style={{ marginLeft: 8 }}>wss://relay.damus.io</span>
            </Box>
          </MenuItem>
          <MenuItem value='wss://relay.groups.nip29.com'>
            <Box display='flex' alignItems='center'>
              🌐{' '}
              <span style={{ marginLeft: 8 }}>
                wss://relay.groups.nip29.com
              </span>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <Box
        sx={{
          marginTop: 5,
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        <Paper elevation={3} sx={{ flex: 1, minWidth: 300, padding: 2 }}>
          <Typography variant='h5' fontWeight='bold' gutterBottom>
            イベントデータ入力フォーム
          </Typography>
          <Stack spacing={2}>
            <TextField
              label='Kind (数字)'
              value={eventData.kind}
              onChange={(e) =>
                setEventData({ ...eventData, kind: e.target.value })
              }
              placeholder='例：1'
            />

            <TextField
              label='Content'
              value={eventData.content}
              onChange={(e) =>
                setEventData({ ...eventData, content: e.target.value })
              }
              multiline
              rows={3}
            />

            <TextField
              label='Tags (複数行入力：各行をカンマ区切り)'
              value={tagsInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              multiline
              rows={4}
              placeholder={'例：\nr,hogehoge\np,npubhex'}
            />

            <Button
              variant='contained'
              onClick={handlePublishEvent}
              disabled={loading}
            >
              {loading ? '送信中...' : 'イベントを送信'}
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={3} sx={{ flex: 1, minWidth: 300, padding: 2 }}>
          <Typography variant='h5' fontWeight='bold'>
            取得したイベント
          </Typography>
          <Divider sx={{ my: 2 }} />

          {fetchedEventData ? (
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>ID:</strong> {fetchedEventData.id}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Kind:</strong> {fetchedEventData.kind}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Content:</strong> {fetchedEventData.content}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Pubkey:</strong> {fetchedEventData.pubkey}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Created At:</strong> {fetchedEventData.created_at}
                </Typography>

                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Tags:</strong>
                </Typography>
                {fetchedEventData.tags.length > 0 ? (
                  <Box component='ul' sx={{ pl: 4, mb: 1 }}>
                    {fetchedEventData.tags.map((tagArr, idx) => (
                      <li key={idx}>{JSON.stringify(tagArr)}</li>
                    ))}
                  </Box>
                ) : (
                  <Typography>タグはありません</Typography>
                )}
              </CardContent>
            </Card>
          ) : (
            <Typography sx={{ marginTop: 2 }}>
              該当するイベントがまだありません。
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};
