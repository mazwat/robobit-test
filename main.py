
robobit.select_model(RBModel.Mk3)
#robobit.go(RBDirection.FORWARD, 60)
#robobit.rb_enable_bluetooth(RBBluetooth.BT_ENABLE)
#robobit.rotate(RBRobotDirection.LEFT, 60)
input.set_accelerometer_range(AcceleratorRange.FOUR_G)
robobit.led_rainbow()
distance = 0
accelZ = 0
accelY = 0
calibSample = [0] 
calibSampleSize = 20
calibDone = False

def calibrateAccel(number:number):                   
    sampleMax = 0
    sampleMin = 0
    if len(calibSample) < calibSampleSize:
        calibSample.append(number)  
    #sampleMax = max(calibSample)
    for value in calibSample:
        if value > sampleMax:
            sampleMax = value
        if value < sampleMin:
            sampleMin = value
    serial.write_value("Max : ", sampleMax)
    serial.write_value("Min : ", sampleMin)
    serial.write_value("Length : ", len(calibSample))          


def on_forever():

    for i in range(calibSampleSize):
        calibrateAccel(input.acceleration(Dimension.Z))
        basic.pause(100)
    #robobit.startScanner(0xffff00, 100);
    #robobit.go(RBDirection.FORWARD, 50)
    #distance = robobit.sonar(RBPingUnit.Centimeters);    
    #basic.show_number(distance)
    #if (distance <= 6):
        #robobit.stop(RBStopMode.BRAKE)
        ##robobit.goms(RBDirection.REVERSE, 50, 400)
        #basic.pause(1000) 
        #robobit.rotatems(RBRobotDirection.LEFT, 60, 400)
    #basic.show_number(input.acceleration(Dimension.Y)) 
    #accelX = input.acceleration(Dimension.X) 
    #strength = input.acceleration(Dimension.STRENGTH)        
    #serial.write_value("strength: ", strength)
    #serial.write_value("accel X: ", accelX)
    #serial.write_value("strength3D: ", input.acceleration(Dimension.STRENGTH))
    #serial.write_value("distance: ", distance)
    #led.plot_bar_graph(accelZ, 1023)
    #serial.write_value("accel Z: ", accelZ)
    #if input.acceleration(Dimension.STRENGTH) >= 1023 and input.acceleration(Dimension.STRENGTH) <= 1049 and distance <= 4 :
        #serial.write_line("STATIONARY")
    #else:
        #serial.write_line("MOVING")
basic.forever(on_forever)
