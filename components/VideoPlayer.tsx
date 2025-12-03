import React, { useState, useEffect, useRef } from 'react';
import { ScriptSegment } from '../types';
import { Play, Pause, RotateCcw, VolumeX, Clock, Search, AlertTriangle, CheckCircle, XCircle, FileText, Monitor, User, Bot, Zap, HelpCircle } from 'lucide-react';

interface VideoPlayerProps {
  script: ScriptSegment[];
  onComplete: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ script, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100 for current segment
  
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Reset when script changes
  useEffect(() => {
    setCurrentSegmentIndex(0);
    setIsPlaying(false);
    setProgress(0);
    pausedTimeRef.current = 0;
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
  }, [script]);

  // Main Playback Loop
  useEffect(() => {
    if (isPlaying) {
      const segment = script[currentSegmentIndex];
      const durationMs = segment.duration * 1000;
      
      // Set start time (accounting for pause state)
      startTimeRef.current = performance.now() - pausedTimeRef.current;

      const animate = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;
        
        // Calculate progress for current segment
        const segProgress = Math.min((elapsed / durationMs) * 100, 100);
        setProgress(segProgress);
        pausedTimeRef.current = elapsed;

        if (elapsed < durationMs) {
          timerRef.current = requestAnimationFrame(animate);
        } else {
          // Segment Complete
          if (currentSegmentIndex < script.length - 1) {
            setCurrentSegmentIndex(prev => prev + 1);
            pausedTimeRef.current = 0;
            startTimeRef.current = null;
            setProgress(0);
            // Auto-continue to next frame
            timerRef.current = requestAnimationFrame(animate); 
          } else {
            // Video Complete
            setIsPlaying(false);
            pausedTimeRef.current = 0;
            onComplete();
          }
        }
      };

      timerRef.current = requestAnimationFrame(animate);
    } else {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isPlaying, currentSegmentIndex, script, onComplete]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentSegmentIndex(0);
    setProgress(0);
    pausedTimeRef.current = 0;
    setTimeout(() => setIsPlaying(true), 100);
  };

  const currentSegment = script[currentSegmentIndex];

  // --- Visual Renderers (Webtoon Style) ---

  // Reusable Components
  const SpeechBubble = ({ text, position = "top-left", color = "bg-white" }: { text: string, position?: string, color?: string }) => (
      <div className={`absolute ${position === 'top-left' ? 'top-8 left-8' : position === 'top-right' ? 'top-8 right-8' : 'bottom-32 left-1/2 -translate-x-1/2'} z-20 animate-pop-in max-w-[80%]`}>
          <div className={`${color} border-4 border-black px-6 py-4 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative`}>
              <p className="font-black text-xl text-black font-sans leading-tight">{text}</p>
              {/* Tail */}
              <div className={`absolute w-6 h-6 ${color} border-r-4 border-b-4 border-black rotate-45 -bottom-3 left-8`}></div>
          </div>
      </div>
  );

