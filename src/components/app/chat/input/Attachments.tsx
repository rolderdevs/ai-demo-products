import type { ChatStatus } from 'ai';
import { ImageIcon } from 'lucide-react';
import { useEffect } from 'react';
import {
  PromptInputAttachment,
  PromptInputAttachments,
  usePromptInputAttachments,
} from '@/components/ai-elements/prompt-input';

export const ChatAttachment = ({ status }: { status: ChatStatus }) => {
  const { clear } = usePromptInputAttachments();

  useEffect(() => {
    if (status === 'submitted') {
      clear();
    }
  }, [status, clear]);

  return (
    <PromptInputAttachments>
      {(attachment) => <PromptInputAttachment data={attachment} />}
    </PromptInputAttachments>
  );
};

export const AttachmentsButton = ({ onClose }: { onClose: () => void }) => {
  const attachments = usePromptInputAttachments();

  const handleClick = () => {
    attachments.openFileDialog();
    onClose();
  };

  return (
    <button
      type="button"
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      onClick={handleClick}
    >
      <ImageIcon className="mr-2 size-4" /> Добавить файл
    </button>
  );
};
