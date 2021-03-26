FROM node:current-alpine3.10
RUN mkdir -p /var/www/app
WORKDIR /var/www/app
RUN adduser app --disabled-password
COPY . .
RUN npm install
RUN chown -R app:app /var/www/app
USER app
EXPOSE 3000
CMD ["npm", "run", "start"]