  const Character = ({ mood = "normal", isRobot = false }) => (
      <div className={`flex flex-col items-center transform transition-all duration-500 ${mood === 'stressed' ? 'animate-shake' : 'animate-bounce-gentle'}`}>
          {/* Head */}
          <div className="relative">
              <div className={`w-24 h-24 ${isRobot ? 'bg-cyan-400' : 'bg-orange-100'} border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] z-10 relative`}>
                  {isRobot ? (
                      <Bot size={50} className="text-white" />
                  ) : (
                      <User size={50} className="text-gray-800" />
                  )}
                  {/* Sweat drops for stressed mood */}
                  {mood === 'stressed' && (
                      <>
                        <div className="absolute -right-2 top-0 text-blue-400 font-bold text-xl animate-ping">💧</div>
                        <div className="absolute -left-2 top-4 text-blue-400 font-bold text-xl animate-pulse">💧</div>
                      </>
                  )}
                  {/* Shock marks */}
                  {mood === 'shocked' && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-600 font-black text-4xl animate-bounce">
                          !!!
                      </div>
                  )}
              </div>
              {/* Body */}
              <div className={`w-20 h-16 ${isRobot ? 'bg-gray-300' : 'bg-blue-600'} border-4 border-black rounded-b-xl mx-auto -mt-2`}></div>
          </div>
      </div>
  );

  const WebtoonBackground = ({ type = "dots" }) => (
      <div className="absolute inset-0 bg-white z-0 overflow-hidden">
          {type === 'dots' && (
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:20px_20px]"></div>
          )}
          {type === 'speed' && (
             <div className="absolute inset-0 bg-[repeating-conic-gradient(from_0deg_at_50%_50%,_#fff_0deg_10deg,_#eee_10deg_20deg)] opacity-50 animate-pulse"></div>
          )}
          {type === 'danger' && (
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#ffe4e6_0px,#ffe4e6_20px,#fff_20px,#fff_40px)]"></div>
          )}
      </div>
  );

  const renderVisuals = (segment: ScriptSegment) => {
    // 1. Intro Scene: Deadline Stress
    if (segment.visualType === 'scene' && segment.section === 'intro') {
       return (
         <div className="flex flex-col items-center justify-center h-full relative overflow-hidden pb-20">
             <WebtoonBackground type="speed" />
             
             <div className="z-10 flex items-center gap-12">
                 <div className="flex flex-col items-center">
                    <Character mood="stressed" />
                    <div className="mt-4 bg-white border-2 border-black px-4 py-1 font-bold rounded-full">김대리 (3년차)</div>
                 </div>

                 {/* Giant Clock */}
                 <div className="relative animate-pulse">
                     <Clock size={120} className="text-red-600" strokeWidth={3} />
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-2xl text-red-600 bg-white px-2 border border-red-600">
                         D-Day
                     </div>
                 </div>
             </div>

             <SpeechBubble text="헉... 1시간도 안 남았어!!" position="top-right" />
         </div>
       );
    }

    // 2. Chat UI: Asking the AI
    if (segment.visualType === 'ui-chat') {
        return (
            <div className="flex flex-col items-center justify-center h-full relative overflow-hidden pb-20">
                <WebtoonBackground type="dots" />
                
                <div className="z-10 flex items-end gap-4 w-full max-w-2xl px-8">
                     {/* User Typing */}
                    <div className="flex flex-col items-center">
                        <Character mood="normal" />
                        <div className="w-32 h-2 bg-black rounded-full mt-2 shadow-lg"></div> {/* Desk */}
                        <Monitor className="absolute -bottom-8 text-gray-800" size={64} />
                    </div>

                    {/* AI Appearing */}
                    <div className="flex-grow"></div>
                    
                    <div className="flex flex-col items-center animate-slide-up">
                        <Character isRobot={true} />
                        <div className="mt-2 bg-cyan-100 border-2 border-black px-4 py-2 rounded-xl text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            "무엇이든 물어보세요!"
                        </div>
                    </div>
                </div>

                <div className="absolute top-10 w-full px-10">
                    <div className="bg-gray-100 border-2 border-gray-300 p-4 rounded-lg font-mono text-sm text-gray-500 shadow-inner">
                        > 프롬프트 입력: 2024년 소비자 트렌드와 시장 규모 알려줘...<span className="animate-pulse">_</span>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Quiz: Something is wrong
    if (segment.visualType === 'quiz') {
         return (
            <div className="flex flex-col items-center justify-center h-full relative overflow-hidden pb-20">
                <WebtoonBackground type="danger" />
                
                <div className="z-10 flex flex-col items-center">
                     <div className="relative">
                        <Character mood="shocked" />
                        <div className="absolute -top-10 -right-10 transform rotate-12">
                             <HelpCircle size={80} className="text-red-500 fill-white" strokeWidth={3} />
                        </div>
                     </div>
                     
                     <div className="mt-8 bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_#facc15] max-w-lg text-center transform -rotate-1">
                         <h2 className="text-3xl font-black text-black mb-2">잠깐! 멈춰!</h2>
                         <p className="text-xl font-bold text-gray-700">이 문장에서 <span className="text-red-600 underline decoration-wavy">이상한 점</span>을 찾아라!</p>
                     </div>
                </div>
            </div>
         );
    }

    // 4. Comparison: Truth vs Hallucination
    if (segment.visualType === 'comparison') {
        return (
            <div className="flex h-full relative pb-20 bg-gray-50">
                <div className="absolute left-1/2 top-0 bottom-20 w-1 bg-black z-0 dashed-line"></div>
                
                {/* Left: Truth */}
                <div className="w-1/2 flex flex-col items-center justify-center p-4 z-10 border-r border-dashed border-gray-400">
                     <FileText size={48} className="text-gray-400 mb-4" />
                     <div className="bg-white border-2 border-black p-4 rounded-lg shadow-sm text-center">
                         <p className="text-gray-500 font-bold text-sm">실제 원본 보고서</p>
                         <p className="text-5xl font-black text-gray-300 mt-2">12%</p>
                     </div>
                     <div className="mt-8 opacity-50 grayscale">
                         <Character mood="normal" />
                     </div>
                </div>

                {/* Right: Hallucination */}
                <div className="w-1/2 flex flex-col items-center justify-center p-4 z-10 bg-yellow-50">
                     <Zap size={48} className="text-yellow-500 mb-4 animate-pulse" />
                     <div className="bg-white border-4 border-red-500 p-4 rounded-lg shadow-[8px_8px_0px_0px_rgba(239,68,68,0.2)] text-center transform scale-110">
                         <p className="text-red-500 font-bold text-sm">AI의 거짓말</p>
                         <p className="text-6xl font-black text-red-600 mt-2 animate-bounce">{segment.highlight || "27%"}</p>
                     </div>
                     <div className="mt-8">
                         <Character isRobot={true} mood="stressed" />
                         <p className="text-xs text-center font-bold mt-2 text-gray-500">"그럴듯하죠?"</p>
                     </div>
                </div>
            </div>
        );
    }

    // 5. Source Error: 404
    if (segment.visualType === 'scene' && segment.section === 'development') {
        return (
            <div className="flex flex-col items-center justify-center h-full relative overflow-hidden pb-20">
                 <WebtoonBackground type="dots" />
                 
                 <div className="z-10 flex items-center gap-8">
                     <div className="flex flex-col items-center">
                         <Character mood="shocked" />
                     </div>

                     <div className="bg-white border-4 border-black rounded-lg p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-xs transform rotate-2">
                        <div className="flex items-center gap-2 border-b-2 border-gray-200 pb-2 mb-4">
                            <Search size={20} />
                            <span className="font-mono text-sm line-through text-gray-400">한국디지털리서치센터</span>
                        </div>
                        <div className="text-center py-4">
                            <XCircle size={60} className="text-red-500 mx-auto mb-2" />
                            <h2 className="text-4xl font-black text-gray-800">404</h2>
                            <p className="font-bold text-gray-600">존재하지 않는 페이지</p>
                        </div>
                     </div>
                 </div>
                 
                 <SpeechBubble text="어라? 검색해도 안 나오네??" position="bottom-center" color="bg-yellow-100" />
            </div>
        );
    }

    // Default: Summary (Success)
    return (
        <div className="h-full relative overflow-hidden flex flex-col justify-center items-center pb-20 px-10 bg-indigo-50">
             <WebtoonBackground type="dots" />

             <div className="z-10 flex items-end gap-8 w-full max-w-4xl">
                 {/* Presenter */}
                 <div className="flex flex-col items-center">
                     <Character mood="normal" />
                     <div className="bg-black text-white px-4 py-1 rounded-full font-bold mt-2 text-sm">Fact Checker</div>
                 </div>

                 {/* Whiteboard */}
                 <div className="flex-grow bg-white border-4 border-black rounded-xl p-8 shadow-[12px_12px_0px_0px_#4f46e5] transform -rotate-1 relative">
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-300 rounded-full border-2 border-black"></div>
                     
                     <h2 className="text-2xl font-black text-indigo-900 mb-6 border-b-4 border-indigo-100 pb-2">
                         📌 핵심 체크 포인트
                     </h2>
                     <div className="space-y-4">
                         <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-black border-2 border-black">1</div>
                             <span className="text-xl font-bold text-gray-800">숫자는 원문 대조 필수</span>
                         </div>
                         <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-black border-2 border-black">2</div>
                             <span className="text-xl font-bold text-gray-800">출처 링크 직접 클릭</span>
                         </div>
                         <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-full bg-yellow-400 text-black flex items-center justify-center font-black border-2 border-black">3</div>
                             <span className="text-xl font-bold text-gray-800">AI는 '창작' 기계다</span>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full bg-black rounded-lg overflow-hidden shadow-2xl font-sans">
      {/* Viewport */}
      <div className="relative flex-grow bg-white aspect-video overflow-hidden border-b border-gray-800">
        {renderVisuals(currentSegment)}
        
        {/* Subtitles Overlay - Comic Style Box */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-50 px-4">
            <div className="bg-black/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-xl text-center max-w-4xl border-l-4 border-yellow-400">
                <p className="text-lg md:text-xl font-medium leading-relaxed font-sans">
                    {currentSegment.narration}
                </p>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-16 bg-gray-900 flex items-center px-4 space-x-4 border-t border-gray-800 z-50 relative">
        <button 
          onClick={handlePlayPause}
          className="text-white hover:text-yellow-400 transition p-2 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button 
          onClick={handleRestart}
          className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-800 rounded-full"
        >
          <RotateCcw size={20} />
        </button>

        {/* Global Progress Bar */}
        <div className="flex-grow mx-4 relative h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
             {/* Completed segments */}
             <div 
               className="absolute top-0 left-0 h-full bg-yellow-500 transition-all duration-300"
               style={{ width: `${(currentSegmentIndex / script.length) * 100}%` }}
             ></div>
             {/* Current segment progress */}
             <div 
               className="absolute top-0 left-0 h-full bg-yellow-200 opacity-50 transition-all duration-75"
               style={{ 
                   left: `${(currentSegmentIndex / script.length) * 100}%`,
                   width: `${(progress / 100) * (100 / script.length)}%` 
               }}
             ></div>
        </div>

        <div className="text-xs text-gray-400 font-mono w-20 text-right">
             {Math.floor(((currentSegmentIndex + (progress/100)) / script.length) * 100)}%
        </div>

        <div className="flex items-center text-gray-500 text-xs gap-1">
             <VolumeX size={16} />
             <span>Subtitles Only</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;