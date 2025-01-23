import { EventPublishData } from '../entities';

interface HandleTagsChangeParams {
  text: string;
  setTagsInput: (tags: string) => void;
  setPublishRequestEvent: React.Dispatch<React.SetStateAction<EventPublishData>>;
}

const tagsFormatChange = ({
  text,
  setTagsInput,
  setPublishRequestEvent,
}: HandleTagsChangeParams) => {
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

  setPublishRequestEvent((prev) => ({
    ...prev,
    tags: tagPairs,
  }));
};

export default tagsFormatChange;
