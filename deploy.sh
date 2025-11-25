#!/bin/bash

# ==========================================
# Universal Deployment Script
# ==========================================

echo "🚀 Starting Deployment Setup..."

# 1. Load Configuration
CONFIG_FILE="deploy.config"

if [ -f "$CONFIG_FILE" ]; then
    echo "📄 Found configuration file: $CONFIG_FILE"
    source "$CONFIG_FILE"
else
    echo "❌ Error: deploy.config not found. Please copy deploy.config.example to deploy.config and fill it in."
    exit 1
fi

# 2. Validate Configuration
if [[ -z "$SERVER_IP" || -z "$SERVER_USER" || -z "$SSH_KEY_PATH" || -z "$DOMAIN_NAME" || -z "$REPO_URL" ]]; then
    echo "❌ Error: Missing required configuration in deploy.config."
    exit 1
fi

echo "✅ Configuration loaded. Target: $SERVER_USER@$SERVER_IP"

# 3. Create Remote Script
cat <<EOF > remote_setup.sh
#!/bin/bash
set -e

# --- Variables ---
PROJECT_NAME=\$(basename "$REPO_URL" .git)
APP_DIR="/var/www/\$PROJECT_NAME"
echo "🔧 [Remote] Deploying \$PROJECT_NAME..."

# --- System Updates ---
echo "🔧 [Remote] Updating system packages..."
sudo apt-get update -y
# Install common dependencies
sudo apt-get install -y nodejs nginx git
# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# --- Database Setup (Optional) ---
if [ -n "$DB_NAME" ] && [ -n "$DB_USER" ] && [ -n "$DB_PASSWORD" ]; then
    echo "🔧 [Remote] Checking Database Configuration..."
    sudo apt-get install -y postgresql postgresql-contrib
    
    # Create DB if not exists
    sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
    # Create User if not exists
    sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';"
    # Grant privileges
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
fi

# --- Application Setup ---
echo "🔧 [Remote] Setting up Application Directory..."
sudo mkdir -p /var/www
sudo chown -R \$USER:\$USER /var/www

if [ -d "\$APP_DIR" ]; then
    echo "  - Repo exists, updating..."
    cd "\$APP_DIR"
    git fetch origin
    git reset --hard origin/$BRANCH
else
    echo "  - Cloning repository..."
    cd /var/www
    git clone -b $BRANCH $REPO_URL
    cd "\$APP_DIR"
fi

# --- Build & Start ---
if [ "$PROJECT_TYPE" == "fullstack" ]; then
    echo "🔧 [Remote] Building Fullstack App..."
    
    # Backend
    if [ -d "server" ]; then
        cd server
        npm install
        
        # Generate .env for backend
        if [ -n "$DB_NAME" ]; then
            echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\"" > .env
            echo "PORT=$APP_PORT" >> .env
        fi
        
        if [ -f "prisma/schema.prisma" ]; then
            npx prisma generate
            npx prisma migrate deploy
        fi
        
        # Start Backend
        pm2 restart \$PROJECT_NAME-api || pm2 start server.js --name "\$PROJECT_NAME-api"
        pm2 save
        cd ..
    fi
    
    # Frontend
    if [ -d "client" ]; then
        cd client
        npm install
        npm run build
        cd ..
    fi
    
    STATIC_ROOT="\$APP_DIR/client/$FRONTEND_DIST_DIR"
    
elif [ "$PROJECT_TYPE" == "static" ]; then
    echo "🔧 [Remote] Building Static Site..."
    npm install
    npm run build
    STATIC_ROOT="\$APP_DIR/$FRONTEND_DIST_DIR"
fi

# --- Nginx Configuration ---
echo "🔧 [Remote] Configuring Nginx..."

# Generate Nginx Config
cat <<NGINX | sudo tee /etc/nginx/sites-available/\$PROJECT_NAME
server {
    listen $NGINX_PORT;
    server_name $DOMAIN_NAME;

    root \$STATIC_ROOT;
    index index.html;

    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }

    # Proxy API requests if fullstack
    $(if [ "$PROJECT_TYPE" == "fullstack" ]; then
        echo "location /api/ {"
        echo "    proxy_pass http://localhost:$APP_PORT;"
        echo "    proxy_http_version 1.1;"
        echo "    proxy_set_header Upgrade \\\$http_upgrade;"
        echo "    proxy_set_header Connection 'upgrade';"
        echo "    proxy_set_header Host \\\$host;"
        echo "    proxy_cache_bypass \\\$http_upgrade;"
        echo "}"
    fi)
}
NGINX

# Enable Site
sudo ln -sf /etc/nginx/sites-available/\$PROJECT_NAME /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "🎉 [Remote] Deployment Complete!"
EOF

# 4. Execute Remote Script
chmod +x remote_setup.sh
scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no remote_setup.sh "$SERVER_USER@$SERVER_IP":~/remote_setup.sh
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "bash ~/remote_setup.sh"

# Cleanup
rm remote_setup.sh

echo ""
echo "✨ Deployment finished successfully!"
echo "🌍 Your app should be live at: http://$DOMAIN_NAME"
if [ "$NGINX_PORT" != "80" ]; then
    echo "   (Port: $NGINX_PORT)"
fi
