robobit.select_model(RBModel.Mk3)
// robobit.go(RBDirection.FORWARD, 60)
// robobit.rb_enable_bluetooth(RBBluetooth.BT_ENABLE)
// robobit.rotate(RBRobotDirection.LEFT, 60)
input.setAccelerometerRange(AcceleratorRange.FourG)
robobit.ledRainbow()
let distance = 0
let accelZ = 0
let accelY = 0
let strength2D = 0
basic.forever(function on_forever() {
    // robobit.startScanner(0xffff00, 100);
    robobit.go(RBDirection.Forward, 50)
    let distance = robobit.sonar(RBPingUnit.Centimeters)
    // basic.show_string(str(distance))
    if (distance <= 6) {
        robobit.stop(RBStopMode.Brake)
        robobit.goms(RBDirection.Reverse, 50, 400)
        basic.pause(1000)
        robobit.rotatems(RBRobotDirection.Left, 60, 400)
    }
    
    // basic.show_number(input.acceleration(Dimension.Y)) 
    let accelZ = input.acceleration(Dimension.Z)
    let accelY = input.acceleration(Dimension.Z)
    let strength = Math.sqrt(accelZ * accelZ + accelY * accelY)
    serial.writeLine("Strength: " + ("" + strength))
    serial.writeLine("accel Y: " + ("" + accelY))
    serial.writeLine("accel Z: " + ("" + accelZ))
})
