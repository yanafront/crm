FROM node:14-alpine as builder
ARG VUE_APP_URL
ARG VUE_APP_STRIPE_PK
ENV VUE_APP_URL=${VUE_APP_URL}
ENV VUE_APP_STRIPE_PK=${VUE_APP_STRIPE_PK}
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
