import type { Chat } from './ChatList';

import { ChatInput } from './ChatInput';
import { ChatList } from './ChatList';
import { useTasks } from '@/utils/hooks/api/useTasks';
import { useASRInput } from '@/utils/hooks/useASRInput';
import { useAuth } from '@/utils/hooks/useAuth';
import { taskApi } from '@/utils/openApi';
import { Tooltip } from '@mantine/core';
import { IconMessageChatbot, IconQuestionMark } from '@tabler/icons-react';

const MOCK_CHAT: Chat[] = [
  {
    from: 'bot',
    message: 'こんにちは！',
    sentAt: new Date(),
  },
  {
    from: 'user',
    message:
      'こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！',
    sentAt: new Date(),
  },
  {
    from: 'bot',
    message:
      'こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！こんにちは！',
    sentAt: new Date(),
  },
];

export const ChatView = () => {
  const { user } = useAuth();
  const { refetchTasks } = useTasks({
    userIds: user?.user_id !== undefined ? [user.user_id] : undefined,
  });
  const { inputValue, setInputValue, toggleRecording, transcript, recording } =
    useASRInput({
      target: 'chatbot',
    });

  const onSend = async () => {
    if (user == undefined) {
      return;
    }

    await taskApi.postTask({
      user_id: user.user_id,
      text: inputValue,
    });

    setInputValue('');

    await refetchTasks();
  };

  return (
    <div className="flex h-full flex-col divide-y divide-gray-200 bg-slate-50">
      <div className="flex items-center gap-1 bg-slate-100 px-2 py-4">
        <IconMessageChatbot size={24} />
        <span>チャットボット</span>
        <div className="ml-4">
          <Tooltip
            label="チャットボットと会話することで、自動で日報を作成することができます。また、チャットボットはあなたの日報を分析し、あなたの気分を分析します。分析した結果をもとに部署の上長に報告することもできます。"
            position="bottom"
            withArrow
            multiline
            width={300}
          >
            <div className="bg-base flex items-center justify-center rounded-full">
              <IconQuestionMark
                size="1.25rem"
                className="rounded-full bg-slate-500 text-white"
              />
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="flex-grow overflow-auto px-4 py-4">
        <ChatList chat={MOCK_CHAT} />
      </div>
      <div className="bg-slate-100 px-4 py-6">
        <ChatInput
          value={inputValue}
          transcript={transcript}
          onChange={setInputValue}
          onClickRecordButton={toggleRecording}
          recording={recording}
          onSend={() => void onSend()}
        />
      </div>
    </div>
  );
};
