module.exports = {
  apps: [
    {
      name: 'TypeScript',
      script: 'yarn watch',
      ignore_watch: ['.'],
      env: { NODE_ENV: process.env.NODE_ENV ?? 'development' },
    },
    {
      name: 'Remix',
      script: 'remix watch',
      ignore_watch: ['.'],
      env: {
        NODE_ENV: process.env.NODE_ENV ?? 'development',
      },
    },
    {
      name: 'Server',
      script: 'node --inspect dist/main.js',
      watch: ['dist'],
      env: { NODE_ENV: process.env.NODE_ENV },
    },
  ],
};
