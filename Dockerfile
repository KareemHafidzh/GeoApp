FROM maptiler/tileserver-gl:latest
COPY ./data/mbtiles /data
EXPOSE 8080
CMD ["--config", "/data/config.json", "--port", "8080"]