//  Set up model specs and accelerometor sensitivity
robobit.select_model(RBModel.Mk3)
input.setAccelerometerRange(AcceleratorRange.FourG)
//  Initial variables
let distance = 0
let accelZ = 0
let accelY = 0
let calibValues = [0, 0]
let calibDone = false
function calibrate(): number[] {
    //  This calibrates the accelermometer to detect if the robot has come to a stop               
    let sampleMax = 0
    let sampleMin = 0
    let calibSample = []
    let calibSampleSize = 100
    basic.showString("C")
    // robobit.go(RBDirection.FORWARD, 50) 
    //  Push a series of samples of the accelerometer into an array, to detect a broad range of changing movements
    for (let i = 0; i < calibSampleSize; i++) {
        calibSample.push(input.acceleration(Dimension.Z))
        // serial.write_value("values: ", calibSample[i])
        basic.pause(50)
    }
    // obobit.stop(RBStopMode.BRAKE)
    // robobit.goms(RBDirection.REVERSE, 50, 1000)
    basic.showString("D")
    
    calibDone = true
    // serial.write_value("Calibration done: ", calibDone)
    // Calculate the min and max values for the accelerometer. How much it is moving while it is revving against a wall or an object
    serial.writeNumbers(calibSample)
    for (let value of calibSample) {
        if (value > sampleMax) {
            sampleMax = value
        }
        
        if (value < sampleMin) {
            sampleMin = value
        }
        
    }
    serial.writeValue("Min: ", sampleMin)
    serial.writeValue("Max: ", sampleMax)
    return [sampleMin, sampleMax]
}

function moveAndAvoid() {
    robobit.ledRainbow()
    let distance = robobit.sonar(RBPingUnit.Centimeters)
    let accelZ = input.acceleration(Dimension.Z)
    // led.plot_bar_graph(input.acceleration(Dimension.Z), 1023)
    serial.writeValue("min: ", calibValues[0])
    serial.writeValue("max: ", calibValues[1])
    serial.writeValue("distance: ", distance)
    if (distance <= 10) {
        serial.writeLine("NEAR OBSTACLE")
        basic.showString("O")
        robobit.stop(RBStopMode.Brake)
        basic.pause(1000)
        robobit.goms(RBDirection.Reverse, 50, 400)
        robobit.rotatems(RBRobotDirection.Left, 60, 400)
    } else if (accelZ >= calibValues[0] && accelZ <= calibValues[1]) {
        serial.writeLine("STATIONARY")
        basic.showString("S")
        robobit.stop(RBStopMode.Brake)
        basic.pause(1000)
        robobit.goms(RBDirection.Reverse, 50, 400)
        robobit.rotatems(RBRobotDirection.Right, 60, 400)
    } else {
        serial.writeLine("MOVING")
        basic.showString("M")
        robobit.go(RBDirection.Forward, 50)
    }
    
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    let calibValues = calibrate()
})
basic.forever(function on_forever() {
    serial.writeValue("accel: ", input.acceleration(Dimension.Z))
    // serial.write_value("Calibration done: ", calibDone)
    if (calibDone) {
        // basic.show_string("R")
        moveAndAvoid()
    }
    
})
