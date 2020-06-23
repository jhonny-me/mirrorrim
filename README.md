## multi-language-mobile
This is a node app for generating iOS/Android localization files from local CSV or Google Doc. You can consider this as a solution for maintainning multiple languages in iOS/Android platform btween developers and whoever updates the wordings.

## Install
Local(recommended): `yarn add multi-language-mobile --dev`
Global: `yarn global add multi-language-mobile` or `npm install multi-language-mobile --global`

## Usage

`multi-language --output-dir './outputs' --input-path './resources/test.csv'`

Or, add `multi-language` in your package.json and run `multi-language` at your root folder

```
"multi-language": {
    "googleCredential": "./google-credential.json",
    "googleFileId": "13PRkyoSfdpRJhTlY8xtyX8jrXuhzAZmS1iPL2c9L8Ek",
    "outputDir": "./PATH_TO_YOUR_DEST",
    "platforms": ["ios", "android"]
  },
```

The output looks like

<img width="275" alt="Cursor_and_Localizable_strings_—_outputs_en_lproj_—_multi-language-mobile" src="https://user-images.githubusercontent.com/9820374/85225517-899f2a80-b404-11ea-8ac2-ddd301ec5c77.png">

List of options:
```
--output-dir <string>      | default: ./output
--platforms <string>       | default: ['ios', 'android']
--input-path <file>        | path to local csv
--google-file-id <string>  | google file id, should be sheet file
--google-credential <file> | path to google credentials.json
``` 

## Example

Let's say your wordings are kept at https://docs.google.com/spreadsheets/d/1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI/edit?usp=sharing

You need to enable your google drive api at https://developers.google.com/drive/api/v3/quickstart/nodejs, make sure you enabled [read access](https://www.googleapis.com/auth/drive.readonly) for the project you created on Google console. Download the credentials and rename it as `google-credential.json`

### iOS
After [install](https://github.com/jhonny-me/multi-language-mobile#install) at your project root folder, add following section to your package.json

```
"multi-language": {
    "googleCredential": "./google-credential.json",
    "googleFileId": "1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI",
    "outputDir": "./PATH_TO_YOUR_DEST",
    "platforms": ["ios"]
  },
```

And run `multi-language` at your project root folder. You can add the localization files from Xcode now.

##### What's More For iOS?
You can combine it with [R.swift](https://github.com/mac-cain13/R.swift), then use `R.string.localizable.alert_ok()` for localized string.

Wait... R.swift currently doesn't support in-app language switch well, but with this extension https://gist.github.com/jhonny-me/dd2edb43fb167d1f55f79021718507b7  

you can do: `R.string.localizable.alert_ok.localized()`

What about params? I got you covered: `R.string.localizable.count_number.localized().withInputs(2, 'piggets')`

When you want to change language simply call `StringResource.language = "zh-Hans"`

### Android
After [install](https://github.com/jhonny-me/multi-language-mobile#install) at your project root folder, add following section to your package.json

```
"multi-language": {
    "googleCredential": "./google-credential.json",
    "googleFileId": "1Ik0mRByqVFldbAjDvrwGFx_CrM6-fsEKN0IzZnAr7rI",
    "outputDir": "./PATH_TO_YOUR_DEST",
    "platforms": ["android"]
  },
```

And run `multi-language` at your project root folder. You can add the localization files from your IDE now.