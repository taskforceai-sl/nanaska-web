module.exports = {
	apps: [
		{
			name: 'nanaska-backend',
			cwd: '/var/www/nanaska-web/backend',
			script: 'dist/src/main.js',
			instances: 1,
			exec_mode: 'fork',
			autorestart: true,
			max_memory_restart: '300M',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
