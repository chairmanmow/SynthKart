/**
 * HumanDriver - Driver controlled by keyboard input.
 */

class HumanDriver implements IDriver {
  private controls: Controls;

  constructor(controls: Controls) {
    this.controls = controls;
  }

  update(_vehicle: IVehicle, _track: ITrack, _dt: number): DriverIntent {
    return {
      accelerate: this.controls.getAcceleration(),
      steer: this.controls.getSteering(),
      useItem: this.controls.wasJustPressed(GameAction.USE_ITEM)
    };
  }
}
