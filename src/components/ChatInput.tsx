import { useChat } from '@ai-sdk/react';
import { css, cx } from '@rolder/ss/css';
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
} from '@rolder/ui-kit-react';
import {
  IconArrowUp,
  IconLoader,
  IconSquare,
  IconX,
} from '@tabler/icons-react';

import { useChatContext } from '@/contexts';
import { convertBlobFilesToDataURLs } from '@/utils';

export const ChatInput = () => {
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
          borderColor: 'muted.foreground/50',
        },
      })}
      onSubmit={handleSubmit}
      globalDrop
      multiple
      acceptedFileTypes={['images', 'pdf', 'excel', 'word']}
      maxFiles={5}
      maxFileSize={1024 * 1024 * 10}
      // onError={(e) => {}}
    >
      <PromptInputAttachments>
        {(attachment) => <PromptInputAttachment data={attachment} />}
      </PromptInputAttachments>
      <PromptInputBody>
        <PromptInputTextarea
          className={cx(
            css({
              fontSize: 'sm',
              resize: 'none',
              py: 3,
              px: 3,
              bg: 'transparent',
              border: 'none',
              outline: 'none',
              ring: 0,
              minH: 20,
              _focusVisible: {
                ring: 0,
                ringOffset: 0,
                outline: 'none',
              },
              _placeholder: {
                color: 'muted.foreground',
              },
            }),
            '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          )}
          autoFocus
          placeholder="Введите сообщение..."
        />
      </PromptInputBody>

      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger
              variant="secondary"
              size="sm"
              className={css({
                color: 'text.muted',
                _hover: { color: 'text' },
              })}
            />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments value="add-files" />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit
          variant="secondary"
          size="sm"
          className={css({
            color: 'text.muted',
            _hover: { color: 'text' },
          })}
        >
          {status === 'ready' && <IconArrowUp size={16} />}
          {status === 'submitted' && (
            <IconLoader size={16} className={css({ animation: 'spin' })} />
          )}
          {status === 'streaming' && <IconSquare size={16} />}
          {status === 'error' && <IconX size={16} />}
        </PromptInputSubmit>
      </PromptInputToolbar>
    </PromptInput>
  );
};
