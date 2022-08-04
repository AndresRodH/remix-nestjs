import path from 'path';
import { All, Controller, Next, Req, Res } from '@nestjs/common';
import type { GetLoadContextFunction } from '@remix-run/express';
import { createRequestHandler } from '@remix-run/express';
import type { DataFunctionArgs } from '@remix-run/node';
import type {
  NextFunction,
  Request,
  Response,
} from 'express-serve-static-core';
import { AppService } from 'src/app.service';

const BUILD_DIR = path.join(process.cwd(), 'build');

interface LoadContext {
  appService: AppService;
}

declare module '@remix-run/server-runtime' {
  export interface LoaderArgs extends DataFunctionArgs {
    context: LoadContext;
  }

  export interface ActionArgs extends DataFunctionArgs {
    context: LoadContext;
  }
}

@Controller('/')
export class RemixController {
  constructor(private readonly appService: AppService) {}

  @All('*')
  handler(
    @Req() request: Request,
    @Res() response: Response,
    @Next() next: NextFunction,
  ) {
    if (this.isStaticAsset(request)) return next();
    this.purgeRequireCacheInDev();

    const getLoadContext: GetLoadContextFunction = (req) => {
      // return your context here
      return {
        appService: this.appService,
      };
    };

    return createRequestHandler({
      // `remix build` and `remix dev` output files to a build directory, you need
      // to pass that build to the request handler
      build: require(BUILD_DIR),

      // return anything you want here to be available as `context` in your
      // loaders and actions. This is where you can bridge the gap between Remix
      // and your server
      getLoadContext,
    })(request, response, next);
  }

  private purgeRequireCacheInDev() {
    if (process.env.NODE_ENV === 'production') return;

    for (const key in require.cache) {
      if (key.startsWith(BUILD_DIR)) {
        delete require.cache[key];
      }
    }
  }

  private isStaticAsset(request: Request) {
    return /^\/(build|assets)\//gi.test(request.url);
  }
}
