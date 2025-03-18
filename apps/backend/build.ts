import { OptionalDepsPlugin } from 'bun-plugin-optional-deps';

export {};

try {
  console.log('Starting build process...');

  // Delete dist directory before building
  try {
    console.log('Cleaning dist directory...');
    // Fix: Use Bun.spawn correctly to remove the dist directory
    const rmProcess = Bun.spawn(['rm', '-rf', './dist']);
    await rmProcess.exited;
    console.log('Dist directory cleaned successfully.');
  } catch (cleanError) {
    console.error('Failed to clean dist directory:', cleanError);
  }

  const result = await Bun.build({
    entrypoints: ['./src/main.ts'],
    format: 'esm',
    outdir: './dist',
    sourcemap: 'linked',
    target: 'node',
    plugins: [OptionalDepsPlugin],
    minify: {
      identifiers: false,
      syntax: true,
      whitespace: true,
    },
    packages: 'bundle',
    external: [
      '@nestjs/microservices',
      '@nestjs/websockets/socket-module',
      'perf_hooks',
      'repl',
      'class-transformer',
      'class-validator',
      'cache-manager',
      '@nestjs/schedule',
      '@nestjs/websockets',
      '@nestjs/microservices',
      '@nestjs/platform-express',
      'async_hooks',
    ],
  });

  if (!result.success) {
    console.error('Build failed with errors:');
    for (const message of result.logs) {
      console.error(message);
    }
    process.exit(1);
  }

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build process failed with an exception:');
  console.error(error);
  process.exit(1);
}
