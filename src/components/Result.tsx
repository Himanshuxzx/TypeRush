import Graph from "./Graph";

const Result = ({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  extraChars,
  missedChars,
  graphData,
  testTime
}: {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  missedChars: number;
  graphData: number[][];
  testTime: number;
}) => {
  let timeSet = new Set();
  const newgraphData = graphData.filter((i) => {
    if (!timeSet.has(i[0])) {
      timeSet.add(i[0]);
      return true;
    }
  });
  const filteredGraphData = newgraphData;

  const getPerformanceRating = () => {
    if (wpm >= 80) return { text: "Elite", color: "text-yellow-400" };
    if (wpm >= 60) return { text: "Advanced", color: "text-purple-400" };
    if (wpm >= 40) return { text: "Intermediate", color: "text-blue-400" };
    if (wpm >= 20) return { text: "Beginner", color: "text-green-400" };
    return { text: "Novice", color: "text-gray-400" };
  };

  const rating = getPerformanceRating();

  return (
    <div className="glass-effect rounded-2xl p-6 max-w-4xl mx-auto shadow-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Results</h2>
        <p className={`text-base font-semibold ${rating.color}`}>
          {rating.text} Typist
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-pink-400 mb-1">{wpm}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">WPM</div>
        </div>
        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-cyan-400 mb-1">{accuracy}%</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Accuracy</div>
        </div>
        <div className="glass-effect rounded-xl p-4 text-center">
          <div className="text-3xl font-black text-purple-400 mb-1">{testTime}s</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Time</div>
        </div>
      </div>

      {/* Graph */}
      <div className="mb-6">
        <Graph graphData={filteredGraphData} />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="glass-effect rounded-lg p-3">
          <div className="text-2xl font-bold text-emerald-400">{correctChars}</div>
          <div className="text-xs text-gray-400 uppercase">Correct</div>
        </div>
        <div className="glass-effect rounded-lg p-3">
          <div className="text-2xl font-bold text-red-400">{incorrectChars}</div>
          <div className="text-xs text-gray-400 uppercase">Errors</div>
        </div>
        <div className="glass-effect rounded-lg p-3">
          <div className="text-2xl font-bold text-orange-400">{extraChars}</div>
          <div className="text-xs text-gray-400 uppercase">Extra</div>
        </div>
        <div className="glass-effect rounded-lg p-3">
          <div className="text-2xl font-bold text-amber-400">{missedChars}</div>
          <div className="text-xs text-gray-400 uppercase">Missed</div>
        </div>
      </div>
    </div>
  );
};

export default Result;
