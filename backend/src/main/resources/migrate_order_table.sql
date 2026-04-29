-- 如果数据库中已经有 `order` 表（使用了保留字），执行此迁移脚本
-- 重命名表从 `order` 到 `orders`

USE wenchuang_shop;

-- 检查是否存在旧表并重命名
RENAME TABLE `order` TO orders;
