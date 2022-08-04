import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from './app.service';
import path from 'path';
import { RemixController } from './remix.controller';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const BROWSER_BUILD_DIR = '/build/';

console.log(PUBLIC_DIR);
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_DIR,
      serveRoot: '/',
      serveStaticOptions: {
        setHeaders(res, pathname) {
          const relativePath = pathname.replace(PUBLIC_DIR, '');
          res.setHeader(
            'Cache-Control',
            relativePath.startsWith(BROWSER_BUILD_DIR)
              ? // Remix fingerprints its assets so we can cache forever
                'public, max-age=31536000, immutable'
              : // You may want to be more aggressive with this caching
                'public, max-age=3600',
          );
        },
      },
    }),
  ],
  controllers: [
    // this has to be the last controller to be registered as it will catch all requests
    RemixController,
  ],
  providers: [AppService],
})
export class AppModule {}
