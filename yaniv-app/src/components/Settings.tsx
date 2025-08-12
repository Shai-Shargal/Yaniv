import { useGameStore } from "../store";

const Settings = () => {
  const { settings, updateSettings } = useGameStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure game options
        </p>
      </div>

      <div className="card p-6 max-w-md mx-auto space-y-6">
        {/* Asaf on Tie Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Asaf on Tie</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Allow Asaf when someone ties with the caller
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.asafOnTie}
              onChange={(e) => updateSettings({ asafOnTie: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
          </label>
        </div>

        {/* RTL Support */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Right-to-Left (RTL)</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Support for Hebrew and other RTL languages
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.rtl}
              onChange={(e) => updateSettings({ rtl: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
          </label>
        </div>

        {/* Game Rules Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-semibold mb-3">Game Rules</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <div>
              • <strong>Yaniv:</strong> Call when you think you have the lowest
              sum
            </div>
            <div>
              • <strong>Asaf:</strong> If someone has a lower sum, caller gets
              +30 penalty
            </div>
            <div>
              • <strong>Milestones:</strong> Exact 50 or 100 resets your total
              to 0
            </div>
            <div>
              • <strong>Elimination:</strong> Total &gt; 100 eliminates you from
              the game
            </div>
            <div>
              • <strong>Winner:</strong> Last player remaining wins!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
