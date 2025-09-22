import { useChat } from '@ai-sdk/react';
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@rolder/ui-kit-react';
import {
  IconArrowUp,
  IconLoader,
  IconSquare,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useChatContext } from '@/contexts';
import { convertBlobFilesToDataURLs } from '@/utils';

export const ChatInput = () => {
  const [input, setInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { chat } = useChatContext();
  const { messages, setMessages, sendMessage, status, error } = useChat({
    chat,
  });

  const handleSubmit = async (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    if (error != null) {
      setMessages(messages.slice(0, -1)); // remove last message
    }

    // Конвертируем blob URLs в data URLs для attachments
    const convertedFiles = message.files
      ? await convertBlobFilesToDataURLs(message.files)
      : undefined;

    sendMessage({
      text: message.text || 'Отправлены файлы',
      files: convertedFiles,
    });
    setInput('');
  };

  return (
    <PromptInput
      className="rounded-xl relative border shadow-sm transition-all duration-200 focus-within:border-border hover:border-muted-foreground/50"
      onSubmit={handleSubmit}
      globalDrop
      multiple
      // accept="image/*"
      maxFiles={5}
      maxFileSize={1024 * 1024 * 10}
      // onError={(e) => {}}
    >
      <PromptInputBody>
        {/*<ChatAttachment status={status} />*/}

        <PromptInputTextarea
          className="text-sm resize-none py-3 px-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-transparent !border-0 !border-none outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none placeholder:text-muted-foreground min-h-20"
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          value={input}
          placeholder="Введите сообщение..."
        />
      </PromptInputBody>

      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputActionMenu
            open={dropdownOpen}
            // onOpenChange={setDropdownOpen}
          >
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              {/*<AttachmentsButton onClose={() => setDropdownOpen(false)} />*/}
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit>
          {/*variant="secondary"*/}
          {status === 'ready' && (
            <IconArrowUp className="size-5 text-muted-foreground" />
          )}
          {status === 'submitted' && (
            <IconLoader className="size-4 animate-spin" />
          )}
          {status === 'streaming' && <IconSquare className="size-4" />}
          {status === 'error' && <IconX className="size-4" />}
        </PromptInputSubmit>
      </PromptInputToolbar>
    </PromptInput>
  );
};
