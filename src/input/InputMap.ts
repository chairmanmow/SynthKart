/**
 * Game actions that can be triggered by input.
 * 
 * BBS TERMINAL INPUT LIMITATION:
 * Terminals can only send one key at a time - no simultaneous key detection.
 * We use combined actions (ACCEL_LEFT = accelerate + turn left) to work around this.
 */
enum GameAction {
  NONE = 0,
  
  // Pure actions
  ACCELERATE,       // Speed up, no turn
  BRAKE,            // Slow down, no turn
  STEER_LEFT,       // Turn left, coast (maintain speed)
  STEER_RIGHT,      // Turn right, coast
  
  // Combined actions (for single-key input)
  ACCEL_LEFT,       // Accelerate + turn left
  ACCEL_RIGHT,      // Accelerate + turn right
  BRAKE_LEFT,       // Brake + turn left
  BRAKE_RIGHT,      // Brake + turn right
  
  // Other
  USE_ITEM,
  PAUSE,
  QUIT
}

/**
 * Maps raw keyboard input to game actions.
 * 
 * CONTROL SCHEME (designed for single-key BBS input):
 * 
 * ACCELERATE + TURN (Shift = gas pedal):
 *   Q / U = Accelerate + Left
 *   W / I = Accelerate straight
 *   E / P = Accelerate + Right
 * 
 * COAST + TURN (lowercase = no throttle):
 *   q / u = Turn Left (coast)
 *   e / p = Turn Right (coast)
 * 
 * BRAKE + TURN:
 *   A = Brake + Left
 *   S = Brake straight  
 *   D = Brake + Right
 *   a / s / d = same as uppercase
 * 
 * PURE THROTTLE:
 *   Z / z / / = Accelerate only
 *   C / c / . = Brake only
 * 
 * ARROWS (simplified arcade style):
 *   Up    = Accelerate straight
 *   Down  = Brake
 *   Left  = Accelerate + Left
 *   Right = Accelerate + Right
 */
class InputMap {
  private bindings: { [key: string]: GameAction };

  constructor() {
    this.bindings = {};
    this.setupDefaultBindings();
  }

  private setupDefaultBindings(): void {
    // === ACCELERATE + TURN (uppercase = shift held = gas + turn) ===
    this.bind('Q', GameAction.ACCEL_LEFT);
    this.bind('U', GameAction.ACCEL_LEFT);
    this.bind('W', GameAction.ACCELERATE);
    this.bind('I', GameAction.ACCELERATE);
    this.bind('E', GameAction.ACCEL_RIGHT);
    this.bind('P', GameAction.ACCEL_RIGHT);

    // === COAST + TURN (lowercase = turn without throttle) ===
    this.bind('q', GameAction.STEER_LEFT);
    this.bind('u', GameAction.STEER_LEFT);
    this.bind('w', GameAction.ACCELERATE);  // w also accelerates for simplicity
    this.bind('i', GameAction.ACCELERATE);
    this.bind('e', GameAction.STEER_RIGHT);
    this.bind('p', GameAction.STEER_RIGHT);

    // === BRAKE + TURN ===
    this.bind('A', GameAction.BRAKE_LEFT);
    this.bind('a', GameAction.BRAKE_LEFT);
    this.bind('S', GameAction.BRAKE);
    this.bind('s', GameAction.BRAKE);
    this.bind('D', GameAction.BRAKE_RIGHT);
    this.bind('d', GameAction.BRAKE_RIGHT);

    // === PURE THROTTLE (no turn) ===
    this.bind('Z', GameAction.ACCELERATE);
    this.bind('z', GameAction.ACCELERATE);
    this.bind('C', GameAction.BRAKE);
    this.bind('c', GameAction.BRAKE);

    // === NUMPAD ===
    // Top row: accelerate + direction
    this.bind('7', GameAction.ACCEL_LEFT);   // Gas + left
    this.bind('8', GameAction.ACCELERATE);   // Gas straight
    this.bind('9', GameAction.ACCEL_RIGHT);  // Gas + right
    // Middle row: cruise control steering
    this.bind('4', GameAction.STEER_LEFT);   // Turn left (cruise)
    this.bind('5', GameAction.BRAKE);        // Brake
    this.bind('6', GameAction.STEER_RIGHT);  // Turn right (cruise)
    // Bottom row: brake + direction
    this.bind('1', GameAction.BRAKE_LEFT);   // Brake + left
    this.bind('2', GameAction.BRAKE);        // Brake straight
    this.bind('3', GameAction.BRAKE_RIGHT);  // Brake + right

    // === OTHER CONTROLS ===
    this.bind(' ', GameAction.USE_ITEM);
    this.bind('\r', GameAction.USE_ITEM);
    this.bind('x', GameAction.PAUSE);
    this.bind('X', GameAction.PAUSE);
    this.bind('0', GameAction.QUIT);         // Numpad 0 or 0 to quit
  }

  /**
   * Bind a key to an action.
   */
  bind(key: string, action: GameAction): void {
    this.bindings[key] = action;
  }

  /**
   * Get action for a key.
   */
  getAction(key: string): GameAction {
    var action = this.bindings[key];
    return action !== undefined ? action : GameAction.NONE;
  }
}
