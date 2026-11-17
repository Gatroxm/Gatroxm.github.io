import type { DriveInput } from "./vehicle";

export interface ControlCallbacks {
  onInteract: () => void;
  onRespawn: () => void;
  onMap: () => void;
  onJump: () => void;
}

export interface Controls {
  read: () => DriveInput;
  dispose: () => void;
}

const KEY_FORWARD = new Set(["KeyW", "ArrowUp"]);
const KEY_BACK = new Set(["KeyS", "ArrowDown"]);
const KEY_LEFT = new Set(["KeyA", "ArrowLeft"]);
const KEY_RIGHT = new Set(["KeyD", "ArrowRight"]);

export function createControls(callbacks: ControlCallbacks): Controls {
  const keys = new Set<string>();
  let jumpQueued = false;
  let gamepadPrev: boolean[] = [];
  let stickX = 0;
  let stickY = 0;

  const onKeyDown = (event: KeyboardEvent) => {
    if (
      KEY_FORWARD.has(event.code) || KEY_BACK.has(event.code) ||
      KEY_LEFT.has(event.code) || KEY_RIGHT.has(event.code) ||
      event.code === "Space"
    ) {
      event.preventDefault();
    }
    if (event.repeat) return;
    keys.add(event.code);
    if (event.code === "Space") {
      jumpQueued = true;
      callbacks.onJump();
    }
    if (event.code === "Enter") callbacks.onInteract();
    if (event.code === "KeyR") callbacks.onRespawn();
    if (event.code === "KeyM") callbacks.onMap();
  };

  const onKeyUp = (event: KeyboardEvent) => {
    keys.delete(event.code);
  };

  const onBlur = () => keys.clear();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  const stick = document.querySelector<HTMLElement>("[data-joystick]");
  const knob = document.querySelector<HTMLElement>("[data-joystick-knob]");
  let stickPointer: number | null = null;

  const moveStick = (event: PointerEvent) => {
    if (!stick || stickPointer !== event.pointerId) return;
    const rect = stick.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.min(Math.hypot(dx, dy), rect.width / 2);
    const angle = Math.atan2(dy, dx);
    stickX = Math.cos(angle) * (distance / (rect.width / 2));
    stickY = Math.sin(angle) * (distance / (rect.width / 2));
    if (knob) {
      knob.style.transform = `translate(${stickX * 32}px, ${stickY * 32}px)`;
    }
  };

  const endStick = (event: PointerEvent) => {
    if (stickPointer !== event.pointerId) return;
    stickPointer = null;
    stickX = 0;
    stickY = 0;
    if (knob) knob.style.transform = "";
  };

  if (stick) {
    stick.addEventListener("pointerdown", (event) => {
      stickPointer = event.pointerId;
      stick.setPointerCapture(event.pointerId);
      moveStick(event);
    });
    stick.addEventListener("pointermove", moveStick);
    stick.addEventListener("pointerup", endStick);
    stick.addEventListener("pointercancel", endStick);
  }

  const touchJump = document.querySelector<HTMLElement>('[data-touch] [data-action="jump"]');
  const touchInteract = document.querySelector<HTMLElement>('[data-touch] [data-action="interact"]');
  const onTouchJump = () => {
    jumpQueued = true;
    callbacks.onJump();
  };
  const onTouchInteract = () => callbacks.onInteract();
  touchJump?.addEventListener("click", onTouchJump);
  touchInteract?.addEventListener("click", onTouchInteract);

  const pollGamepad = () => {
    const pad = navigator.getGamepads?.().find(Boolean);
    if (!pad) return { forward: 0, steer: 0, boost: false, jump: false };

    const axisX = Math.abs(pad.axes[0] ?? 0) > 0.16 ? pad.axes[0] : 0;
    const axisY = Math.abs(pad.axes[1] ?? 0) > 0.16 ? pad.axes[1] : 0;
    const pressed = (index: number) => Boolean(pad.buttons[index]?.pressed);
    const rising = (index: number) => pressed(index) && !gamepadPrev[index];

    if (rising(0)) callbacks.onInteract();
    if (rising(1)) callbacks.onRespawn();
    if (rising(2)) {
      jumpQueued = true;
      callbacks.onJump();
    }
    if (rising(3)) callbacks.onMap();

    gamepadPrev = pad.buttons.map((button) => button.pressed);
    return {
      forward: -(axisY ?? 0),
      steer: axisX ?? 0,
      boost: pressed(5) || pressed(7),
      jump: false,
    };
  };

  return {
    read() {
      const pad = pollGamepad();
      const hasKey = (set: Set<string>) => [...set].some((key) => keys.has(key));
      const forward =
        (hasKey(KEY_FORWARD) ? 1 : 0) - (hasKey(KEY_BACK) ? 1 : 0) + stickY * -1 + pad.forward;
      const steer =
        (hasKey(KEY_RIGHT) ? 1 : 0) - (hasKey(KEY_LEFT) ? 1 : 0) + stickX + pad.steer;
      const jump = jumpQueued;
      jumpQueued = false;

      return {
        forward: Math.max(-1, Math.min(1, forward)),
        steer: Math.max(-1, Math.min(1, steer)),
        boost: keys.has("ShiftLeft") || keys.has("ShiftRight") || pad.boost,
        jump,
      };
    },
    dispose() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      touchJump?.removeEventListener("click", onTouchJump);
      touchInteract?.removeEventListener("click", onTouchInteract);
    },
  };
}
