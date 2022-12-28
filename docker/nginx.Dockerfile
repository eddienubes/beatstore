FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3002
ENV NGINX_PORT=3002
CMD ["nginx", "-g", "daemon off;"]


