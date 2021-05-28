//  Set up model specs and accelerometor sensitivity
robobit.select_model(RBModel.Mk3)
input.setAccelerometerRange(AcceleratorRange.FourG)
//  Initial variables
let distance = 0
let accelZ = 0
let accelY = 0
let calibValues = [0, 0]
let calibAvg = 0
let calibDone = false
let average = 0
function calibrate(): number {
    let i: number;
    //  This calibrates the accelermometer to detect if the robot has come to a stop               
    let sampleMax = 0
    let sampleMin = 0
    let calibSample = []
    let calibSampleSize = 100
    basic.showString("C")
    robobit.go(RBDirection.Forward, 50)
    //  Push a series of samples of the accelerometer into an array, to detect a broad range of changing movements
    for (i = 0; i < calibSampleSize; i++) {
        calibSample.push(input.acceleration(Dimension.Z))
        // serial.write_value("values: ", calibSample[i])
        basic.pause(50)
    }
    //  Get average of sample values
    let figure = 0
    for (i = 0; i < calibSampleSize; i++) {
        figure += calibSample[i]
    }
    let average = figure / calibSampleSize
    robobit.stop(RBStopMode.Brake)
    robobit.goms(RBDirection.Reverse, 50, 1000)
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
    // serial.write_value("Min: ", sampleMin)
    // serial.write_value("Max: ", sampleMax)
    serial.writeValue("Average", average)
    // return [sampleMin, sampleMax]
    return average
}

function moveAndAvoid() {
    let distance = robobit.sonar(RBPingUnit.Centimeters)
    let accelZ = input.acceleration(Dimension.Z)
    // led.plot_bar_graph(input.acceleration(Dimension.Z), 1023)
    // serial.write_value("min: ", calibValues[0])
    // serial.write_value("max: ", calibValues[1])
    serial.writeValue("distance: ", distance)
    if (distance <= 15) {
        robobit.ledClear()
        serial.writeLine("NEAR OBSTACLE")
        basic.showString("O")
        robobit.stop(RBStopMode.Brake)
        basic.pause(500)
        robobit.goms(RBDirection.Reverse, 50, 200)
        robobit.rotatems(RBRobotDirection.Left, 60, 400)
    } else if (accelZ >= calibAvg - 8 && accelZ <= calibAvg + 8) {
        robobit.ledClear()
        serial.writeLine("STATIONARY")
        basic.showString("S")
        robobit.stop(RBStopMode.Brake)
        basic.pause(500)
        robobit.goms(RBDirection.Reverse, 50, 200)
        robobit.rotatems(RBRobotDirection.Right, 60, 400)
    } else {
        serial.writeLine("MOVING")
        robobit.ledRainbow()
        basic.showString("M")
        robobit.go(RBDirection.Forward, 50)
    }
    
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    let calibAvg = calibrate()
})
basic.forever(function on_forever() {
    serial.writeValue("Accel Z: ", input.acceleration(Dimension.Z))
    if (calibDone) {
        basic.showString("/")
        moveAndAvoid()
    }
    
})
