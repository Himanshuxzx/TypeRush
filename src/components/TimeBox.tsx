"use client";
import { useTestModeContext } from "../context/TestModeContext";

const TimeBox = ({ countdown }: { countdown: number }) => {
  const { testTime, setTestTime } = useTestModeContext();

  const timeOptions = [30, 60, 90];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 glass-effect rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-white">T</span>
        </div>
        <div>
          {countdown > 0 ? (
            <div>
              <div className="text-3xl font-black text-white">{countdown}</div>
              <div className="text-sm text-gray-400 font-medium">seconds remaining</div>
            </div>
          ) : (
            <div>
              <div className="text-3xl font-black text-red-400 animate-pulse">FINISHED</div>
              <div className="text-sm text-gray-400 font-medium">test complete</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <span className="text-gray-400 font-medium self-center mr-2 hidden sm:block">Duration:</span>
        {timeOptions.map((time) => (
          <button
            key={time}
            onClick={() => setTestTime(time)}
            className={`px-5 py-3 rounded-xl transition-all duration-300 font-bold text-sm
              ${
                testTime === time
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg scale-105"
                  : "glass-effect hover:bg-white/10 text-gray-300 hover:text-white hover:scale-105"
              }`}
          >
            {time}s
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeBox;
