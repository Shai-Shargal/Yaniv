import { useGameStore } from "../store";

const FooterBar = () => {
  const { players, history } = useGameStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{players.length} players</span>
          <span>{history.length} rounds</span>
        </div>

        <div className="flex items-center space-x-3"></div>
      </div>
    </div>
  );
};

export default FooterBar;
