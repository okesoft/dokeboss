FROM node:20.15

RUN apt-get update && apt-get install -y imagemagick ffmpeg python3-pip python3-uno && apt-get clean
RUN python3 -mpip install unoserver --break-system-packages
RUN mkdir -p /app
WORKDIR /app
COPY . .


RUN npm install
RUN npx puppeteer browsers install chrome
RUN npx tsc

ENTRYPOINT ["npm", "run", "serve"]