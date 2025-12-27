const Footer = () => {
  return (
    <footer className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="glass-effect rounded-xl px-6 py-3">
            <p className="text-sm text-cyan-300 font-medium">
              <span className="text-lg mr-2">⌨️</span>
              Press <kbd className="bg-gray-700 px-2 py-1 rounded text-xs font-mono text-pink-400">Tab</kbd> to restart
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TypeRush
            </p>
            <p className="text-gray-600 text-xs">
              Built with precision by Himanshu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
