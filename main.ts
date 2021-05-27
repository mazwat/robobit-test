robobit.select_model(RBModel.Mk3)
// robobit.go(RBDirection.FORWARD, 60)
// robobit.rb_enable_bluetooth(RBBluetooth.BT_ENABLE)
// robobit.rotate(RBRobotDirection.LEFT, 60)
input.setAccelerometerRange(AcceleratorRange.FourG)
robobit.ledRainbow()
let distance = 0
let accelZ = 0
let accelY = 0
function calibrate(): number[] {
    let sampleMax = 0
    let sampleMin = 0
    let calibSample = []
    let calibSampleSize = 100
    basic.showString("C")
    for (let i = 0; i < calibSampleSize; i++) {
        calibSample.push(input.acceleration(Dimension.Z))
        basic.pause(100)
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
    return [sampleMin, sampleMax]
}

let calibValues = calibrate()
basic.forever(function on_forever() {
    let distance = robobit.sonar(RBPingUnit.Centimeters)
    let accelZ = input.acceleration(Dimension.Z)
    // led.plot_bar_graph(input.acceleration(Dimension.Z), 1023)
    serial.writeValue("min: ", calibValues[0])
    serial.writeValue("max: ", calibValues[1])
    serial.writeValue("distance: ", distance)
    if (distance <= 8 && accelZ >= calibValues[0] && accelZ <= calibValues[1]) {
        serial.writeLine("NEAR OBSTACLE")
        basic.showString("O")
        robobit.stop(RBStopMode.Brake)
        basic.pause(1000)
        robobit.goms(RBDirection.Reverse, 50, 400)
        robobit.rotatems(RBRobotDirection.Left, 60, 400)
    } else {
        serial.writeLine("MOVING")
        basic.showString("M")
        robobit.go(RBDirection.Forward, 50)
    }
    
})
