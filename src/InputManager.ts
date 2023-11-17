import { Input } from "./constants/Keys";
import {
  ON_SCREEN_CANVAS_WIDTH,
  IS_MOBILE,
} from "./constants/ScreenConstants";
import { Vector } from "./math/Vector";

const KEY_MAP: Record<string, Key> = {
  " ": Input.Jump,
  Escape: Input.Escape,
  KeyW: Input.Up,
  KeyA: Input.Left,
  KeyS: Input.Down,
  KeyD: Input.Right,
  KeyE: Input.Interact,
  KeyM: Input.Map,
};

type ValueOf<T> = T[keyof T];

type Key = ValueOf<typeof Input>;

type KeyMap = Record<Key, boolean>;

function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return window.TouchEvent && event instanceof TouchEvent;
}

export class InputState {
  keyMap: KeyMap;
  mousePosition: Vector;
  leftClicking: boolean;
  rightClicking: boolean;

  constructor(
    keyMap: KeyMap,
    mousePosition: Vector,
    leftClicking: boolean = false,
    rightClicking: boolean = false
  ) {
    this.keyMap = keyMap;
    this.mousePosition = mousePosition;
    this.leftClicking = leftClicking;
    this.rightClicking = rightClicking;
  }

  /**
   * Check the current value for the horizontal axis input.
   * @return {number} a value from -1 to 1.
   */
  getHorizontalAxis() {
    return +!!this.keyMap[Input.Right] - +!!this.keyMap[Input.Left];
  }

  getVerticalAxis() {
    return +!!this.keyMap[Input.Down] - +!!this.keyMap[Input.Up];
  }

  /**
   * Checks whether an input is currently pressed.
   * @param {Input} input
   */
  isPressed(input: Key) {
    return !!this.keyMap[input];
  }

  isLeftClicking() {
    return this.leftClicking;
  }

  isRightClicking() {
    return this.rightClicking;
  }

  static empty() {
    return new InputState({}, new Vector(0, 0));
  }
}

export class InputEvent {
  constructor() {}

  isForKey(_key: Key) {
    return false;
  }

  isClick() {
    return false;
  }

  isScroll() {
    return false;
  }
}

export class KeyPressEvent extends InputEvent {
  input: Key;

  constructor(input: Key) {
    super();
    this.input = input;
  }

  isForKey(key: Key) {
    return key === this.input;
  }
}

export class ClickEvent extends InputEvent {
  position: Vector;
  isRight: boolean;

  constructor(position: Vector, isRightClick: boolean) {
    super();
    this.position = position;
    this.isRight = isRightClick;
  }

  isClick() {
    return true;
  }

  isRightClick() {
    return this.isRight;
  }
}

export class ScrollEvent extends InputEvent {
  delta: number;
  discrete: boolean;

  constructor(delta: number, discrete?: boolean) {
    super();
    this.delta = delta;
    this.discrete = !!discrete;
  }

  isScroll() {
    return true;
  }
}

export class InputManager {
  listener: (inputEvent: InputEvent) => void;

  leftClicking: boolean;
  rightClicking: boolean;

  isButtonDown: KeyMap;
  mousePosition: Vector;

  canvas: HTMLCanvasElement;

  constructor(listener: (inputEvent: InputEvent) => void) {
    this.leftClicking = false;
    this.rightClicking = false;

    this.isButtonDown = {};
    this.listener = listener;
    this.mousePosition = new Vector(0, 0);

    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
  }

  /**
   * Set up event listeners.
   */
  init() {
    const onKeyEvent = (symbol: Key) => {
      if (this.listener) {
        this.listener(new KeyPressEvent(symbol));
      }
    };

    document.addEventListener("keydown", (e) => {
      const key = e.code;

      if (e.repeat) {
        return;
      }
      const symbol = KEY_MAP[key];
      if (!symbol) {
        return;
      }


      this.isButtonDown[symbol] = true;
      onKeyEvent(symbol);
    });

    document.addEventListener("keyup", (e) => {
      const key = e.code;

      const symbol = KEY_MAP[key];
      if (!symbol) {
        return;
      }


      this.isButtonDown[symbol] = false;
    });

    this.canvas.addEventListener(IS_MOBILE ? "touchmove" : "mousemove", (event) => {
      this.mousePosition = this.toCanvasPosition(event);
    });

    this.canvas.addEventListener(IS_MOBILE ? "touchstart" : "mousedown", (event) => {
      if (IS_MOBILE) {
        event.preventDefault();
      }
      this.mousePosition = this.toCanvasPosition(event);

      const isLeft = isTouchEvent(event) || (event instanceof MouseEvent && event.button === 0);
      const isRight = event instanceof MouseEvent && event.button === 2;

      if (isLeft) {
        this.listener?.(new ClickEvent(this.mousePosition, false));
        this.leftClicking = true;
      } else if (isRight) {
        this.listener?.(new ClickEvent(this.mousePosition, true));
        this.rightClicking = true;
      }
    });

    this.canvas.addEventListener(IS_MOBILE ? "touchend" : "mouseup", (event) => {
      const isLeft = isTouchEvent(event) || (event instanceof MouseEvent && event.button === 0);
      const isRight = event instanceof MouseEvent && event.button === 2;

      if (isLeft) {
        this.leftClicking = false;
      } else if (isRight) {
        this.rightClicking = false;
      }
    });

    this.canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    // Stop current clicks on mouse leave
    this.canvas.addEventListener(IS_MOBILE ? "touchend" : "mouseleave", () => {
      this.leftClicking = false;
      this.rightClicking = false;
    });

    this.canvas.addEventListener("wheel", (event) => {
      this.listener?.(new ScrollEvent(event.deltaY));
    });

    const wireButton = (id: string, input: Key | (() => InputEvent)) => {
      const btn = document.getElementById(id);

      if (!btn) {
        return;
      }

      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();

        if (typeof input === "function") {
          this.listener?.(input());
        } else {
          this.isButtonDown[input] = true;

          onKeyEvent(input);
        }
      });

      btn.addEventListener("touchcancel", (e) => {
        e.preventDefault();
        if (typeof input === "function") {
          // Do nothing
        } else {
          this.isButtonDown[input] = false;
        }
      });

      btn.addEventListener("touchend", (e) => {
        e.preventDefault();
        if (typeof input === "function") {
          // Do nothing
        } else {
          this.isButtonDown[input] = false;
        }
      });
    };

    wireButton("left", Input.Left);
    wireButton("right", Input.Right);
    wireButton("jump", Input.Jump);
    wireButton("down", Input.Down);
    wireButton("map", Input.Map);
    wireButton("exit", Input.Escape);
    wireButton("zoom-in", () => new ScrollEvent(1, true));
    wireButton("zoom-out", () => new ScrollEvent(-1, true));
  }

  toCanvasPosition(event: MouseEvent | TouchEvent) {
    const e = isTouchEvent(event)
      ? (event.touches.item(0) || { clientX: 0, clientY: 0 })
      : event;
    return Vector.scale(
      new Vector(
        e.clientX - this.canvas.offsetLeft + window.scrollX,
        e.clientY - this.canvas.offsetTop + window.scrollY
      ),
      ((this.canvas.width / this.canvas.clientWidth) * ON_SCREEN_CANVAS_WIDTH) /
        ON_SCREEN_CANVAS_WIDTH
    );
  }

  /**
   * @return {InputState} The current state of inputs
   */
  getInputState() {
    return new InputState(
      this.isButtonDown,
      this.mousePosition,
      this.leftClicking,
      this.rightClicking
    );
  }
}
