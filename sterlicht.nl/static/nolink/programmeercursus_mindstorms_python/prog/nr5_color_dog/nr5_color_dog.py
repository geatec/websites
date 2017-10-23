#!/usr/bin/python3

import time as tm
import ev3dev.ev3 as e3

english, native = 0, 1

forward = 40
reverse = -40

def tell (message):
    print (message)
    e3.Sound.speak (message)

movable = True
def run (motor, speed):
    global movable
    
    if movable:
        motor.run_direct (duty_cycle_sp = speed)
    
e3.Leds.all_off ()
  
button = e3.Button ()
motorLeft = e3.LargeMotor ('outA')
motorRight = e3.LargeMotor ('outD')

motorHead = e3.LargeMotor ('outC')
motorHead.reset ()

motorTail = e3.LargeMotor ('outB')
motorTail.reset ()

colorSensor = e3.ColorSensor  ('in4')
colorSensor.mode = 'COL-COLOR'

void, black, blue, green, yellow, red, white, brown = range (8)
colorNames = ('void', 'black', 'blue', 'green', 'yellow', 'red', 'white', 'brown')

ultrasonicSensor = e3.UltrasonicSensor ('in1')
ultrasonicSensor.mode = 'US-DIST-CM'

state = 'initial'
reverseTime = 0
soundTime = 0

e3.Sound.speak ('Hi, I\'m Tuffy. I say tuff, tuff, tuff!')
tm.sleep (4)

while True:
    currentTime = tm.time ()
    color = colorSensor.value ()
    distance = ultrasonicSensor.value ()
    
    obstacle = 20 < distance < 40
    
    if motorHead.position < -90:
        run (motorHead, 20)
    elif motorHead.position > 90:
        run (motorHead, -20) 
        
    if motorTail.position < -20:
        run (motorTail, 20)
    elif motorTail.position > 20:
        run (motorTail, -20)   
            
    if button.up or (color == green and -45 < motorHead.position < 45):
        state = 'forward'
        run (motorRight, forward)
        run (motorLeft, forward) 
    elif button.left or (color == green and motorHead.position > 45):
        state = 'left'
        run (motorLeft, reverse)
        run (motorRight, forward)
    elif button.right or (color == green and motorHead.position < -45):
        state = 'right'
        run (motorLeft, forward)
        run (motorRight, reverse)
    elif button.down or color == red:
        state = 'reverse'
        reverseTime = currentTime
        run (motorLeft, reverse)
        run (motorRight, reverse)
    elif button.enter:
        movable = not movable
        if movable:
            run (motorHead, 40)
            run (motorTail, 100)
            state = 'start'
        else:
            state = 'stop'
    elif (
        (state == 'reverse' and color != red and currentTime - reverseTime > 1) or
        (state in {'forward', 'left', 'right'} and obstacle)
    ):
        run (motorLeft, 0)
        run (motorRight, 0)
        state = 'pause'
    
    print ('State:', state, 'Color:', colorNames [color], 'Obstacle:', obstacle)
    
    if currentTime - soundTime > 1 and color != void:
        e3.Sound.speak (colorNames [color])
        soundTime = currentTime
    
    if button.backspace:
        motorLeft.reset ()
        motorRight.reset ()
        motorHead.reset ()
        motorTail.reset ()
        break;
        
    tm.sleep (0.1)
    
e3.Sound.speak ('Farewell, au revoir, sayonara, tot ziens!') 
tm.sleep (2)   
    


