
export default function Home() {
  const widgetUrl = `https://github.com/niiicolai/widget-ping-pong-game/#/ping-pong`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Ping Pong Game Widget
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        An interactive ping-pong game built with React and Canvas API. Perfect for embedding in websites as a fun, engaging widget.
      </p>
      <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <div>Start Date: 29/01/2025</div>
        <div>Last Update: 29/01/2025</div>
      </div>

      <a
        href="https://github.com/niiicolai/widget-ping-pong-game"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors mb-3 inline-block"
      >
        GitHub Repository
      </a>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Demo
        </h2>
        <iframe src={widgetUrl} width="100%" height="580px" className="rounded-xl border border-gray-300 dark:border-gray-600"></iframe>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Features
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Single player mode with AI opponent (Easy/Medium/Hard difficulty)</li>
          <li>Local multiplayer mode for two players</li>
          <li>Responsive design that adapts to different screen sizes</li>
          <li>Touch and mouse controls for mobile devices</li>
          <li>Keyboard controls (W/S for Player 1, Arrow keys for Player 2)</li>
          <li>Smooth animations and physics-based gameplay</li>
          <li>Score tracking and game state management</li>
          <li>Dark/light theme support</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Controls
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Player 1 (Blue)</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">W</kbd> - Move up</li>
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">S</kbd> - Move down</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Player 2 (Red)</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd> - Move up</li>
              <li><kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd> - Move down</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <strong>Mobile:</strong> Touch and drag on the left/right side of the canvas to control paddles
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Setup
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Add this iframe to your website:
        </p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
          {`<iframe 
  src="https://niiicolai.github.io/widget-ping-pong-game/#/ping-pong" 
  height="580px"
  width="100%"
  frameborder="0"
  scrolling="no">
</iframe>`}
        </pre>
        
        <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Optional Parameters</h3>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          You can customize the game experience with URL parameters:
        </p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
          {`<iframe 
  src="https://niiicolai.github.io/widget-ping-pong-game/#/ping-pong?mode=single&difficulty=medium" 
  height="580px"
  width="100%">
</iframe>`}
        </pre>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">mode</code>
            <span className="text-sm text-gray-600 dark:text-gray-400">- "single" or "multiplayer" (default: "single")</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">difficulty</code>
            <span className="text-sm text-gray-600 dark:text-gray-400">- "easy", "medium", or "hard" (default: "medium")</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Technical Details
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Technologies Used</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>React 19 with TypeScript</li>
              <li>HTML5 Canvas API</li>
              <li>Tailwind CSS for styling</li>
              <li>Vite for build tooling</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>60 FPS gameplay with requestAnimationFrame</li>
              <li>Optimized collision detection</li>
              <li>Responsive canvas sizing</li>
              <li>Minimal bundle size (~50KB gzipped)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8 p-4 border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <p className="text-blue-800 dark:text-blue-200 font-medium">
          💡 Tip: For the best loading speed and reliability, I highly recommend self-hosting this widget on your own domain or infrastructure.
        </p>
        <p className="mt-2 text-blue-700 dark:text-blue-300 text-sm">
          You can easily fork the project and deploy it yourself using GitHub Pages or a similar service.
          <a
            href="https://github.com/niiicolai/widget-ping-pong-game/fork"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold ml-1"
          >
            Fork the project here.
          </a>
        </p>
      </section>
    </div>
  );
}
