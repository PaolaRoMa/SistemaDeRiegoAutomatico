import serial
import requests
import time

# Abre el puerto serie (cambia 'COM3' por el puerto correcto en tu sistema)
try:
    ser = serial.Serial('COM3', 9600)
    print("Puerto serie abierto correctamente.")
except serial.SerialException as e:
    print("Error al abrir el puerto serie:", e)
    exit()

# URL de tu servidor web donde manejas los datos de humedad
url = 'http://localhost:3000/humidity'

def enviar_comando_regar():
    ser.write(b'REGAR\n')
    print("Comando REGAR enviado.")

try:
    while True:
        try:
            # Lee una línea de datos del puerto serie y elimina los espacios en blanco y el carácter de nueva línea
            humedad = ser.readline().strip().decode('utf-8').strip()

            # Imprime el valor de humedad leído
            print('Valor de humedad leído:', humedad)

            # Envía los datos de humedad al servidor web solo si hay datos válidos
            if humedad:
                payload = {'humidity': humedad}
                response = requests.post(url, data=payload)
                # Imprime la respuesta del servidor (para propósitos de depuración)
                print('Respuesta del servidor:', response.text)
            else:
                print('Datos de humedad no válidos.')

        except Exception as e:
            print("Error:", e)

        # Agrega un tiempo de espera entre lecturas para evitar sobrecargar el servidor
        time.sleep(1)

finally:
    # Asegúrate de cerrar el puerto serie al salir del bucle
    ser.close()
    print("Puerto serie cerrado.")
