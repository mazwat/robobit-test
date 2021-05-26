robobit.select_model(RBModel.Mk3)
// robobit.go(RBDirection.FORWARD, 60)
// robobit.rb_enable_bluetooth(RBBluetooth.BT_ENABLE)
// robobit.rotate(RBRobotDirection.LEFT, 60)
input.setAccelerometerRange(AcceleratorRange.FourG)
robobit.ledRainbow()
let distance = 0
let accelZ = 0
let accelY = 0
let calibSample = [0]
let calibSampleSize = 20
let calibDone = false
function calibrateAccel(number: number) {
    let sampleMax = 0
    let sampleMin = 0
    if (calibSample.length < calibSampleSize) {
        calibSample.push(number)
    }
    
    // sampleMax = max(calibSample)
    for (let value of calibSample) {
        if (value > sampleMax) {
            sampleMax = value
        }
        
        if (value < sampleMin) {
            sampleMin = value
        }
        
    }
    serial.writeValue("Max : ", sampleMax)
    serial.writeValue("Min : ", sampleMin)
    serial.writeValue("Length : ", calibSample.length)
}

// robobit.startScanner(0xffff00, 100);
// robobit.go(RBDirection.FORWARD, 50)
// distance = robobit.sonar(RBPingUnit.Centimeters);    
// basic.show_number(distance)
// if (distance <= 6):
// robobit.stop(RBStopMode.BRAKE)
// #robobit.goms(RBDirection.REVERSE, 50, 400)
// basic.pause(1000) 
// robobit.rotatems(RBRobotDirection.LEFT, 60, 400)
// basic.show_number(input.acceleration(Dimension.Y)) 
// accelX = input.acceleration(Dimension.X) 
// strength = input.acceleration(Dimension.STRENGTH)        
// serial.write_value("strength: ", strength)
// serial.write_value("accel X: ", accelX)
// serial.write_value("strength3D: ", input.acceleration(Dimension.STRENGTH))
// serial.write_value("distance: ", distance)
// led.plot_bar_graph(accelZ, 1023)
// serial.write_value("accel Z: ", accelZ)
// if input.acceleration(Dimension.STRENGTH) >= 1023 and input.acceleration(Dimension.STRENGTH) <= 1049 and distance <= 4 :
// serial.write_line("STATIONARY")
// else:
// serial.write_line("MOVING")
basic.forever(function on_forever() {
    for (let i = 0; i < calibSampleSize; i++) {
        calibrateAccel(input.acceleration(Dimension.Z))
        basic.pause(100)
    }
})
