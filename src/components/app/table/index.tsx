import { useChat } from '@ai-sdk/react';
import { Columns3Cog, Download } from 'lucide-react';
import { useCallback } from 'react';
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactHeader,
} from '@/components/ai-elements/artifact';
import { useChatContext } from '@/contexts/chat-context';
import { Table } from './Table';
import { exportToXlsx } from './utils';

export const TableArtifact = () => {
  const { chat, columns, rows } = useChatContext();
  const { sendMessage } = useChat({
    chat,
  });

  const exportXlsx = useCallback(
    () => exportToXlsx(columns, rows),
    [columns, rows],
  );

  return (
    <Artifact className="w-4/5 h-full">
      <ArtifactHeader className="h-10 bg-stone-700 justify-end">
        <ArtifactActions>
          <ArtifactAction
            icon={Columns3Cog}
            label="Привести к станадарту"
            tooltip="Привести к станадарту"
            className="text-foreground"
            disabled={columns.length === 0}
            onClick={() => {
              sendMessage({ text: 'Приведи к станадарту' });
            }}
          />
          <ArtifactAction
            icon={Download}
            label="Экспортировать в Excel"
            tooltip="Экспортировать в Excel"
            className="text-foreground"
            disabled={columns.length === 0}
            onClick={exportXlsx}
          />
        </ArtifactActions>
      </ArtifactHeader>

      <Table />
    </Artifact>
  );
};
