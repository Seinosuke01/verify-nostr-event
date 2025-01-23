import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
  TextField
} from '@mui/material';

interface RelayServerSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const RelayServerSelect: React.FC<RelayServerSelectProps> = ({
  value,
  onChange,
}) => {
  // カスタム入力用の状態
  const [customRelay, setCustomRelay] = useState(
    value !== 'wss://relay.damus.io' && value !== 'wss://relay.groups.nip29.com'
      ? value
      : ''
  );

  // リレー候補のリスト
  const predefinedRelays = [
    'wss://relay.damus.io',
    'wss://relay.groups.nip29.com',
  ];
  
  // Select 変更時のイベント
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value as string;
    if (selectedValue === 'custom') {
      // カスタムを選んだ場合はひとまず現在のカスタム値を親に返す
      onChange(customRelay);
    } else {
      onChange(selectedValue);
    }
  };

  // TextField 変更時のイベント（カスタムリレー用）
  const handleCustomRelayChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomRelay(event.target.value);
    // Select が "custom" を指している場合のみ、親に値を渡す
    if (value === 'custom' || !predefinedRelays.includes(value)) {
      onChange(event.target.value);
    }
  };

  // value がプリセットではなく、かつ空文字列でもない場合は
  // 実質的に「custom」扱いとして表示させるための変数
  const displayValue = predefinedRelays.includes(value) ? value : 'custom';

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id='relay-select-label'>RELAY SERVER</InputLabel>
        <Select
          labelId='relay-select-label'
          id='relay-select'
          value={displayValue}
          label='relay server'
          onChange={handleSelectChange}
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
          {/* 既存の選択肢 */}
          {predefinedRelays.map((relay) => (
            <MenuItem key={relay} value={relay}>
              <Box display='flex' alignItems='center'>
                🌐 <span style={{ marginLeft: 8 }}>{relay}</span>
              </Box>
            </MenuItem>
          ))}

          {/* カスタム用 */}
          <MenuItem value='custom'>
            <Box display='flex' alignItems='center'>
              📝 <span style={{ marginLeft: 8 }}>Custom Relay</span>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      {/* カスタムが選ばれている場合のみ TextField を表示 */}
      {displayValue === 'custom' && (
        <Box mt={2}>
          <TextField
            fullWidth
            label='Custom Relay URL'
            variant='outlined'
            value={customRelay}
            onChange={handleCustomRelayChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default RelayServerSelect;

