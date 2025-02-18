# Airmoney quickstart
this document will help you create and publish your first dapp

### Tools needed
* npm
* solana wallet extension on browser

## Install airmoney-cli
you can install it by running `npm install airmoney-cli -g`
## Register developer
1) access https://dash-devnet.air.fun/ and authenticate with your browser wallet
2) register a developer profile
3) generate API key

to set up you enviroment copy your API key an run the command <br>
`airmoney-cli setup --user-address <wallet> --api-key <key>`<br>
**Your api key will get invalidated after one day**
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
to facilitate the project setup process we added a template option that will clone this repo<br>
`airmoney-cli create -N example-project --template`<br>
after creating the new project you have to update the `metadata.json` with your info<br>
```json
{
    "name": "quickstart-pack",
    "identifier": "com.degn.quickstart-pack",
    "author": "jhon doe",
    "version": "0.1.0",
    "maintainer": "jhon doe",
    "url": "https://github.com/Air-Money/airmoney-dapp-quickstart"
}
```
## Building and using simulator
after installing the dependencies using `npm install`,
the building process can be done by running `npm run build`<br>
this command will compile and bundle the images into a single html file and store it in dist

### Simulator
this is a WIP tool to simulate the behavior of Airmoney in the browser<br>
to run the simulator you can run the command `npm run serve` or `airmoney-cli serve -f dist`<br>
```
Usage: airmoney-cli serve [options]

Serve locally in the simulator

Options:
  -p, --port <number>      Port (default: "4040")
  -f, --app-path <string>  path where project is located
  --no-browser             stop browser from being open
  -h, --help               display help for command
```

## Submitting to dappstore
to submit you can run the command `npm run upload` or `airmoney-cli upload -f dist`<br>
after the dapp is successfully submitted, you will need to check the packages in https://dash-devnet.air.fun/<br>
and click on the action button **sign and submit**
