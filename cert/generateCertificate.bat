@echo off
REM Genera clave privada
openssl genrsa -out key.pem 2048

REM Genera solicitud de certificado (CSR)
openssl req -new -key key.pem -out cert.csr -subj "/C=ES/ST=Cantabria/L=Cabezon de la Sal/O=JAIME/OU=TON/CN=ToDo-app"

REM Genera certificado autofirmado
openssl x509 -req -days 365 -in cert.csr -signkey key.pem -out cert.pem

REM Genera un certificado confiado por el navegador
cat cert.pem intermediate.pem > fullchain.pem

REM Muestra información del certificado
openssl x509 -in cert.pem -text -noout

echo.
echo Certificados generados en la carpeta cert.
pause