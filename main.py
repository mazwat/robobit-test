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

def calibrate():   
    # This calibrates the accelermometer to detect if the robot has come to a stop               
    sampleMax = 0
    sampleMin = 0
    calibSample = [] 
    calibSampleSize = 100
    basic.show_string("C")
    robobit.go(RBDirection.FORWARD, 50) 
    # Push a series of samples of the accelerometer into an array, to detect a broad range of changing movements
    for i in range(calibSampleSize):
        calibSample.append(input.acceleration(Dimension.Z)) 
        #serial.write_value("values: ", calibSample[i])
        basic.pause(50)
    # Get average of sample values
    figure = 0
    for i in range (calibSampleSize):
        figure += calibSample[i]       
    average = figure / calibSampleSize
    robobit.stop(RBStopMode.BRAKE)
    robobit.goms(RBDirection.REVERSE, 50, 1000)
    basic.show_string("D")
    global calibDone
    calibDone = True
    #serial.write_value("Calibration done: ", calibDone)
    #Calculate the min and max values for the accelerometer. How much it is moving while it is revving against a wall or an object
    serial.write_numbers(calibSample)
    for value in calibSample:
        if value > sampleMax:
            sampleMax = value                  
        if value < sampleMin:
            sampleMin = value            
    #serial.write_value("Min: ", sampleMin)
    #serial.write_value("Max: ", sampleMax)
    serial.write_value("Average", average)
    #return [sampleMin, sampleMax]
    return average 




def moveAndAvoid():       
    distance = robobit.sonar(RBPingUnit.Centimeters);    
    accelZ = input.acceleration(Dimension.Z) 
    #led.plot_bar_graph(input.acceleration(Dimension.Z), 1023)
    #serial.write_value("min: ", calibValues[0])
    #serial.write_value("max: ", calibValues[1])
    serial.write_value("distance: ", distance)
    if distance <= 15 :
        robobit.led_clear()
        serial.write_line("NEAR OBSTACLE")
        basic.show_string("O")
        robobit.stop(RBStopMode.BRAKE)
        basic.pause(500)
        robobit.goms(RBDirection.REVERSE, 50, 200)
        robobit.rotatems(RBRobotDirection.LEFT, 60, 400)
    elif accelZ >= calibAvg - 8 and accelZ <= calibAvg + 8:
        robobit.led_clear()
        serial.write_line("STATIONARY")
        basic.show_string("S")
        robobit.stop(RBStopMode.BRAKE)
        basic.pause(500)
        robobit.goms(RBDirection.REVERSE, 50, 200)
        robobit.rotatems(RBRobotDirection.RIGHT, 60, 400)
    else:
        serial.write_line("MOVING")
        robobit.led_rainbow() 
        basic.show_string("M")
        robobit.go(RBDirection.FORWARD, 50)

def on_button_pressed_a():
    calibAvg = calibrate()
input.on_button_pressed(Button.A, on_button_pressed_a)

    
def on_forever():
    serial.write_value("Accel Z: ", input.acceleration(Dimension.Z))
    if calibDone:
        basic.show_string("/")
        moveAndAvoid()       
basic.forever(on_forever)