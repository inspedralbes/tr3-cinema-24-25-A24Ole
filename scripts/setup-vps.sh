#!/bin/bash

##############################################################################
# Cinema Production Server Setup Script
# 
# This script prepares a fresh VPS for deploying the Cinema application
# with Docker, GitHub Actions, and automated deployments.
#
# Usage: sudo bash setup-vps.sh
#
# Tested on: Ubuntu 20.04 LTS, 22.04 LTS
##############################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (customize these)
DEPLOY_USER="app"
DEPLOY_GROUP="app"
DEPLOY_HOME="/home/app"
PROJECT_PATH="/home/app/cinema"
GITHUB_REPO="your-username/tr3-cinema-24-25-A24Ole"  # Change this

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Cinema Production Server Setup                              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================================
# 1. UPDATE SYSTEM
# ============================================================================
echo -e "${YELLOW}[1/7] Updating system packages...${NC}"
apt-get update
apt-get upgrade -y
apt-get install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    net-tools \
    ufw \
    build-essential \
    certbot \
    python3-certbot-nginx

echo -e "${GREEN}✓ System updated${NC}"
echo ""

# ============================================================================
# 2. VERIFY DOCKER & DOCKER COMPOSE
# ============================================================================
echo -e "${YELLOW}[2/7] Checking Docker installation...${NC}"

# Check if Docker is already installed
if command -v docker &> /dev/null && docker --version &> /dev/null; then
    echo -e "${GREEN}✓ Docker already installed${NC}"
    docker --version
    
    # Check if Docker Compose v2 is installed
    if docker compose version &> /dev/null; then
        echo -e "${GREEN}✓ Docker Compose v2 already installed${NC}"
        docker compose version
    else
        echo -e "${YELLOW}Installing Docker Compose v2...${NC}"
        apt-get install -y docker-compose-plugin 2>/dev/null || true
        if docker compose version &> /dev/null; then
            echo -e "${GREEN}✓ Docker Compose v2 installed${NC}"
        fi
    fi
else
    echo -e "${YELLOW}Docker not found or not working. Installing...${NC}"
    
    # Fix any broken packages first
    echo -e "${YELLOW}Fixing broken packages...${NC}"
    apt-get --fix-broken install -y 2>/dev/null || true
    apt-get autoremove -y 2>/dev/null || true
    apt-get clean 2>/dev/null || true
    
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh 2>/dev/null
    if [ -f get-docker.sh ]; then
        bash get-docker.sh
        rm get-docker.sh
        
        # Add user to docker group if running as non-root
        if [ ! -z "$SUDO_USER" ]; then
            usermod -aG docker $SUDO_USER || true
        fi
        
        echo -e "${GREEN}✓ Docker installed${NC}"
        docker --version
    else
        echo -e "${RED}✗ Failed to download Docker installation script${NC}"
        exit 1
    fi
fi

echo ""

# ============================================================================
# 3. CREATE DEPLOYMENT USER
# ============================================================================
echo -e "${YELLOW}[3/7] Creating deployment user...${NC}"

if id "$DEPLOY_USER" &>/dev/null; then
    echo -e "${YELLOW}User '$DEPLOY_USER' already exists, skipping creation${NC}"
else
    useradd -m -s /bin/bash -d "$DEPLOY_HOME" "$DEPLOY_USER"
    usermod -aG docker "$DEPLOY_USER"
    echo -e "${GREEN}✓ User '$DEPLOY_USER' created${NC}"
fi

# Configure sudoers for deployment user (allow docker commands without password)
cat > /etc/sudoers.d/docker-compose << EOF
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose, /usr/bin/systemctl
EOF
chmod 440 /etc/sudoers.d/docker-compose

echo -e "${GREEN}✓ Deployment user configured${NC}"
echo ""

# ============================================================================
# 4. SETUP SSH KEYS
# ============================================================================
echo -e "${YELLOW}[4/7] Setting up SSH key configuration...${NC}"

SSH_DIR="$DEPLOY_HOME/.ssh"
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"

# Create authorized_keys file
touch "$SSH_DIR/authorized_keys"
chmod 600 "$SSH_DIR/authorized_keys"

chown -R "$DEPLOY_USER:$DEPLOY_GROUP" "$SSH_DIR"

echo -e "${GREEN}✓ SSH directory configured${NC}"
echo -e "${YELLOW}⚠ IMPORTANT: Add GitHub Actions public key to ~/.ssh/authorized_keys${NC}"
echo -e "${YELLOW}  Or provide an SSH public key to add for deployment${NC}"
echo ""

# ============================================================================
# 5. CLONE REPOSITORY
# ============================================================================
echo -e "${YELLOW}[5/7] Cloning repository...${NC}"

