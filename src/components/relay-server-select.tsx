// RelayServerSelect.tsx
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
} from '@mui/material';

interface RelayServerSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const RelayServerSelect: React.FC<RelayServerSelectProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value as string);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id='relay-select-label'>RELAY SERVER</InputLabel>
      <Select
        labelId='relay-select-label'
        id='relay-select'
        value={value}
        label='relay server'
        onChange={handleChange}
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
            <span style={{ marginLeft: 8 }}>wss://relay.groups.nip29.com</span>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default RelayServerSelect;
