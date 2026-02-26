FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN node -e "const fs=require('fs'),p=require('path');const fix=d=>{fs.readdirSync(d).forEach(f=>{const fp=p.join(d,f);if(fs.statSync(fp).isDirectory())fix(fp);const nfc=f.normalize('NFC');if(f!==nfc)fs.renameSync(fp,p.join(d,nfc))})};fix('src/assets')"
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod -R a+r /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
