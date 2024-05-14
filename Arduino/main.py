import serial
import time
import json

# Abre la conexión serial con Arduino
ard = serial.Serial('COM3', 9600)

while True:
    # Lee la última línea de datos del puerto serie
    datos = ard.readline().strip()

    # Si hay datos disponibles
    if datos:
        # Imprime los datos actuales
        print(datos)

    # Espera un tiempo antes de volver a leer los datos
    time.sleep(0.1)

