# Auto-gmeet-launcher

Automatically launch Google Meet as per timetable.

## Usage with pm2

```bash
git clone https://github.com/Aditya-ds-1806/auto-gmeet-launcher.git
cd auto-gmeet-launcher
npm i -g pm2
pm2 start app.js
```

## `cookies.json`

The script also needs a `cookies.json` file to be created in `auto-gmeet-launcher/coookies.json`. This file is used to impersonate your account while using google meet. To generate this file, run:

```bash
node getCookies.js
```

A new browser window will open. You have 40 seconds time to login to google meet with your google account. If you need more time, you can increase the timeout in the 14th line of `getCookies.js`. Once you are done, the `cookies.json` file will be generated.

> **WARNING!!!**: Do not share the `cookies.json` file with anybody. Doing so will allow them to impersonate your account.

## Customise

### `timetable.json`

Modify this file as per your timetable by adding entries to the `courses` array:

```json
{
    "courses": [
        ...,
        {
            "subject": "Math",
            "link": "https://meet.google.com/abc-defg-hij",
            "crons": [
                "00 11 * * 1",
                "00 10 * * 2",
                "00 14 * * 5"
            ],
        },
        ...
    ]
}
```

Each entry in the `crons` array is a cron expression which indicates when and how frequently a class repeats. In the above example, the entry implies that a certain student has math classes every monday at 11:00 AM, every tuesday at 10:00 AM, and every friday at 2:00 PM. You can create and verify cron expressions here: <https://crontab.guru/>.

### `app.js` - Choosing a browser

As long as you use any [chromium based browser](https://en.wikipedia.org/wiki/Chromium_(web_browser)#Browsers_based_on_Chromium), this script should work fine. For chrome/firefox, replace `executablePath` with `product: 'chrome'`.

```diff
-   executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
+   product: 'chrome/firefox'
```

In case of Microsoft Edge (and other Chromium based browsers), you have to only change the path to where the executable is located on your system.
