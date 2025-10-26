import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "app.vercel.flexmedcare",
  appName: 'Flex MedCare',
  webDir: 'dist',
  server: {
    allowNavigation: [
      "flexmedcare.vercel.app"
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
