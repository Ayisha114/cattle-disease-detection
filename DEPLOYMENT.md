# Deployment Guide - Cattle Disease Detection System

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended - Easiest)

Railway provides free hosting with MongoDB support.

**Steps:**

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
railway init
```

4. **Add MongoDB**
```bash
railway add
# Select MongoDB from the list
```

5. **Set Environment Variables**
```bash
railway variables set JWT_SECRET=your-secret-key
railway variables set SESSION_SECRET=your-session-secret
railway variables set GOOGLE_CLIENT_ID=your-google-id
railway variables set GOOGLE_CLIENT_SECRET=your-google-secret
railway variables set ML_API_URL=your-ml-api-url
```

6. **Deploy**
```bash
railway up
```

7. **Get Your URL**
```bash
railway domain
```

---

### Option 2: Heroku

**Steps:**

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login**
```bash
heroku login
```

3. **Create App**
```bash
heroku create cattle-detection-app
```

4. **Add MongoDB**
```bash
heroku addons:create mongolab:sandbox
```

5. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set SESSION_SECRET=your-session-secret
heroku config:set GOOGLE_CLIENT_ID=your-google-id
heroku config:set GOOGLE_CLIENT_SECRET=your-google-secret
heroku config:set ML_API_URL=your-ml-api-url
```

6. **Deploy**
```bash
git push heroku main
```

7. **Open App**
```bash
heroku open
```

---

### Option 3: AWS EC2

**Steps:**

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (free tier)
   - Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

2. **SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install MongoDB**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

5. **Clone Repository**
```bash
git clone https://github.com/Ayisha114/cattle-disease-detection.git
cd cattle-disease-detection
```

6. **Install Dependencies**
```bash
npm install
```

7. **Create .env File**
```bash
nano .env
# Add your environment variables
```

8. **Install PM2**
```bash
sudo npm install -g pm2
```

9. **Start Application**
```bash
pm2 start server.js --name cattle-api
pm2 startup
pm2 save
```

10. **Setup Nginx (Optional)**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

---

### Option 4: Vercel (Frontend Only)

For frontend deployment with serverless functions:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

---

## 🔧 Environment Variables Setup

### Required Variables

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-domain.com
MONGODB_URI=mongodb://your-mongodb-uri
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
ML_API_URL=http://your-ml-api-endpoint.com/predict
```

### Optional Variables (for Production OTP)

```env
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🤖 ML Model Deployment

### Option 1: Deploy Flask API on Railway

1. **Create `requirements.txt`**
```txt
flask
transformers
torch
pillow
```

2. **Create `app.py`** (see README for code)

3. **Deploy to Railway**
```bash
railway init
railway up
```

### Option 2: Deploy on AWS Lambda

Use AWS Lambda with API Gateway for serverless ML inference.

### Option 3: Use Hugging Face Inference API

Deploy your model to Hugging Face and use their inference API.

---

## 📊 Database Setup

### MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all)
5. Get connection string
6. Update `MONGODB_URI` in `.env`

### Local MongoDB

```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Use local URI
MONGODB_URI=mongodb://localhost:27017/cattle-detection
```

---

## 🔐 Security Checklist

- [ ] Change all default secrets in `.env`
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Use strong JWT secrets
- [ ] Configure CORS properly
- [ ] Set secure cookie flags in production
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

---

## 📈 Monitoring & Logging

### PM2 Monitoring

```bash
pm2 monit
pm2 logs cattle-api
```

### Setup Log Rotation

```bash
pm2 install pm2-logrotate
```

---

## 🔄 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 🆘 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### PM2 Issues
```bash
# Restart app
pm2 restart cattle-api

# Delete and restart
pm2 delete cattle-api
pm2 start server.js --name cattle-api
```

---

## 📞 Support

For deployment issues:
- Check logs: `pm2 logs cattle-api`
- GitHub Issues: [Create Issue](https://github.com/Ayisha114/cattle-disease-detection/issues)
- Email: support@example.com

---

**Happy Deploying! 🚀**