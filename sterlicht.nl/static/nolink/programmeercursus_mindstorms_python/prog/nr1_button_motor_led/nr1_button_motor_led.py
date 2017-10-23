#!/usr/bin/python3

import ev3dev.ev3 as e3

import time

button = e3.Button ()
touch = e3.TouchSensor ('in1')
motor = e3.LargeMotor ('outA')

while True:
    if touch.value ():
        e3.Leds.set_color (e3.Leds.LEFT, e3.Leds.GREEN)
        motor.run_direct (duty_cycle_sp = 100)
    else:
        e3.Leds.all_off ()
        motor.reset ()
        
    if button.enter:
        break
        
    time.sleep (0.1)
