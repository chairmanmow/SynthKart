# Vehicle and Driver Model

## Definitions
- DriverIntent: { throttle, brake, steer } normalized ranges
- VehicleState: position, heading, velocity, angularVelocity

## Human driver
- Maps key presses to intent (no physics inside input layer)

## CPU driver (future)
- Consumes track spline/waypoints + opponent proximity
- Outputs same DriverIntent as human driver

## Progression path
Iteration 1:
- Arcade kinematics (no tire simulation)
- Simple steering curve vs speed
Iteration 2:
- Drifts / traction loss
Iteration 3:
- Contact/collisions and item impacts