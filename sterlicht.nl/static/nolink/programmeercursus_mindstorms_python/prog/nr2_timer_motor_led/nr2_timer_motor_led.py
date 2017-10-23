#!/usr/bin/python3

import time as tm

import ev3dev.ev3 as e3

e3.Leds.all_off ()

button = e3.Button ()
touch = e3.TouchSensor ('in1')
motor = e3.LargeMotor ('outA')

startTime = 0

while True:
    currentTime = tm.time ()
    
    if touch.value ():    
        startTime = currentTime
        
    if currentTime - startTime < 3:  
        e3.Leds.set_color (e3.Leds.LEFT, e3.Leds.RED)
        motor.run_direct (duty_cycle_sp = 100)
    else:
        e3.Leds.set_color (e3.Leds.LEFT, e3.Leds.GREEN)
        motor.reset ()
        
    if button.enter:
        break
        
    tm.sleep (0.1)