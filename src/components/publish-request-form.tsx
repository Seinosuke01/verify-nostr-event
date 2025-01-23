import React, { useState, useMemo } from 'react';
import { SimplePool } from 'nostr-tools';
import { Box, TextField, Button, Stack, Snackbar, Alert } from '@mui/material';
import { EventPublishData } from '../entities';
import RelayServerSelect from './relay-server-select';
import publishEvent from '../functions/publish-event';
import tagsFormatChange from '../functions/tags-format-change';

interface PublishRequestFormProps {
  publishRequestEvent: EventPublishData;
  setPublishRequestEvent: React.Dispatch<React.SetStateAction<EventPublishData>>;
}

const PublishRequestForm: React.FC<PublishRequestFormProps> = ({
  publishRequestEvent,
  setPublishRequestEvent,
}) => {
  const pool = useMemo(() => new SimplePool(), []);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const [loading, setLoading] = useState(false);
  const [tagsInput, setTagsInput] = useState<string>('');

  const handleSetRequest = async () => {
    try {
      if (!publishRequestEvent.kind || publishRequestEvent.kind.trim() === '') {
        throw new Error('Kind が未入力です。');
      }
      if (
        !publishRequestEvent.relay_server ||
        publishRequestEvent.relay_server.trim() === ''
      ) {
        throw new Error('リレーサーバーが未入力です。');
      }

      await publishEvent(publishRequestEvent, setLoading, pool);

      // 成功時
      setSnackbarMessage('Eventの公開に成功しました。');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(
        `エラーが発生しました: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Stack spacing={2}>
        <TextField
          label='Kind (数字)'
          value={publishRequestEvent.kind}
          onChange={(e) =>
            setPublishRequestEvent({
              ...publishRequestEvent,
              kind: e.target.value,
            })
          }
          placeholder='例：1'
        />
        <TextField
          label='Content'
          value={publishRequestEvent.content}
          onChange={(e) =>
            setPublishRequestEvent({
              ...publishRequestEvent,
              content: e.target.value,
            })
          }
          multiline
          rows={3}
        />
        <TextField
          label='Tags (複数行入力：各行をカンマ区切り)'
          value={tagsInput}
          onChange={(e) =>
            tagsFormatChange({
              text: e.target.value,
              setTagsInput,
              setPublishRequestEvent,
            })
          }
          multiline
          rows={4}
          placeholder={'例：\nr,hogehoge\np,npubhex'}
        />
        <RelayServerSelect
          value={publishRequestEvent.relay_server}
          onChange={(value) =>
            setPublishRequestEvent({
              ...publishRequestEvent,
              relay_server: value,
            })
          }
        />
        <Button
          variant='contained'
          onClick={() => handleSetRequest()}
          disabled={loading}
        >
          <Box
            fontWeight='bold'
            sx={{
              textTransform: 'none',
            }}
          >
            {loading ? 'Publishing...' : 'Publish Event'}
          </Box>
        </Button>
      </Stack>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PublishRequestForm;