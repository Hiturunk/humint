// The website's settings. Fill these in; anything left empty is hidden or shows "Coming soon".
window.HUMINT = {
  // GitHub repository as 'owner/name', e.g. 'humint-app/humint'. Turns on the download buttons
  // (from the latest GitHub release), the GitHub links, and the "All releases" link.
  github: 'Hiturunk/humint',

  // Telegram invite link, e.g. 'https://t.me/humint_chat'. Turns on the community links.
  telegram: 'https://t.me/HumIntSpace',

  // The $HUMINT community token (Solana, pump.fun). Empty = the token section and nav link are hidden.
  token: {
    ticker: '$HUMINT',
    ca: 'BmauGLxEDX4MABC3BBBqyM1UjpDP5jMT7qUb2HXZpump',
    url: 'https://pump.fun/coin/BmauGLxEDX4MABC3BBBqyM1UjpDP5jMT7qUb2HXZpump',
  },

  // GoatCounter site code: 'humint' if your dashboard is humint.goatcounter.com.
  // Counts visits and download clicks without cookies. Empty = no analytics at all.
  goatcounter: '',

  // The live Chrome Web Store listing.
  storeUrl: 'https://chromewebstore.google.com/detail/humint-%E2%80%93-survey-autofill/hidkblinalehaadgonnjiopgdmdheejh?authuser=0&hl=en',

  // The app's Microsoft Store page, once it's published there (docs/RELEASE.md → "Windows without
  // the warning"), e.g. 'https://apps.microsoft.com/detail/9XXXXXXXXXXX'. The Windows button then goes to
  // the Store, where Windows doesn't warn, and the .exe stays as a second link.
  msStoreUrl: 'https://apps.microsoft.com/detail/9PPH6FQV6DKN',

  // The name on the .exe's code-signing certificate, once releases are signed (docs/RELEASE.md →
  // "Sign the .exe"), exactly as Windows shows it. It replaces the "isn't code-signed yet" notes.
  signedBy: '',

  // Used until the GitHub release is read (and if it can't be). The page reads the real
  // version, file names and sizes from the latest release, so keep these as a fallback.
  version: '3.9.1',
  appFile: 'Humint-{v}-portable.exe',
  extFile: 'humint-{v}-store.zip', // upload the store package: it leaves out README/CHANGELOG
  appSize: '93 MB',
};
