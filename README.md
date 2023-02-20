## mirrorrim

![Webp net-resizeimage](https://user-images.githubusercontent.com/9820374/158047850-fbc0b4b1-1d18-4c6b-962b-83084f66046f.png)

This is a node app for generating iOS/Android localization files from local CSV or Google Sheet. You can consider this as a solution for maintainning multiple languages in iOS/Android platform btween developers and whoever updates the wordings.

## Install
Local(recommended): `yarn add mirrorrim --dev`
Global: `yarn global add mirrorrim` or `npm install mirrorrim --global`

## Usage

### Manually

```
mirrorrim --output-dir './outputs' --input-path './resources/test.csv'
```

### Quick Test or Wordings are not sensitive

Make sure you have your Google Sheet file shared as public read-only so mirrorrim can pull from Google.

```
mirrorrim --output-dir './outputs' --googleFileId 1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI
```

or add a `mirrorrim` section in your package.json and run `mirrorrim` at your root folder

```
"mirrorrim": {
    "googleFileId": "1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI",
    "outputDir": "./PATH_TO_YOUR_DEST",
    "platforms": ["ios", "android"]
  },
```


### Configured(recommended)

add a `mirrorrim` section in your package.json and run `yarn mirrorrim` at your root folder

```
"mirrorrim": {
    "googleCredential": "./google-credential.json",
    "googleFileId": "1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI",
    "outputDir": "./PATH_TO_YOUR_DEST",
    "platforms": ["ios", "android"]
  },
```

The output looks like

<img width="275" alt="Cursor_and_Localizable_strings_—_outputs_en_lproj_—_multi-language-mobile" src="https://user-images.githubusercontent.com/9820374/85225517-899f2a80-b404-11ea-8ac2-ddd301ec5c77.png">

If you see a 404 error, follow the setup [here](https://github.com/jhonny-me/mirrorrim#How-to-setup-Google-Account).

List of options:
```
--output-dir <string>      | default: ./output
--platforms <string>       | default: ['ios', 'android']
--input-path <file>        | path to local csv
--google-file-id <string>  | google file id, should be sheet file
--google-credential <file> | path to google credentials.json
``` 

The tool currently onlys supports en and zh-Hans. Will support more in later phase. Please make sure you have the same column title as below for the sheet.

<img width="357" alt="test_words_list_-_Google_表格" src="https://user-images.githubusercontent.com/9820374/85487813-dbf86b00-b5ff-11ea-8096-2a8c42e43f03.png">

## Example

Let's say your wordings are kept at https://docs.google.com/spreadsheets/d/1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI/edit?usp=sharing

Follow the setup [here](https://github.com/jhonny-me/mirrorrim#How-to-setup-Google-Account) to get the `google-credential.json` file

### iOS

Before you run this script, make sure you already have the `Localizable` file created and corresponding language enabled, otherwise you'll have to switch around manually.

After [install](https://github.com/jhonny-me/mirrorrim#install) at your project root folder, add following section to your package.json

```
"mirrorrim": {
    "googleCredential": "./google-credential.json",
    "googleFileId": "1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI",
    "outputDir": "./PATH_TO_YOUR_DEST",
    "platforms": ["ios"]
  },
```

And run `mirrorrim` at your project root folder. You can add the localization files from Xcode now.

##### What's More For iOS?
You can combine it with [R.swift](https://github.com/mac-cain13/R.swift), then use `R.string.localizable.alert_ok()` for localized string.

Wait... R.swift currently doesn't support in-app language switch well, but with this extension https://gist.github.com/jhonny-me/dd2edb43fb167d1f55f79021718507b7  

you can do: `R.string.localizable.alert_ok.localized()`

What about params? I got you covered: `R.string.localizable.count_number.localized().withInputs(2, 'piggets')`

When you want to change language simply call `StringResource.language = "zh-Hans"`

### Android
After [install](https://github.com/jhonny-me/mirrorrim#install) at your project root folder, add following section to your package.json

```
"mirrorrim": {
    "googleCredential": "./google-credential.json",
    "googleFileId": "1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI",
    "outputDir": "./PATH_TO_YOUR_DEST",
    "platforms": ["android"]
  },
```

And run `mirrorrim` at your project root folder. You can add the localization files from your IDE now.

### Flutter
Before you run this script, make sure you had installed `Flutter Intl` plugin，you can find it from `VSCode` or `Android Studio`.
And you also need install [`flutter_localization`](https://pub.dev/packages/flutter_localization) dependency in your flutter project

1. use `Flutter Intl` plugin to initial
2. use `Flutter Intl`  to add local(default is only en, you can add what you needed)

```
"mirrorrim": {
    "googleCredential": "./google-credential.json",
    "googleFileId": "1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI",
    "outputDir": "./PATH_TO_YOUR_DEST",
    "platforms": ["android"]
  },
```

And run `mirrorrim` at your project root folder. You can add the localization files from your project now.

you can use `S.current.#key` to get the localized value

when you run `mirrorrim` to update the localizetion, `Flutter Intl` will takes some time to re-generate some code, just need wait for a moment


### How to setup Google Account

#### create project and enable drive api
1. Go to the [Google Developers Console](https://console.developers.google.com/)
2. Select your project or create a new one (and then select it)
3. Enable the Drive API for your project
4. In the sidebar on the left, select APIs & Services > Library
5. Search for "drive"
6. Click on "Google Drive API"
7. click the blue "Enable" button

#### create service account and download the json credential
1. In the sidebar on the left, select APIs & Services > Credentials
2. Click blue "+ CREATE CREDENTIALS" and select "Service account" option
3. Enter name, description, click "CREATE"
4. You can skip permissions, click "CONTINUE"
5. Click "+ CREATE KEY" button
6. Select the "JSON" key type option
7. Click "Create" button
8. your JSON key file is generated and downloaded to your machine (it is the only copy!)
9. click "DONE"
10. rename the downloaded json to `google-credential.json`
11. add the generated bot user to your Google Sheet as a viewer, it can be found at the `client_email` at the downloaded json.


> Be careful - never check your API keys / secrets into version control (git)

