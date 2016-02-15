# react-native-relay-node-modules
fbjs, react-relay and react-native needed to run Relay with React Native

While waiting for https://github.com/facebook/relay/issues/26 to be closed, I have put together the required pull requests
as listed at https://github.com/facebook/relay/issues/26#issuecomment-168523524

The package only tested with RN v0.18.0

# Usage
1. After initializing with react-native cli, remove react-native from package.json and everything in node_modules
1. Run the script below to extract all necessary packages into node_modules
```bash
#! /bin/bash

if [ ! -d ./node_modules/react-native -a ! -d ./node_modules/react-relay -a ! -d ./node_modules/fbjs ] ; then
  wget https://raw.githubusercontent.com/alvinthen/react-native-relay-node-modules/master/node_modules.zip -O temp.zip
  unzip -o temp.zip
  rm temp.zip
fi
```
Note: Do not include react-native, react-relay, fbjs in your package.json as it will look for the appropriate versions from npm
