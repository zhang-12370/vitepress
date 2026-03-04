## 多个git的SSH映射

### 一、先确认配置文件的位置和完整性

#### 基础文件结构（Windows环境） 放到C:\Users\用户\.ssh\config

```powershell
# 全局配置（可选，优化SSH连接）
Host *
  # 关闭DNS反向解析，加快连接速度
  UseDNS no
  # 连接超时时间（秒）
  ConnectTimeout 10
  # 优先使用ED25519算法，兼容更多场景
  HostKeyAlgorithms +ssh-ed25519,ssh-rsa
  PubkeyAcceptedKeyTypes +ssh-ed25519,ssh-rsa

# 配置1：13012008451密钥 → Gitee账号1（别名：gitee-zhang）
Host gitee-zhang
  HostName gitee.com
  User git
  # 私钥路径（必须和你实际的文件路径一致）
  IdentityFile C:\Users\ZN\.ssh\13012008451
  # 强制使用指定私钥，解决多密钥冲突
  IdentitiesOnly yes
  # 仅用公钥认证，避免密码/键盘交互干扰
  PreferredAuthentications publickey

# 配置2：ZTSP密钥 → Gitee账号2（别名：gitee-ZTSP）
Host gitee-ZTSP
  HostName gitee.com
  User git
  # 私钥路径（核心！确认文件存在）
  IdentityFile C:\Users\ZN\.ssh\ZTSP
  # 强制使用ZTSP私钥，不混用其他密钥
  IdentitiesOnly yes
  # 仅公钥认证
  PreferredAuthentications publickey
```

#### 步骤 1：检查关键文件是否存在（PowerShell 中执行）

```powershell{2,6,10-11}
# 1. 检查主SSH配置文件（通常是~/.ssh/config）
ls ~/.ssh/config
# 正常输出：能看到config文件（包含你贴的这些配置）

# 2. 检查被Include的配置文件（如果有）
ls C:\Users\ZN\.devenv\.ssh\config
# 如果这个文件不存在，可忽略（重点是~/.ssh/config里的配置）

# 3. 检查两个私钥文件是否存在（核心！）
ls C:\Users\ZN\.ssh\13012008451
ls C:\Users\ZN\.ssh\ZTSP
# 正常输出：能看到这两个私钥文件，否则需要恢复备份的私钥
```

### 二、让配置生效的核心步骤

#### 步骤 1：恢复私钥文件（如果缺失）

#### 如果13012008451/ZTSP这两个私钥文件不存在，需要从重装系统前的备份中复制到C:\Users\ZN\.ssh\目录下；如果已存在，跳过这一步。

### 步骤 2：设置私钥文件的正确权限（Windows 必做）

Windows 下 SSH 会拒绝使用权限过宽的私钥，必须设置为仅当前用户可访问：

```powershell{2-3,5-6,9-10}
# 给两个私钥文件设置权限
icacls C:\Users\ZN\.ssh\13012008451 /inheritance:r
icacls C:\Users\ZN\.ssh\13012008451 /grant:r "${env:USERNAME}:F"

icacls C:\Users\ZN\.ssh\ZTSP /inheritance:r
icacls C:\Users\ZN\.ssh\ZTSP /grant:r "${env:USERNAME}:F"

# 给.ssh目录设置权限（可选，但建议做）
icacls C:\Users\ZN\.ssh /inheritance:r
icacls C:\Users\ZN\.ssh /grant:r "${env:USERNAME}:(OI)(CI)F"
```

### 步骤 3：启动 SSH 代理并加载私钥

```powershell{2-3,6-7,10}
# 1. 以管理员身份启动SSH代理服务（确保开机自启）
Set-Service ssh-agent -StartupType Automatic
Start-Service ssh-agent

# 2. 加载两个私钥到SSH代理
ssh-add C:\Users\ZN\.ssh\13012008451
ssh-add C:\Users\ZN\.ssh\ZTSP

# 3. 验证密钥是否加载成功（能看到两个密钥的指纹）
ssh-add -l

```

### 步骤 4：测试两个 Gitee 账号的 SSH 连接

```powershell{2,5}
# 测试账号1：gitee-zhang（对应13012008451密钥）
ssh -T gitee-zhang

# 测试账号2：gitee-ZTSP（对应ZTSP密钥）
ssh -T gitee-ZTSP

✅ 成功输出（每个账号测试都会返回对应 Gitee 用户名）：
Hi 你的Gitee用户名! You've successfully authenticated, but GITEE.COM does not provide shell access.

```

