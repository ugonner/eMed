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
      launchShowDuration: 5000,
      backgroundColor: "#fffffffff",
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      
    }
  }
};

export default config;
