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
let tolerance = 10
let turnLeft = true
//  Make the direction of rotation random.
function turnDirection() {
    Math.randomBoolean()
    
    turnLeft = Math.randomBoolean()
    if (turnLeft) {
        robobit.rotatems(RBRobotDirection.Left, 40, 400)
        basic.showString("<")
    } else {
        // turnLeft = False
        robobit.rotatems(RBRobotDirection.Right, 40, 400)
        // turnLeft = True
        basic.showString(">")
    }
    
}

function calibrate(): number {
    let i: number;
    //  This calibrates the accelermometer to detect if the robot has come to a stop               
    let sampleMax = 0
    let sampleMin = 0
    let calibSample = []
    let calibSampleSize = 100
    basic.showString("C")
    robobit.go(RBDirection.Forward, 40)
    //  Push a series of samples of the accelerometer into an array, to detect a broad range of changing movements
    for (i = 0; i < calibSampleSize; i++) {
        calibSample.push(input.acceleration(Dimension.Z))
        basic.pause(50)
    }
    //  Get average of sample values
    let figure = 0
    for (i = 0; i < calibSampleSize; i++) {
        figure += calibSample[i]
    }
    let average = figure / calibSampleSize
    //  When caliibration is complete move robot and set display to 'D' - Done.
    robobit.stop(RBStopMode.Brake)
    robobit.goms(RBDirection.Reverse, 50, 1000)
    basic.showString("D")
    //  Set boolean to true to conirm calibration complete.
    
    calibDone = true
    // Calculate the min and max values for the accelerometer. How much it is moving while it is revving against a wall or an object
    serial.writeNumbers(calibSample)
    // for value in calibSample:
    //     if value > sampleMax:
    //         sampleMax = value                  
    //     if value < sampleMin:
    //         sampleMin = value            
    serial.writeValue("Average", average)
    return average
}

function moveAndAvoid() {
    let distance = robobit.sonar(RBPingUnit.Centimeters)
    let accelZ = input.acceleration(Dimension.Z)
    //  Use sonar distance to stop and reverse the robot.
    if (distance <= 25) {
        robobit.ledClear()
        serial.writeLine("NEAR OBSTACLE")
        basic.showString("O")
        robobit.stop(RBStopMode.Brake)
        //  basic.pause(500)
        robobit.goms(RBDirection.Reverse, 40, 200)
        turnDirection()
    } else if (accelZ >= calibAvg - tolerance && accelZ <= calibAvg + tolerance) {
        //  If the speed of the robot is equal to the avg calibration value plus and minus the tolerance change direction
        robobit.ledClear()
        serial.writeLine("STATIONARY")
        basic.showString("S")
        robobit.stop(RBStopMode.Brake)
        basic.pause(500)
        // robobit.goms(RBDirection.REVERSE, 40, 200)
        // robobit.rotatems(RBRobotDirection.RIGHT, 40, 400)
        turnDirection()
    } else {
        serial.writeLine("MOVING")
        robobit.ledRainbow()
        basic.showString("M")
        robobit.goms(RBDirection.Forward, 40, 1500)
    }
    
}

input.onButtonPressed(Button.A, function on_button_pressed_a() {
    let calibAvg = calibrate()
})
basic.forever(function on_forever() {
    serial.writeValue("Accel Z: ", input.acceleration(Dimension.Z))
    serial.writeValue("Compass Degrees: ", input.compassHeading())
    if (calibDone) {
        basic.showString("/")
        moveAndAvoid()
    }
    
})
