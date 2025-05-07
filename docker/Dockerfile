FROM nginx:stable-alpine

# 拷贝打包后的静态资源
COPY html/dist/ /usr/share/nginx/html

# 拷贝自定义 nginx 配置
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
