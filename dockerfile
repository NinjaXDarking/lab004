FROM node:18-bullseye

#Carpeta donde se quiere que trabaje
WORKDIR /app

#Puerto en el que queremos que corra
EXPOSE 3000


#Copiamos origen. hasta . los puntos (..) indican que copian todo a la carpeta app
COPY . . 

#Dejamos que se descarguen todas las librerias del proyecto
RUN npm install

#Comando para la ejecución del proyecto
CMD ["npm", "start"]