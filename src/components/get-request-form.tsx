import React, { useState, useMemo } from 'react';
import { SimplePool } from 'nostr-tools';
import { Box, TextField, Button, Stack, Snackbar, Alert } from '@mui/material';
import { EventGetRequestData, EventGetData } from '../entities';
import RelayServerSelect from './relay-server-select';
import getEvent from '../functions/get-event';

interface GetRequestFormProps {
  getRequestData: EventGetRequestData;
  setGetRequestData: React.Dispatch<React.SetStateAction<EventGetRequestData>>;
  setGetResponseEvent: React.Dispatch<React.SetStateAction<EventGetData>>;
}

const GetRequestForm: React.FC<GetRequestFormProps> = ({
  getRequestData,
  setGetRequestData,
  setGetResponseEvent,
}) => {
  const pool = useMemo(() => new SimplePool(), []);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof EventGetRequestData, value: string) => {
    setGetRequestData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSetRequest = async () => {
    try {
      if (!getRequestData.kind || getRequestData.kind.trim() === '') {
        throw new Error('Kind が未入力です。');
      }
      if (
        !getRequestData.relay_server ||
        getRequestData.relay_server.trim() === ''
      ) {
        throw new Error('リレーサーバーが未入力です。');
      }

      await getEvent({
        getRequestData,
        setLoading,
        setGetResponseEvent,
        pool,
      });

      // 成功時
      setSnackbarMessage('Eventの取得に成功しました。');
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
          label='Kind (Number)'
          value={getRequestData.kind}
          onChange={(e) => handleChange('kind', e.target.value)}
          placeholder='例：1'
        />
        <TextField
          label='Author (Optional. If not, it will be your public key.)'
          value={getRequestData.author}
          onChange={(e) => handleChange('author', e.target.value)}
          placeholder='例：0123...'
        />
        <RelayServerSelect
          value={getRequestData.relay_server}
          onChange={(value) => handleChange('relay_server', value)}
        />
        <Button
          variant='contained'
          onClick={handleSetRequest}
          sx={{
            textTransform: 'none',
          }}
          disabled={loading}
        >
          <Box fontWeight='bold'>{ loading ? "Getting" : "Get Event"}</Box>
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

export default GetRequestForm;
