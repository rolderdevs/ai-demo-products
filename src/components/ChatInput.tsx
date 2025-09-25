import { useChat } from '@ai-sdk/react';
import { css } from '@rolder/ss/css';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  useToast,
} from '@rolder/ui-kit-react';
import { useChatContext } from '@/contexts';
import { convertBlobFilesToDataURLs } from '@/utils';

export const ChatInput = () => {
  const { chat } = useChatContext();
  const toast = useToast();
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
  };

  return (
    <PromptInput
      className={css({
        pos: 'relative',
        rounded: 'xl',
        border: '1px solid',
        borderColor: 'border',
        shadow: 'sm',
        transition: 'all 0.2s',
        _focusWithin: {
          borderColor: 'border',
        },
        _hover: {
          borderColor: 'border.hover',
        },
      })}
      onSubmit={handleSubmit}
      globalDrop
      multiple
      acceptedFileTypes={['images', 'pdf', 'excel', 'word']}
      maxFiles={5}
      maxFileSize={1024 * 1024 * 10} // 10MB
      onError={(error) => {
        if ('message' in error) {
          toast.warning({ description: error.message });
        }
      }}
    >
      <PromptInputAttachments>
        {(attachment) => <PromptInputAttachment data={attachment} />}
      </PromptInputAttachments>
      <PromptInputBody>
        <PromptInputTextarea autoFocus placeholder="Введите сообщение..." />
      </PromptInputBody>

      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments value="add-files" />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit status={status} />
      </PromptInputToolbar>
    </PromptInput>
  );
};
