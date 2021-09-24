FROM nginx:alpine
COPY dist/final-app/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
