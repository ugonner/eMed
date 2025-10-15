import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.ableaid.app",
  appName: 'AbleAid',
  webDir: 'dist',
  server: {
    allowNavigation: [
      "ableaid.vercel.app"
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
      backgroundColor: "#fffffffff",
      showSpinner: false,
      androidScaleType: 'CENTER_CROP'
    }
  }
};

export default config;
