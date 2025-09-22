import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@rolder/ui-kit-react';
import { css } from '~ss/css';

export const ChatReasoning = ({
  text,
  isStreaming,
}: {
  text: string;
  isStreaming: boolean;
}) => {
  return (
    <Reasoning
      className={css({ w: 'full' })}
      isStreaming={isStreaming}
      defaultOpen={false}
    >
      <ReasoningTrigger />
      <ReasoningContent>{text}</ReasoningContent>
    </Reasoning>
  );
};
