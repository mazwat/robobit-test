# Set up model specs and accelerometor sensitivity
robobit.select_model(RBModel.Mk3)
input.set_accelerometer_range(AcceleratorRange.FOUR_G)
# Initial variables
distance = 0
accelZ = 0
accelY = 0
calibValues = [0,0]
calibAvg = 0
calibDone = False
average = 0
tolerance = 10
turnLeft = True

# Make the direction of rotation random.
def turnDirection():
    Math.random_boolean()
    global turnLeft
    turnLeft = Math.random_boolean()
    if turnLeft:
        robobit.rotatems(RBRobotDirection.LEFT, 40, 400)
        basic.show_string("<")
        #turnLeft = False
    else:
        robobit.rotatems(RBRobotDirection.RIGHT, 40, 400)
        #turnLeft = True
        basic.show_string(">")
        

def calibrate():   
    # This calibrates the accelermometer to detect if the robot has come to a stop               
    sampleMax = 0
    sampleMin = 0
    calibSample = [] 
    calibSampleSize = 100
    basic.show_string("C")
    robobit.go(RBDirection.FORWARD, 40) 
    # Push a series of samples of the accelerometer into an array, to detect a broad range of changing movements
    for i in range(calibSampleSize):
        calibSample.append(input.acceleration(Dimension.Z)) 
        basic.pause(50)
    # Get average of sample values
    figure = 0
    for i in range (calibSampleSize):
        figure += calibSample[i]       
    average = figure / calibSampleSize
    # When caliibration is complete move robot and set display to 'D' - Done.
    robobit.stop(RBStopMode.BRAKE)
    robobit.goms(RBDirection.REVERSE, 50, 1000)
    basic.show_string("D")
    # Set boolean to true to conirm calibration complete.
    global calibDone
    calibDone = True
    #Calculate the min and max values for the accelerometer. How much it is moving while it is revving against a wall or an object
    serial.write_numbers(calibSample)
    #for value in calibSample:
    #    if value > sampleMax:
    #        sampleMax = value                  
    #    if value < sampleMin:
    #        sampleMin = value            
    serial.write_value("Average", average)
    return average 

def moveAndAvoid():       
    distance = robobit.sonar(RBPingUnit.Centimeters);    
    accelZ = input.acceleration(Dimension.Z) 
    # Use sonar distance to stop and reverse the robot.
    if distance <= 25 :
        robobit.led_clear()
        serial.write_line("NEAR OBSTACLE")
        basic.show_string("O")
        robobit.stop(RBStopMode.BRAKE)
        # basic.pause(500)
        robobit.goms(RBDirection.REVERSE, 40, 200)
        turnDirection()
     
    # If the speed of the robot is equal to the avg calibration value plus and minus the tolerance change direction
    elif accelZ >= calibAvg - tolerance and accelZ <= calibAvg + tolerance:
        robobit.led_clear()
        serial.write_line("STATIONARY")
        basic.show_string("S")
        robobit.stop(RBStopMode.BRAKE)
        basic.pause(500)
        #robobit.goms(RBDirection.REVERSE, 40, 200)
        #robobit.rotatems(RBRobotDirection.RIGHT, 40, 400)
        turnDirection()
    else:
        serial.write_line("MOVING")
        robobit.led_rainbow() 
        basic.show_string("M")
        robobit.goms(RBDirection.FORWARD, 40, 1500)

def on_button_pressed_a():
    calibAvg = calibrate()
input.on_button_pressed(Button.A, on_button_pressed_a)

    
def on_forever():
    serial.write_value("Accel Z: ", input.acceleration(Dimension.Z))
    if calibDone:
        basic.show_string("/")
        moveAndAvoid()       
basic.forever(on_forever)