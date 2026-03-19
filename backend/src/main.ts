import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// CORS – allow all origins listed in FRONTEND_URL (comma-separated) or localhost for dev
	const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
		.split(',')
		.map((o) => o.trim())
		.filter(Boolean);
	app.enableCors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error(`CORS: origin ${origin} not allowed`));
			}
		},
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	});

	// Global validation
	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
	);

	// Basic uptime endpoints so hitting the API root doesn't return 404
	const server = app.getHttpAdapter().getInstance();
	server.get('/', (_req, res) => {
		res.status(200).json({
			service: 'nanaska-backend',
			status: 'ok',
			docsHint: 'Use /auth, /courses, /orders, /payments',
		});
	});
	server.get('/health', (_req, res) => {
		res.status(200).json({ status: 'ok' });
	});

	const port = process.env.PORT || 3001;
	await app.listen(port);
	console.log(`Backend running on http://localhost:${port}`);
}

bootstrap();
