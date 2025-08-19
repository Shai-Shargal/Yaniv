import { useGameStore } from "../store";

const Header = () => {
  const { settings, updateSettings, goBack } = useGameStore();

  const toggleSettings = () => {
    // For now, we'll just toggle RTL as a demo
    // In a full implementation, this would open a settings modal
    updateSettings({ rtl: !settings.rtl });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={goBack}
          className="text-left text-2xl font-bold text-primary-600 dark:text-primary-400 hover:opacity-80"
          aria-label="Go back"
        >
          Yaniv Score
        </button>

        <button
          onClick={toggleSettings}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle RTL"
        >
          <span className="text-lg">{settings.rtl ? "LTR" : "RTL"}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