sudo -u "$DEPLOY_USER" -H bash << SUDOBASH
    cd "$DEPLOY_HOME"
    
    # If directory already exists, update it instead
    if [ -d "$PROJECT_PATH" ]; then
        echo "Project directory exists, updating..."
        cd "$PROJECT_PATH"
        git pull origin main
    else
        echo "Cloning repository..."
        git clone "https://github.com/$GITHUB_REPO.git" cinema
        cd cinema
    fi
    
    # Create .env from .env.example
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "⚠️  Edit .env with production values:"
        echo "    sudo nano $PROJECT_PATH/.env"
    fi

SUDOBASH

echo -e "${GREEN}✓ Repository cloned/updated${NC}"
echo ""

# ============================================================================
# 6. CONFIGURE FIREWALL
# ============================================================================
echo -e "${YELLOW}[6/7] Configuring firewall (UFW)...${NC}"

# Enable UFW
ufw --force enable

# Allow SSH (CRITICAL - don't lock yourself out!)
ufw allow 22/tcp comment "SSH"

# Allow HTTP and HTTPS
ufw allow 80/tcp comment "HTTP"
ufw allow 443/tcp comment "HTTPS"

# Show rules
ufw status

echo -e "${GREEN}✓ Firewall configured${NC}"
echo ""

# ============================================================================
# 7. CREATE SYSTEMD SERVICE FOR AUTO-START
# ============================================================================
echo -e "${YELLOW}[7/7] Creating systemd service for auto-start...${NC}"

cat > /etc/systemd/system/cinema.service << 'SYSTEMD'
[Unit]
Description=Cinema Docker Compose Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
User=app
WorkingDirectory=/home/app/cinema
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down
RemainAfterExit=yes
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SYSTEMD

systemctl daemon-reload
systemctl enable cinema.service

echo -e "${GREEN}✓ Systemd service created${NC}"
echo ""

# ============================================================================
# SUMMARY AND NEXT STEPS
# ============================================================================
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Setup Complete! Next Steps:                                ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}1. Configure Environment Variables${NC}"
echo "   sudo nano $PROJECT_PATH/.env"
echo "   Edit with your production values (database, email, domain, etc.)"
echo ""
echo -e "${GREEN}2. Generate Laravel App Key${NC}"
echo "   cd $PROJECT_PATH"
echo "   docker-compose -f docker-compose.prod.yml exec backend php artisan key:generate --show"
echo "   Copy the key and add it to .env as APP_KEY"
echo ""
echo -e "${GREEN}3. Add SSH Public Key for GitHub Actions${NC}"
echo "   1. Generate a keypair on your local machine (if you don't have one):"
echo "      ssh-keygen -t rsa -b 4096 -f ~/.ssh/github-cinema -C 'GitHub Actions'"
echo "   2. Add the public key to authorized_keys:"
echo "      cat ~/.ssh/github-cinema.pub | sudo tee -a $SSH_DIR/authorized_keys"
echo "   3. Add private key to GitHub repository secrets:"
echo "      Settings → Secrets → New Secret"
echo "      Name: DEPLOY_SSH_KEY"
echo "      Value: (paste private key content)"
echo ""
echo -e "${GREEN}4. Configure GitHub Actions Secrets${NC}"
echo "   In your GitHub repository settings, add:"
echo "   - DEPLOY_HOST: $(hostname -I | awk '{print \$1}')"
echo "   - DEPLOY_USER: $DEPLOY_USER"
echo "   - DEPLOY_PORT: 22 (or your SSH port)"
echo "   - DEPLOY_PATH: $PROJECT_PATH"
echo "   - GITHUB_TOKEN: (auto-provided by GitHub)"
echo "   - SLACK_WEBHOOK_URL: (optional, for notifications)"
echo ""
echo -e "${GREEN}5. Start Services for First Time${NC}"
echo "   cd $PROJECT_PATH"
echo "   # Create initial volumes"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo "   # Run migrations"
echo "   docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force"
echo ""
echo -e "${GREEN}6. Save Important Information${NC}"
echo "   • Database credentials from .env"
echo "   • SSH key used for deployment"
echo "   • App key from Laravel"
echo "   Store in a secure password manager"
echo ""
echo -e "${BLUE}System Information:${NC}"
echo "   IP Address: $(hostname -I | awk '{print \$1}')"
echo "   Server Name: $(hostname)"
echo "   Deploy User: $DEPLOY_USER"
echo "   Project Path: $PROJECT_PATH"
echo "   Timezone: $(timedatectl show -p Timezone --value)"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo "   # View logs"
echo "   cd $PROJECT_PATH"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "   # View running containers"
echo "   docker ps"
echo ""
echo "   # Restart all services"
echo "   docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "   # Run artisan commands"
echo "   docker-compose -f docker-compose.prod.yml exec backend php artisan [command]"
echo ""
echo -e "${GREEN}✅ Setup script completed successfully!${NC}"
