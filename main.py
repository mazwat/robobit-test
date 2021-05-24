
robobit.select_model(RBModel.Mk3)
#robobit.go(RBDirection.FORWARD, 60)
#robobit.rb_enable_bluetooth(RBBluetooth.BT_ENABLE)
#robobit.rotate(RBRobotDirection.LEFT, 60)
input.set_accelerometer_range(AcceleratorRange.FOUR_G)
robobit.led_rainbow()
distance = 0
accelZ = 0
accelY = 0
strength2D = 0

def on_forever():
    #robobit.startScanner(0xffff00, 100);
    robobit.go(RBDirection.FORWARD, 50)
    distance = robobit.sonar(RBPingUnit.Centimeters);
    #basic.show_string(str(distance))
    if (distance <= 6):
        robobit.stop(RBStopMode.BRAKE)
        robobit.goms(RBDirection.REVERSE, 50, 400)
        basic.pause(1000) 
        robobit.rotatems(RBRobotDirection.LEFT, 60, 400)
    #basic.show_number(input.acceleration(Dimension.Y)) 
    accelZ = input.acceleration(Dimension.Z) 
    accelY = input.acceleration(Dimension.Z) 
    strength = Math.sqrt((accelZ * accelZ) + (accelY * accelY))        
    serial.write_line("Strength: "+str(strength))
    serial.write_line("accel Y: "+str(accelY))
    serial.write_line("accel Z: "+str(accelZ))
basic.forever(on_forever)