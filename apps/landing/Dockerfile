FROM nginx:stable-alpine

RUN sed -i '1idaemon off;' /etc/nginx/nginx.conf

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist ./app/
COPY ./docker/entrypoint.sh /entrypoint.sh

# Make sure the script is executable
RUN chmod +x /entrypoint.sh

# Set environment variable with default value
ENV MAIN_APP_URL=http://backend:3000

# Use the entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx"]