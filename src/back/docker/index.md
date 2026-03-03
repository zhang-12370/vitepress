## docker 基础命令
```bash
docker images # 查看本地镜像
docker ps -a # 查看本地容器
docker rm -f $(docker ps -a -q) # 删除所有容器
docker rmi -f $(docker images -q) # 删除所有镜像
docker run -d -p 8080:8080 --name myapp myapp:latest # 后台运行容器
docker exec -it myapp /bin/bash # 进入容器
docker search nginx # 搜索镜像
docker pull nginx # 拉取镜像
docker build -t myapp . # 构建镜像
docker run -d -p 8080:8080 --name myapp myapp:latest # 运行镜像
docker logs nginx # 查看容器日志

docker ps -a --format "table {{.ID}}\t{{.Status}}\t{{.Names}}\t{{.Image}}" # 查看容器状态

```

## docker 镜像源修改
```bash{10-12}
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

#-d表示静默启动
#-p设置端口
#-v表示目录的挂载（核心）
#--restart always 容器的重启策略
#尾部的nginx表指定镜像
```

## docker导出/导入
```bash
docker save -o myapp.tar myapp:latest # 导出镜像
docker load -i myapp.tar # 导入镜像
```
