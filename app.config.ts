import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins'
import {
  MergeResults,
  mergeContents,
} from '@expo/config-plugins/build/utils/generateCode'
import path from 'path'
import { promises } from 'fs'

const myValue = 'My App';

function addAda(src: string): MergeResults {
  return mergeContents({
    tag: "ada",
    src,
    newSrc: `  use_ada!()`,
    anchor: /post_install do \|installer\|/i,
    offset: 0,
    comment: "#",
  })
}

function addAdaImport(src: string): MergeResults {
  return mergeContents({
    tag: "ada-import",
    src,
    newSrc: `require_relative '../node_modules/@ada-support/react-native-sdk/react_native_pods'`,
    anchor: /require \'json\'/i,
    offset: 0,
    comment: "#",
  })
}

const withAda: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const filePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')
      const contents = await promises.readFile(filePath, { encoding: 'utf-8' })
      let results: MergeResults

      // add ada-import
      try {
        results = addAdaImport(contents)
        if (results.didMerge) {
          await promises.writeFile(filePath, results.contents)
        }
      } catch (error: any) {
        console.error(error)
      }

      const newContents = await promises.readFile(filePath, { encoding: 'utf-8' })
      let adaResults: MergeResults

      // add use_ada!()
      try {
        adaResults = addAda(newContents)
        if (adaResults.didMerge) {
          await promises.writeFile(filePath, adaResults.contents)
        }
      } catch (error: any) {
        console.error(error)
      }

      return config
    }
  ])
}

module.exports = {
  name: myValue,
  scheme: 'com.myapp.qa',
  version: process.env.MY_CUSTOM_PROJECT_VERSION || '1.0.0',
  // All values in extra will be passed to your app.
  android: {
    "package": "com.test-ada.myapp"
  },
  ios: {
    "bundleIdentifier": "com.test-ada.myapp"
  },
  plugins: [
    withAda,
  ]
};
