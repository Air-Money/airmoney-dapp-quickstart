import { AMKey } from "@airmoney-degn/controller-sdk";
import { AirMoneyModule, CenteredFlex } from "@airmoney-degn/react-ui";

export const App = () => {
  const { toast } = AirMoneyModule.useToast();
  const { setLeftButton, setRightButton } = AirMoneyModule.useButton();

  // Handle back navigation
  AirMoneyModule.useBack(
    () => {
      console.log("Back button pressed");
    },
    { name: "App", priority: 1 }
  );

  // Set up device buttons
  setLeftButton("ledger.gif", () => {
    console.log("Left button pressed");
    toast({ title: "Left button!", variant: "default" });
  });

  setRightButton("moon-it.jpeg", () => {
    console.log("Right button pressed");
    toast({ title: "Right button!", variant: "default" });
  });

  // Handle keyboard events
  AirMoneyModule.useKeyEventListener({
    triggers: [
      {
        condition: (event) =>
          event.subType === "press" && event.data.key === AMKey.RotaryButton,
        trigger: () =>
          toast({ title: "Rotary button pressed!", variant: "default" }),
      },
      {
        condition: (event) =>
          event.subType === "press" && event.data.key === AMKey.ClockwiseRotary,
        trigger: () =>
          toast({ title: "Turned clockwise!", variant: "default" }),
      },
      {
        condition: (event) =>
          event.subType === "press" &&
          event.data.key === AMKey.CounterClockwiseRotary,
        trigger: () =>
          toast({ title: "Turned counter-clockwise!", variant: "default" }),
      },
    ],
    name: "App",
    priority: 1,
  });

  AirMoneyModule.useShift({
    priority: 1,
    name: "App",
  });

  return (
    <CenteredFlex className="size-full flex-col p-6 bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-2xl space-y-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            AirMoney App Demo
          </h1>
          <p className="text-gray-600">Test interactions</p>
        </div>

        {/* Instructions Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Keyboard Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">⌨️</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Keyboard Controls
              </h2>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mr-3 min-w-[60px]">
                  ↑
                </span>
                <span>
                  Hold arrow up to see shift state changes in top left corner
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mr-3 min-w-[60px]">
                  Enter
                </span>
                <span>Press to trigger toast notification</span>
              </div>
              <div className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mr-3 min-w-[60px]">
                  ← →
                </span>
                <span>Press left/right arrows to trigger toast</span>
              </div>
              <div className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mr-3 min-w-[60px]">
                  [ ]
                </span>
                <span>Press brackets to trigger toast</span>
              </div>
            </div>
          </div>

          {/* AirMoney Device Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">📱</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                AirMoney Device
              </h2>
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mr-3 min-w-[60px]">
                  Shift
                </span>
                <span>
                  Hold shift button to see state changes in top left corner
                </span>
              </div>
              <div className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mr-3 min-w-[60px]">
                  Rotary
                </span>
                <span>Press rotary button to trigger toast notification</span>
              </div>
              <div className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mr-3 min-w-[60px]">
                  L/R
                </span>
                <span>Press left/right buttons to trigger toast</span>
              </div>
              <div className="flex items-start">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs mr-3 min-w-[60px]">
                  ↻ ↺
                </span>
                <span>Rotate clockwise/counter-clockwise to trigger toast</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Button */}
        <div className="text-center">
          <button
            onClick={() =>
              toast({ title: "Hello from toast!", variant: "successful" })
            }
            className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Show Demo Toast
          </button>
        </div>
      </div>
    </CenteredFlex>
  );
};
