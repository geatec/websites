#!/usr/bin/python3

import time as tm

import ev3dev.ev3 as e3

print ('Program started')
e3.Leds.all_off ()
e3.Leds.set_color (e3.Leds.LEFT, e3.Leds.GREEN)
        
button = e3.Button ()
touch = e3.TouchSensor ('in1')
motor = e3.LargeMotor ('outA')

startTime = 0
isActive = False

while True:
    currentTime = tm.time ()
    
    if touch.value ():    
        startTime = currentTime
    
    wasActive = isActive
    isActive = currentTime - startTime < 3
       
    if isActive and not wasActive:
        print ('Activated')
        e3.Leds.set_color (e3.Leds.LEFT, e3.Leds.RED)
        motor.run_direct (duty_cycle_sp = 100)
        
    if not isActive and wasActive:
        print ('Deactivated')
        e3.Leds.set_color (e3.Leds.LEFT, e3.Leds.GREEN)
        motor.reset ()
        
    if button.enter:
        break
        
    tm.sleep (0.1)
    
