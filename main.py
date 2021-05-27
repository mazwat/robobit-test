
robobit.select_model(RBModel.Mk3)
#robobit.go(RBDirection.FORWARD, 60)
#robobit.rb_enable_bluetooth(RBBluetooth.BT_ENABLE)
#robobit.rotate(RBRobotDirection.LEFT, 60)
input.set_accelerometer_range(AcceleratorRange.FOUR_G)
robobit.led_rainbow()
distance = 0
accelZ = 0
accelY = 0

def calibrate():                  
    sampleMax = 0
    sampleMin = 0
    calibSample = [] 
    calibSampleSize = 100
    basic.show_string("C") 
    for i in range(calibSampleSize):
        calibSample.append(input.acceleration(Dimension.Z)) 
        basic.pause(100)
        
    #sampleMax = max(calibSample)
    for value in calibSample:
        if value > sampleMax:
            sampleMax = value
        if value < sampleMin:
            sampleMin = value  
    return [sampleMin, sampleMax]     

calibValues = calibrate()
def on_forever():
           
    distance = robobit.sonar(RBPingUnit.Centimeters);    
    accelZ = input.acceleration(Dimension.Z) 

    #led.plot_bar_graph(input.acceleration(Dimension.Z), 1023)
    serial.write_value("min: ", calibValues[0])
    serial.write_value("max: ", calibValues[1])
    serial.write_value("distance: ", distance)
    if distance <= 8 and accelZ >= calibValues[0] and accelZ <= calibValues[1]:
        serial.write_line("NEAR OBSTACLE")
        basic.show_string("O")
        robobit.stop(RBStopMode.BRAKE)
        basic.pause(1000)
        robobit.goms(RBDirection.REVERSE, 50, 400)
        robobit.rotatems(RBRobotDirection.LEFT, 60, 400)
    else:
        serial.write_line("MOVING")
        basic.show_string("M")
        robobit.go(RBDirection.FORWARD, 50)
basic.forever(on_forever)
