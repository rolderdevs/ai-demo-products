import { IconPaperclip } from '@tabler/icons-react';
import type { FileUIPart } from 'ai';

export const ChatFile = ({ filePart }: { filePart: FileUIPart }) => {
  if (filePart.mediaType?.startsWith('image/'))
    return (
      <img
        src={filePart.url}
        alt={filePart.filename || 'Прикрепленное изображение'}
        className="rounded-md object-cover"
        width={64}
        height={64}
      />
    );
  if (!filePart.mediaType?.startsWith('image/'))
    return (
      <div className="flex items-center p-2 bg-muted rounded-lg max-w-xs h-16 text-sm gap-2">
        <IconPaperclip className="size-4" />
        {filePart.filename || 'Прикрепленный файл'}
      </div>
    );
};
