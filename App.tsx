import React, { useState } from 'react';
import { LEARNING_SCRIPT, SLACK_PROMO_TEXT } from './constants';
import { TabState } from './types';
import VideoPlayer from './components/VideoPlayer';
import Comments from './components/Comments';
import { BookOpen, MessageSquare, Info, Layout, CheckCircle, Trophy, Copy } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabState>(TabState.OVERVIEW);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [showBadgePopup, setShowBadgePopup] = useState(false);
  const [badgeCount, setBadgeCount] = useState(8); // Start with some badges taken

  const handleBadgeEarned = () => {
    setShowBadgePopup(true);
    setBadgeCount(prev => Math.min(prev + 1, 10));
    setTimeout(() => {
        setShowBadgePopup(false);
    }, 4000);
  };

  const handleCopyPromo = () => {
    navigator.clipboard.writeText(SLACK_PROMO_TEXT);
    alert("슬랙 공지 문구가 복사되었습니다!");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Badge Popup */}
      {showBadgePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-yellow-400 animate-bounce-in flex flex-col items-center pointer-events-auto max-w-sm mx-4">
             <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <Trophy size={48} className="text-yellow-600" />
             </div>
             <h2 className="text-2xl font-black text-gray-800 mb-2">환각 사냥꾼!</h2>
             <p className="text-center text-gray-600 mb-6">
                축하합니다! AI의 거짓 정보를 정확히 찾아내셨군요.
                <br/><span className="font-bold text-indigo-600">배지가 지급되었습니다.</span>
             </p>
             <button 
                onClick={() => setShowBadgePopup(false)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition"
             >
                확인
             </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <Layout size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">FactCheck AI</h1>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded ml-2">Micro-learning</span>
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex text-sm text-gray-500">
                <span className="mr-4">김직장 님</span>
                <span>개발팀</span>
             </div>
             <img src="https://picsum.photos/seed/user/40/40" alt="Profile" className="w-8 h-8 rounded-full bg-gray-300" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player & Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Player Container */}
            <div className="bg-black rounded-xl shadow-lg aspect-video overflow-hidden ring-1 ring-black/5 relative group">
                <VideoPlayer 
                    script={LEARNING_SCRIPT} 
                    onComplete={() => setCourseCompleted(true)} 
                />
            </div>

            {/* Title & Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            AI 환각(Hallucination) 긴급 점검: 제안서 편
                        </h1>
                        <p className="text-gray-500 text-sm">
                            생성형 AI를 업무에 사용할 때 반드시 체크해야 할 3가지 포인트를 3분 안에 학습합니다.
                        </p>
                    </div>
                    {courseCompleted && (
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center text-sm font-bold">
                            <CheckCircle size={16} className="mr-1" /> 학습 완료
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[300px]">
                 <div className="border-b border-gray-200 flex">
                    <button 
                        onClick={() => setActiveTab(TabState.OVERVIEW)}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition ${activeTab === TabState.OVERVIEW ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <span className="flex items-center"><BookOpen size={16} className="mr-2"/> 강의 소개</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab(TabState.RESOURCES)}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition ${activeTab === TabState.RESOURCES ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                         <span className="flex items-center"><Info size={16} className="mr-2"/> 홍보 자료 (Slack)</span>
                    </button>
                 </div>

                 <div className="p-6">
                    {activeTab === TabState.OVERVIEW && (
                        <div className="prose prose-sm max-w-none text-gray-600">
                            <h3 className="text-gray-900 font-bold mb-3">학습 목표</h3>
                            <ul className="list-disc pl-5 space-y-2 mb-6">
                                <li>생성형 AI가 숫자를 만들어내는 '환각' 현상을 이해한다.</li>
                                <li>실존하지 않는 출처를 구분하는 방법을 배운다.</li>
                                <li>제안서 작성 시 필수 검증 프로세스를 익힌다.</li>
                            </ul>
                            <h3 className="text-gray-900 font-bold mb-3">강사</h3>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">AI</div>
                                <div>
                                    <p className="font-semibold text-gray-800">Gemini Instructor</p>
                                    <p className="text-xs text-gray-500">Virtual Learning Specialist</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === TabState.RESOURCES && (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
                             <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                <MessageSquare size={18} className="mr-2 text-pink-500" />
                                사내 메신저(Slack) 홍보용 텍스트
                             </h3>
                             <pre className="bg-white p-4 rounded border border-gray-200 text-sm text-gray-600 whitespace-pre-wrap font-mono mb-4">
                                {SLACK_PROMO_TEXT}
                             </pre>
                             <button 
                                onClick={handleCopyPromo}
                                className="flex items-center justify-center w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition"
                             >
                                <Copy size={16} className="mr-2" /> 텍스트 복사하기
                             </button>
                        </div>
                    )}
                 </div>
            </div>

          </div>

          {/* Right Column: Interaction */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                
                {/* Challenge Status Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">🔥 환각 사냥꾼 챌린지</h2>
                            <Trophy className="text-yellow-300" />
                        </div>
                        <p className="text-indigo-100 text-sm mb-4">
                            영상 속 AI가 범한 치명적인 숫자 오류를 찾아 댓글로 남겨주세요!
                        </p>
                        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                            <div className="flex justify-between text-xs mb-1">
                                <span>남은 배지</span>
                                <span className="font-bold text-yellow-300">{10 - badgeCount}개 / 10개</span>
                            </div>
                            <div className="w-full bg-indigo-900/50 rounded-full h-2">
                                <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${(badgeCount / 10) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                </div>

                {/* Comments Component */}
                <div className="h-[600px]">
                    <Comments onBadgeEarned={handleBadgeEarned} />
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
