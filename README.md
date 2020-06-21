## multi-language-mobile
This is a node app for generating iOS/Android localization files from local CSV or Google Doc. You can consider this as a solution for maintainning multiple languages in iOS/Android platform btween developers and whoever updates the wordings.

## Install
`yarn global add multi-language-mobile` or `npm install multi-language-mobile --global`

## Usage

`multi-language --output-dir './outputs' --input-path './resources/test.csv'`

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

