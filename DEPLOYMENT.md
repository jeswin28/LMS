# LMS Production Deployment Guide

## Quick Start

1. **Run the setup script:**
```bash
chmod +x setup.sh
./setup.sh
```

2. **Configure database:**
Edit `lms-backend/config/config.env` with your database credentials.

3. **Initialize database:**
```bash
cd lms-backend
npm run data:import
```

4. **Start the application:**
```bash
# Terminal 1 - Backend
cd lms-backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## Production Deployment

### Environment Variables

Create production environment file:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_super_secure_jwt_secret
JWT_EXPIRE=7d
MAX_FILE_UPLOAD=50000000
FRONTEND_URL=https://yourdomain.com
```

### Database Setup

1. Create PostgreSQL database
2. Update connection string in config
3. Run migrations: `npm run db:migrate`
4. Seed admin user: `npm run data:import`

### File Permissions

```bash
chmod -R 755 lms-backend/uploads
chown -R www-data:www-data lms-backend/uploads
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/project/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    location /uploads {
        alias /path/to/project/lms-backend/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### PM2 Process Management

```bash
# Install PM2
npm install -g pm2

# Start backend with PM2
cd lms-backend
pm2 start server.js --name "lms-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

### SSL Certificate

```bash
# Using Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Docker Deployment

### Dockerfile for Backend

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Dockerfile for Frontend

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: lms_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./lms-backend
    environment:
      DATABASE_URL: postgresql://postgres:password123@postgres:5432/lms_db
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    volumes:
      - ./lms-backend/uploads:/app/uploads

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up file upload limits
- [ ] Enable database SSL
- [ ] Configure firewall
- [ ] Set up monitoring
- [ ] Enable logging
- [ ] Regular backups

## Monitoring

### Health Check Endpoint

```javascript
// Add to server.js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
```

### Logging

```bash
# Install winston for logging
npm install winston

# Configure in server.js
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Backup Strategy

### Database Backup

```bash
# Daily backup script
pg_dump -h localhost -U postgres lms_db > backup_$(date +%Y%m%d).sql
```

### File Backup

```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz lms-backend/uploads/
```

## Performance Optimization

1. **Database Indexing**
2. **CDN for static files**
3. **Redis for caching**
4. **Image optimization**
5. **Database connection pooling**
6. **Compression middleware**

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check credentials in config.env
   - Verify PostgreSQL is running
   - Check firewall settings

2. **File upload issues**
   - Check directory permissions
   - Verify file size limits
   - Check disk space

3. **CORS errors**
   - Update FRONTEND_URL in config
   - Check nginx configuration

### Logs Location

- Backend logs: `lms-backend/logs/`
- Nginx logs: `/var/log/nginx/`
- PM2 logs: `~/.pm2/logs/`

## Support

For deployment issues, check:
1. Application logs
2. Database connectivity
3. File permissions
4. Environment variables
5. Network configuration