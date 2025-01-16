import {
  AMScreenManager,
  AMDeviceScreenController,
  AMSimulatorDeviceController,
  AMDeviceScreen,
  AMKeyEventListener,
  AMKey,
} from 'airmoney-sdk';
import gifImage from './assets/ledger.gif';
import jpgImage from './assets/moon-it.jpeg';

document.getElementById('display-image-device')?.addEventListener('click', () => {
  const deviceController = new AMDeviceScreenController();
  deviceController.displayImage({
    id: AMDeviceScreen.Left,
    /**
     * [Optional] Leave empty string for passing this prop
     */
    base64Image: jpgImage,
    /**
     * [Required], the image name placed in device
     */
    imageName: 'moon-it.jpeg',
  });
});
document.getElementById('display-gif-device')?.addEventListener('click', () => {
  const deviceController = new AMDeviceScreenController();
  deviceController.displayGif({
    id: AMDeviceScreen.Left,
    /**
     * [Optional] Leave empty string for passing this prop
     */
    base64Image: gifImage,
    /**
     * [Required], the image name placed in device
     */
    imageName: 'ledger.gif',
  });
});
document.getElementById('display-image-simulator')?.addEventListener('click', () => {
  const deviceController = new AMSimulatorDeviceController();
  deviceController.displayImage({
    id: AMDeviceScreen.Left,
    /**
     * [Required]
     */
    base64Image: jpgImage,
    /**
     * [Optional]
     */
    imageName: 'moon-it.jpeg',
  });
});
document.getElementById('display-gif-simulator')?.addEventListener('click', () => {
  const deviceController = new AMSimulatorDeviceController();
  deviceController.displayGif({
    id: AMDeviceScreen.Left,
    /**
     * [Required]
     */
    base64Image: gifImage,
    /**
     * [Optional]
     */
    imageName: 'ledger.gif',
  });
});
document.getElementById('display-image-all')?.addEventListener('click', () => {
  const screenManager = new AMScreenManager(new AMDeviceScreenController(), new AMSimulatorDeviceController());
  screenManager.displayImage({
    id: AMDeviceScreen.Left,
    /**
     * [Required] for setting in simulator
     */
    base64Image: jpgImage,
    /**
     * [Required] for setting in device
     */
    imageName: 'moon-it.jpeg',
  });
});
document.getElementById('display-gif-all')?.addEventListener('click', () => {
  const screenManager = new AMScreenManager(new AMDeviceScreenController(), new AMSimulatorDeviceController());
  screenManager.displayGif({
    id: AMDeviceScreen.Left,
    /**
     * [Required] for setting in simulator
     */
    base64Image: gifImage,
    /**
     * [Required] for setting in device
     */
    imageName: 'ledger.gif',
  });
});

window.onload = () => {
  const keyEventListener = new AMKeyEventListener({
    combinations: {
      combination: [AMKey.RotaryButton, AMKey.SideButton],
    },
    doubleClicks: {
      doubleClick: AMKey.RotaryButton,
    },
    debug: true,
  });

  keyEventListener.on((event) => {
    console.log('key event', event);
  });
};
