package co.varindo.catalog;

import android.os.Build;
import android.os.Bundle;

public class LauncherActivity extends com.google.androidbrowserhelper.trusted.LauncherActivity {

    // On API 31+, the OS plays its own splash screen before onCreate() runs,
    // then hands off to the activity with a built-in icon shrink/fade-out
    // animation — this plays regardless of how well the splash's colors and
    // icon match the app's own splash, and is only controllable from code
    // (there's no manifest attribute for it). Removing the splash view
    // immediately, with no animation, avoids that hand-off being visible as
    // a flash on open.
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // getSplashScreen() can return null (already removed) or throw on some
            // OEM builds (seen on Samsung One UI) — this is a cosmetic hand-off
            // tweak and must never be able to crash the whole launch.
            try {
                android.window.SplashScreen splashScreen = getSplashScreen();
                if (splashScreen != null) {
                    splashScreen.setOnExitAnimationListener(splashScreenView -> splashScreenView.remove());
                }
            } catch (Throwable t) {
                // Ignore — worst case the default hand-off animation plays.
            }
        }
    }

    // The library suppresses the enter transition when handing off from splash
    // to the Trusted Web Activity, but not the exit transition when this
    // activity finishes after the custom tab closes. Without this, the default
    // cross-fade briefly reveals this activity's paper-colored window between
    // the closing custom tab and the home screen — a visible flash on close.
    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(0, 0);
    }
}