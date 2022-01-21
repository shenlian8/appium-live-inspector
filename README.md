# Appium Live Inspector (appium-live-inspector)

An inspector to debug the Appium tests

## Idea
While debugging the Appium tests, it would be easier when it is possible to inspect the app elements meanwhile.

## How to
The Appium server provides 2 endpoints:
```bash
GET /session/:session_id/source
```
In a native context (iOS, Android, etc...) it will return the application hierarchy XML.
The Appium server provides 2 endpoints:
```bash
GET /session/:session_id/screenshot
```
Takes a screenshot of the viewport in a native context (iOS, Android).

With those 2 endpoints, it is possible to build an UI-tool to inspect the app elements while debugging the Appium tests. The only parameter needs to be provided is the session-id of the running Appium test.
## Troubleshooting
Note that some platforms may have settings that prevent screenshots from being taken, for security reason. One such feature is the Android ```FLAG_SECURE``` layout parameter

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev -m electron
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build -m electron
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
