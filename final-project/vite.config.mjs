import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
	const { API_URL } = loadEnv(mode, process.cwd(), 'API_URL');

	return {
		plugins: [
			svgr({ oxcOptions: { jsx: { runtime: 'automatic' } } }),
			react({ plugins: [] }),
		],
		define: {
			__API_URL__: JSON.stringify(
				API_URL || 'https://api.v2.react-learning.ru'
			),
		},
		server: {
			host: '127.0.0.1',
			port: 8080,
			strictPort: true,
		},
	};
});
