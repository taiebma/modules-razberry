import sys
import socket
zone = str(sys.argv[2])
port = int(sys.argv[3])
addr = (zone, port)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # Create socket
sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
sock.settimeout(2.0)

eventString = str(sys.argv[1])
payloadString = ''

try:
    for i in range(5):
        sock.sendto('GCMNOTIF:' + eventString, addr)
        time.sleep(2.0)
    sock.close()
    sys.exit(0)
except:
    sock.close()
    sys.exit(0)

