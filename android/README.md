# Varindo Trusted Web Activity

Android wrapper for `https://varindo.co.id/` using package ID
`co.varindo.catalog`. This preserves the identity and signing relationship of
the earlier Varindo Android build.

## Requirements

- JDK 17
- Android SDK Platform 36
- Android SDK Build Tools 36.x

## Build

Create an unsigned release bundle with `./gradlew bundleRelease`.

For a Play-uploadable signed bundle, provide signing values in your user-level
`~/.gradle/gradle.properties` (never commit them):

```properties
VARINDO_UPLOAD_KEYSTORE=/absolute/path/to/varindo-release.jks
VARINDO_UPLOAD_STORE_PASSWORD=...
VARINDO_UPLOAD_KEY_ALIAS=varindo
VARINDO_UPLOAD_KEY_PASSWORD=...
```

Then run `./gradlew bundleRelease`. The output is
`app/build/outputs/bundle/release/app-release.aab`.

## Digital Asset Links

The site publishes the existing upload-certificate fingerprint at
`https://varindo.co.id/.well-known/assetlinks.json`. After Play App Signing is
enabled, add the **App signing key certificate** SHA-256 fingerprint from Play
Console to both website asset-links sources. Keep the current fingerprint too,
so locally installed/release-key builds continue to verify.
