import {
  AMServiceScreen,
  AMKey,
  AirMoneyService,
  AirMoneyKeyEvent,
  AMEvent,
} from '@airmoney-degn/controller-sdk';

const airmoneyService = new AirMoneyService();
document.getElementById('display-image')?.addEventListener('click', () => {
  airmoneyService.setImage({
    id: AMServiceScreen.Left,
    imageName: 'moon-it.jpeg',
  });
  airmoneyService.setImage({
    id: AMServiceScreen.Right,
    imageName: 'moon-it.jpeg',
  });
});
document.getElementById('display-gif')?.addEventListener('click', () => {
  airmoneyService.setAnimate({
    id: AMServiceScreen.Left,
    imageName: 'ledger.gif',
  });
  airmoneyService.setAnimate({
    id: AMServiceScreen.Right,
    imageName: 'ledger.gif',
  });
});

window.onload = () => {
  const keyEventListener = new AirMoneyKeyEvent({
    combinations: {
      combination: [AMKey.RotaryButton, AMKey.SideButton],
    },
    doubleClicks: {
      doubleClick: AMKey.RotaryButton,
    },
    debug: true,
  });

  keyEventListener.on((event: AMEvent<'key-event'>) => {
    console.log('key event', event);
  });
};
