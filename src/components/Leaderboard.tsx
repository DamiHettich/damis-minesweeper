import React from 'react';
import { ScoreEntry } from '../types/game';
import { Difficulty } from '../utils/gameConfig';

interface LeaderboardProps {
  scores: ScoreEntry[];
  currentDifficulty: Difficulty;
  onNameSubmit: (name: string) => void;
  playerName: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  scores, 
  currentDifficulty, 
  onNameSubmit,
  playerName 
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempName, setTempName] = React.useState(playerName);

  const filteredScores = scores
    .filter(score => score.difficulty === currentDifficulty)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNameSubmit(tempName);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-green-900/30 w-[440px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Top Scores
          </h2>
          {playerName && (
            <p className="text-sm text-green-400 mt-1">
              Playing as: <span className="font-mono">{playerName}</span>
            </p>
          )}
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all border border-green-900/50 text-green-400 whitespace-nowrap"
          >
            {playerName ? 'Change Name' : 'Set Name'}
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="bg-gray-800 border border-green-900 text-green-400 px-2 py-1 rounded-lg text-sm focus:outline-none focus:border-green-500 w-32"
              placeholder="Enter your name"
              maxLength={15}
            />
            <button
              type="submit"
              className="text-sm bg-green-900/50 hover:bg-green-800/50 px-3 py-1 rounded-lg transition-all border border-green-900 text-green-400"
            >
              Save
            </button>
          </form>
        )}
      </div>

      <div className="space-y-2">
        {filteredScores.map((entry, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-2 rounded-lg ${
              entry.name === playerName
                ? 'bg-green-900/30 border border-green-900/50'
                : 'bg-black/30'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-green-400 font-mono w-6">{index + 1}.</span>
              <span className="text-green-300">
                {entry.name || 'Anonymous'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-blue-400 font-mono">
                {entry.score}
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {filteredScores.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No scores yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 