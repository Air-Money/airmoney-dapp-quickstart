# Airmoney quickstart
This document will help you create and publish your first dapp

### Tools needed
* npm
* Solana wallet extension on browser

## Request whitelist access
Contact the Airmoney team and share your Solana wallet address to be whitelisted

## Install airmoney-cli
Install by running `npm install -g @airmoney-degn/airmoney-cli`

## Register developer
1) access https://dash-devnet.air.fun/ and authenticate with your browser wallet
2) register a developer profile
3) generate API key

To set up your enviroment copy your API key an run the command <br>

`airmoney-cli setup --user <wallet> --key <key>`<br>

**Note - your api key will get invalidated after one day, after while you'll need to generate a new one**

## Creating new project
```
Usage: airmoney-cli create [options]

Initialize a new project

Options:
  -N, --name <string>      Project name
  -n, --network <string>   network devnet|mainnet (default: "devnet")
  -f, --app-path <string>  path where project will be created
  --template               initialize project based on git quickstart
  -h, --help               display help for command
```

To facilitate the project setup process we added a template option that will clone this repo<br>

`airmoney-cli create -N example-project --template`<br>

After creating the new project you have to update the `metadata.json` with your info<br>
```json
{
  "name": "quickstart-pack",
  "displayName": "Quickstart Pack",
  "identifier": "com.degn.quickstart-pack",
  "author": "john doe",
  "maintainer": "john doe",
  "url": "https://github.com/Air-Money/airmoney-dapp-quickstart",
  "themeColor": "#C4C4C4",
  "version": "0.1.0",
  "whatsNew": "",
  "buildNumber": "",
  "commitHash": "",
  "buildDate": ""
}
```

## Building and using simulator
After installing the dependencies using `npm install`, the building process can be done by running `npm run build`<br>

This command will compile and bundle the images into a single html file and store it in dist

### Simulator
This is a WIP tool to simulate the behavior of the Airmoney hardware device in the browser<br>

To run the simulator in an already bundled file you can run the command<br>

`npm run serve` or `airmoney-cli serve -f dist`<br>

In most cases you will probably run it from your project directory using `-f dist`<br>

In the case where you are actively coding and using HMR (Hot Module Replacement) you will need to use the option `-u, --app-url` and specify the url where the dev server is running<br>

Note, because of the inner workings of how the simulator allowing HMR to work, you will have to update the HMR websocket port to correctly point to the dev server and not the simulator<br>
this example in vite
```
server:{
  'hmr': {port:5173}
}
```

**Note - the simulator is currently intended to help simulate the UI/UX of the device's various screens and buttons/dials. Functionality like camera, fingerprint sensor etc are not currently part of the simulator. We are looking to include these in a future version

```
Usage: airmoney-cli serve [options]

Serve locally in the simulator

Options:
  -p, --port <number>            Port (default: "4040")
  -f, --index-app-path <string>  path for the index.html (default: "./")
  --no-browser                   stop browser from being open
  -i, --button-image <string>    path for the button images (default: "assets")
  -u, --app-url <string>         url where the app is running
  -h, --help                     display help for command
```

## Submitting to dappstore
To submit you can run the command `npm run upload` or `airmoney-cli upload -f dist`<br>

After the dapp is successfully submitted, you will need to check the packages in https://dash-devnet.air.fun/<br>

Select the appropriate Category for your dapp and then click **Register Dapp**<br>

Then finally click on the action button **Sign and Submit**

## Keyboard bindings
- `Left arrow`: left button
- `Right arrow`: right button
- `Up arrow` (press and hold): Balance button
- `Down arrow`: Mute
- `Enter`: rotary knob press
- `[ key`: clockwise rotary
- `] key`: counter clockwise rotary
