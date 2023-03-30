FROM node:current-alpine
# Installs latest Chromium (100) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont
RUN mkdir -p /app
WORKDIR /app

ADD package*.json /app/
RUN yarn install --silent
ADD . /app
      
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
CMD /usr/sbin/crond -b -l 0 -c /app/cronService -L /var/log/cron.log && yarn start