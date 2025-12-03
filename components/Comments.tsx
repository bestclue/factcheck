import React, { useState } from 'react';
import { Comment } from '../types';
import { validateUserAnswer } from '../services/genai';
import { Send, Medal, User, Loader2 } from 'lucide-react';

interface CommentsProps {
  onBadgeEarned: () => void;
}

const Comments: React.FC<CommentsProps> = ({ onBadgeEarned }) => {
  const [input, setInput] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: '김대리',
      avatar: 'https://picsum.photos/seed/user1/50/50',
      content: '27%요! 실제 보고서는 12%였어요.',
      timestamp: '방금 전',
      isCorrect: true
    },
    {
      id: '2',
      user: '이팀장',
      avatar: 'https://picsum.photos/seed/user2/50/50',
      content: '오... 무심코 썼으면 큰일날 뻔 했네요. 한국디지털리서치센터도 없는 곳인가요?',
      timestamp: '10분 전',
      isCorrect: false
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API delay + GenAI validation
    const isCorrect = await validateUserAnswer(input);

    const newComment: Comment = {
      id: Date.now().toString(),
      user: '나 (Guest)',
      avatar: 'https://picsum.photos/seed/me/50/50',
      content: input,
      timestamp: '방금 전',
      isCorrect: isCorrect
    };

    setComments([newComment, ...comments]);
    setInput('');
    setIsSubmitting(false);

    if (isCorrect) {
      onBadgeEarned();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">미니 챌린지 댓글</h3>
        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">선착순 10명 배지!</span>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className={`flex space-x-3 ${comment.isCorrect ? 'bg-indigo-50 p-2 rounded-lg' : ''}`}>
            <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full border border-gray-200" />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-gray-800">{comment.user}</span>
                <span className="text-xs text-gray-400">{comment.timestamp}</span>
                {comment.isCorrect && (
                   <span className="flex items-center text-xs text-indigo-600 font-bold border border-indigo-200 px-1 rounded">
                      <Medal size={10} className="mr-1" /> 환각사냥꾼
                   </span>
                )}
              </div>
              <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="정답(틀린 숫자)을 입력하세요..."
          className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default Comments;
