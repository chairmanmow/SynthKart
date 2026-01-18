/**
 * HUD data computation.
 * Calculates values to display; actual rendering is in HudRenderer.
 */

interface HudData {
  speed: number;
  speedMax: number;
  lap: number;
  totalLaps: number;
  lapProgress: number;  // 0.0 to 1.0 - how far through current lap
  position: number;
  totalRacers: number;
  lapTime: number;
  bestLapTime: number;
  totalTime: number;
  heldItem: ItemType | null;
  raceFinished: boolean;
}

class Hud {
  private startTime: number;
  private lapStartTime: number;
  private bestLapTime: number;

  constructor() {
    this.startTime = 0;
    this.lapStartTime = 0;
    this.bestLapTime = Infinity;
  }

  /**
   * Initialize HUD for race start.
   */
  init(currentTime: number): void {
    this.startTime = currentTime;
    this.lapStartTime = currentTime;
    this.bestLapTime = Infinity;
  }

  /**
   * Called when a new lap starts.
   */
  onLapComplete(currentTime: number): void {
    var lapTime = currentTime - this.lapStartTime;
    if (lapTime < this.bestLapTime) {
      this.bestLapTime = lapTime;
    }
    this.lapStartTime = currentTime;
  }

  /**
   * Compute HUD data from game state.
   */
  compute(vehicle: IVehicle, track: ITrack, road: Road, vehicles: IVehicle[], currentTime: number): HudData {
    // Calculate lap progress (0.0 to 1.0)
    var lapProgress = 0;
    if (road.totalLength > 0) {
      lapProgress = (vehicle.trackZ % road.totalLength) / road.totalLength;
      if (lapProgress < 0) lapProgress += 1.0;
    }

    // Count only actual racers (not commuter NPCs)
    var racers = vehicles.filter(function(v) { return !v.isNPC; });
    
    return {
      speed: Math.round(vehicle.speed),
      speedMax: VEHICLE_PHYSICS.MAX_SPEED,
      lap: vehicle.lap,
      totalLaps: track.laps,
      lapProgress: lapProgress,
      position: vehicle.racePosition,
      totalRacers: racers.length,
      lapTime: currentTime - this.lapStartTime,
      bestLapTime: this.bestLapTime === Infinity ? 0 : this.bestLapTime,
      totalTime: currentTime - this.startTime,
      heldItem: vehicle.heldItem,
      raceFinished: vehicle.lap > track.laps
    };
  }

  /**
   * Format time as M:SS.mm
   */
  static formatTime(seconds: number): string {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    var secStr = secs < 10 ? "0" + secs.toFixed(2) : secs.toFixed(2);
    return mins + ":" + secStr;
  }
}
