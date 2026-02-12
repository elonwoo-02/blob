import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elon.dimensionaldebris',
  appName: 'Elog',
  webDir: 'dist',
  server: {
    url: 'https://blob-1yd.pages.dev/',
    cleartext: false
  }
};

export default config;

