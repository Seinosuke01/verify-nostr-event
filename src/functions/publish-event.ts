import { EventPublishData } from '../entities';
import { verifyEvent, SimplePool } from 'nostr-tools';
import dayjs from 'dayjs';

const publishEvent = async (
  publishRequestData: EventPublishData,
  setLoading: (loading: boolean) => void,
  pool: SimplePool
) => {
  if (!window.nostr) {
    alert('Nostr 対応ウォレットが利用できません。');
    return;
  }
  setLoading(true);

  try {
    const publicKey = await window.nostr.getPublicKey();

    const kindNumber = Number(publishRequestData.kind);

    const signedEvent = {
      kind: kindNumber,
      content: publishRequestData.content,
      pubkey: publicKey,
      tags: publishRequestData.tags,
      created_at: dayjs().unix(),
    };

    const event = await window.nostr.signEvent(signedEvent);
    const isValid = verifyEvent(event);

    if (isValid) {
      pool.publish([publishRequestData.relay_server], event);
      console.log('Event published:', event);
    }
  } catch (error) {
    console.error('Event publish error:', error);
  } finally {
    setLoading(false);
  }
};

export default publishEvent;
