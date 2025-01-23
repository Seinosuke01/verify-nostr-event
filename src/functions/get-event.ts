import { SimplePool } from 'nostr-tools';
import { EventGetData, EventGetRequestData } from '../entities';

interface GetEventDataProps {
  getRequestData: EventGetRequestData;
  setLoading: (loading: boolean) => void;
  pool: SimplePool;
  setGetResponseEvent: (data: EventGetData) => void;
}

const getEvent = async ({
  getRequestData,
  setLoading,
  pool,
  setGetResponseEvent,
}: GetEventDataProps) => {
  if (!window.nostr) {
    alert('Nostr 対応ウォレット(nos2x等)を追加してください');
    return;
  }
  setLoading(true);

  try {
    const publicKey = getRequestData.author || await window.nostr.getPublicKey();

    const kindNumber = Number(getRequestData.kind);

    const event = await pool.get([getRequestData.relay_server], {
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
      setGetResponseEvent(fetched);
    } else {
      setGetResponseEvent({} as EventGetData);
    }
  } catch (error) {
    console.error('Failed to fetch event data:', error);
  } finally {
    setLoading(false);
  }
};

export default getEvent;
