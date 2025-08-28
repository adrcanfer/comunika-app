import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.adrcanfer.comunika',
  appName: 'ComuniKa',
  webDir: 'www',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    Media: {
      androidGalleryMode: true
    },
    EdgeToEdge: {
      backgroundColor: "#1C418C"
    }
  }
};

export default config;
