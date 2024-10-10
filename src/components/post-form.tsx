import { Button, TextareaAutosize } from "@mui/material";
import dayjs from "dayjs";
import { SimplePool, UnsignedEvent, verifyEvent } from "nostr-tools";
import { ShortTextNote } from "nostr-tools/kinds";
import { ChangeEvent, useState } from "react";
import { RELAY_SERVERS } from "../constants";

export const PostForm = () => {
  const [content, setContent] = useState("");

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const pool = new SimplePool();
  const handleClickButton = async () => {
    if (!window.nostr) {
      alert("nos2xを追加してください");
      return;
    }

    const publicKey = await window.nostr.getPublicKey();

    const unsignedEvent: UnsignedEvent = {
      kind: ShortTextNote,
      created_at: dayjs().unix(),
      tags: [],
      content: content,
      pubkey: publicKey,
    };

    const event = await window.nostr.signEvent(unsignedEvent);

    const isGood = verifyEvent(event);

    if (isGood) {
      pool.publish(RELAY_SERVERS, event);

      setContent("");
    } else {
      throw new Error("投稿に失敗しました");
    }
  };

  return (
    <div>
      <TextareaAutosize
        minRows={5}
        value={content}
        onChange={handleTextAreaChange}
      />

      <Button onClick={handleClickButton}>送信</Button>
    </div>
  );
};
