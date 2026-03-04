## 重新设置apt镜像源
```bash
#/etc/apt/sources.list
# 中科大 Ubuntu 镜像源 (适配jammy)

# 备份原有sources.list文件
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak

# 清空原有配置（也可保留注释，这里直接替换更干净）
sudo > /etc/apt/sources.list


# 写入中科大Ubuntu 22.04镜像源
sudo tee /etc/apt/sources.list <<-'EOF'
# 中科大 Ubuntu 22.04 (jammy) 镜像源
deb https://mirrors.ustc.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
deb https://mirrors.ustc.edu.cn/ubuntu/ jammy-security main restricted universe multiverse

# 可选：源码包（日常使用无需开启，注释掉）
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
# deb-src https://mirrors.ustc.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
EOF

#清理旧的 Docker 仓库配置（如有）
sudo rm -f /etc/apt/sources.list.d/docker.list

# 添加中科大Docker镜像源（适配jammy版本）
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu jammy stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 更新APT索引（此时会从科大源拉取Docker包信息）
sudo apt update

# 安装Docker核心组件
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动并设置开机自启
sudo systemctl enable --now docker

# 检查Docker状态
sudo systemctl status docker

# 创建Docker配置目录
sudo mkdir -p /etc/docker

# 写入镜像加速配置
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live",
    "https://hub.rat.dev"
  ]
}
EOF

# 重启Docker服务使配置生效
sudo systemctl restart docker

```