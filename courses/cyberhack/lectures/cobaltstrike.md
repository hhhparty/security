# Colbat Strike

## Team Infrastructure
3类server
### Staging servers
- Host client-side attacks and initial callbacks
- Initial privilege escalation + install persistence
- Expect these servers to get caught ... quickliy

### Long Hual Servers
- Low and slow persistent callbacks
- Pass accesses to post-exploitation as needed

### Post-Exploitation Servers

- post-exp and lateral movement


## Scaling Red Options

### 目标单元 Target Cells
- 对在特定网络上的目标可以响应
- 获得访问，post-exp 活动和横向扩展
- 维持完成这些任务的本地架构

### 访问管理单元 Access Management Cell
- 控制所有网络的访问
- 获取访问和接受来自cells的访问
- 按需传递、通过访问到目标cells
- 为持久化回调   维持全局架构
