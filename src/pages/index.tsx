import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import dayjs from 'dayjs';
import { EventPublishData, EventGetData, EventGetRequestData } from '../entities';
import GetRequestForm from '../components/get-request-form';
import PublishRequestForm from '../components/publish-request-form';

export const IndexPage = () => {
  const [publishRequestEvent, setPublishRequestEvent] = useState<EventPublishData>({
    kind: '1',
    content: '',
    pubkey: '',
    tags: [],
    created_at: dayjs().unix(),
    relay_server: '',
  });

  const [getResponseEvent, setGetResponseEvent] = useState<EventGetData>({
    id: '',
    kind: '',
    content: '',
    pubkey: '',
    tags: [],
    created_at: 0,
  });

  const [getRequestData, setGetRequestData] = useState<EventGetRequestData>({
    kind: '1',
    author: '',
    relay_server: '',
  });

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: 2,
      }}
    >
      <Typography variant='h4' fontWeight='bold' gutterBottom>
        Nostr EVENT 管理
      </Typography>
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
            Publish Event
          </Typography>
          <PublishRequestForm
            publishRequestEvent={publishRequestEvent}
            setPublishRequestEvent={setPublishRequestEvent}
          />
        </Paper>

        <Paper elevation={3} sx={{ flex: 1, minWidth: 300, padding: 2 }}>
          <Typography variant='h5' fontWeight='bold'>
            Get Event
          </Typography>
          <GetRequestForm
            getRequestData={getRequestData}
            setGetRequestData={setGetRequestData}
            setGetResponseEvent={setGetResponseEvent}
          />
          <Divider sx={{ my: 2 }} />

          {getResponseEvent.id ? (
            <Card variant='outlined'>
              <CardContent>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>ID:</strong> {getResponseEvent.id}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Kind:</strong> {getResponseEvent.kind}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Content:</strong> {getResponseEvent.content}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Pubkey:</strong> {getResponseEvent.pubkey}
                </Typography>
                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Created At:</strong> {getResponseEvent.created_at}
                </Typography>

                <Typography variant='body1' sx={{ mb: 1 }}>
                  <strong>Tags:</strong>
                </Typography>
                {getResponseEvent.tags.length > 0 ? (
                  <Box component='ul' sx={{ pl: 4, mb: 1 }}>
                    {getResponseEvent.tags.map((tagArr, idx) => (
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
