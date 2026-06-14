import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.contributions.manager',
  appName: 'Contributions Manager',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#047857',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#047857',
    }
  }
};

export default config;
