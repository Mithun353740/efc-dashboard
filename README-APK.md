# Quantum Vortex FC - Android APK Guide

This project has been fully configured with **Capacitor**. 
Currently, it is set up as a **Live Wrapper** — meaning the Android app will automatically mirror your live Vercel website in real-time (`https://quantumvortexfc.vercel.app`), instantly reflecting any updates you make here without needing to rebuild the APK (as long as the app has network access).

## How to Build the APK
The AI Studio cloud environment does not contain the massive Android SDK/Java toolchain required to compile raw `.apk` files directly in the browser terminal. 

However, your project is now **100% Android-ready**. To generate your `release-apk` file:

### Option A: Local Android Studio (Recommended)
1. Export this project (via GitHub or ZIP).
2. Install [Android Studio](https://developer.android.com/studio).
3. Open a terminal in the project root and run:
   ```bash
   npm i
   npm run build
   npx cap sync
   npx cap open android
   ```
4. In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. The APK will be instantly generated for your device!

### Disclaimer: Reverting
If this live URL method ever gives you a blank screen or gets rejected from Play Store natively, just open `capacitor.config.ts`, delete the `server: { url: ... }` block completely, run `npx cap sync`, and the app will go back to being a fully offline, baked-in app.
