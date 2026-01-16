/**
 * GameState - Container for all game state.
 */

interface GameState {
  /** Current track (legacy, for checkpoint system) */
  track: ITrack;

  /** Road segments for pseudo-3D rendering and physics */
  road: Road;

  /** All vehicles in the race */
  vehicles: IVehicle[];

  /** Player's vehicle (also in vehicles array) */
  playerVehicle: IVehicle;

  /** Item system state */
  items: Item[];

  /** Game time in seconds */
  time: number;

  /** Whether race is in progress */
  racing: boolean;

  /** Whether race is finished */
  finished: boolean;

  /** Current camera X offset */
  cameraX: number;
}

/**
 * Create initial game state.
 */
function createInitialState(track: ITrack, road: Road, playerVehicle: IVehicle): GameState {
  return {
    track: track,
    road: road,
    vehicles: [playerVehicle],
    playerVehicle: playerVehicle,
    items: [],
    time: 0,
    racing: false,
    finished: false,
    cameraX: 0
  };
}
