/**
 * PositionIndicator - Race position display.
 */

interface PositionData {
  position: number;
  totalRacers: number;
  suffix: string;
}

class PositionIndicator {
  /**
   * Calculate position display data.
   */
  static calculate(position: number, totalRacers: number): PositionData {
    return {
      position: position,
      totalRacers: totalRacers,
      suffix: this.getOrdinalSuffix(position)
    };
  }

  /**
   * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
   */
  static getOrdinalSuffix(n: number): string {
    var s = ["th", "st", "nd", "rd"];
    var v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  /**
   * Format position string (e.g., "3rd / 8")
   */
  static format(data: PositionData): string {
    return data.position + data.suffix + " / " + data.totalRacers;
  }

  /**
   * Calculate race positions for all vehicles.
   * Sorts by lap > checkpoint > track position.
   */
  static calculatePositions(vehicles: IVehicle[]): void {
    // Sort vehicles by race progress
    var sorted = vehicles.slice().sort(function(a, b) {
      // First by lap (higher = better)
      if (a.lap !== b.lap) return b.lap - a.lap;

      // Then by checkpoint (higher = better)
      if (a.checkpoint !== b.checkpoint) return b.checkpoint - a.checkpoint;

      // Then by Z position (higher = better)
      return b.z - a.z;
    });

    // Assign positions
    for (var i = 0; i < sorted.length; i++) {
      sorted[i].racePosition = i + 1;
    }
  }
}
