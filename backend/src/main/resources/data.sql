USE wenchuang_shop;

-- 插入管理员账户 (密码: admin123)
INSERT INTO user (username, password, nickname, role, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', '管理员', 'ROLE_ADMIN', 1);

-- 插入测试用户 (密码: 123456)
INSERT INTO user (username, password, nickname, email, phone, role, status) VALUES
('user1', '$2a$10$.Zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', '文艺青年', 'user1@example.com', '13800138001', 'ROLE_USER', 1),
('user2', '$2a$10$.Zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', '创意达人', 'user2@example.com', '13800138002', 'ROLE_USER', 1);

-- 插入分类
INSERT INTO category (name, sort, status) VALUES
('手工艺品', 1, 1),
('文创周边', 2, 1),
('文具用品', 3, 1),
('家居装饰', 4, 1),
('礼品套装', 5, 1);

-- 插入商品
INSERT INTO product (name, description, price, original_price, stock, image, category_id, category_name, status, sort, sales) VALUES
('手工木质书签', '精选天然木材，手工雕刻，温润如玉，每一片都是独一无二的艺术品。适合送给爱读书的朋友。', 29.90, 39.90, 100, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handcrafted%20wooden%20bookmark%20with%20elegant%20carving%20warm%20lighting&image_size=square', 1, '手工艺品', 1, 1, 156),
('手绘陶瓷杯', '纯手工绘制，每一个图案都是匠人用心之作。温润如玉的触感，让每一天的咖啡时光都充满诗意。', 89.00, 129.00, 50, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handpainted%20ceramic%20cup%20with%20floral%20design%20warm%20soft%20lighting&image_size=square', 1, '手工艺品', 1, 2, 98),
('复古笔记本', '仿皮封面，质感高级，内页采用米黄色护眼纸张，书写流畅。记录生活中的美好瞬间。', 45.00, 68.00, 200, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vintage%20notebook%20with%20leather%20cover%20warm%20lighting%20elegant&image_size=square', 3, '文具用品', 1, 3, 234),
('木质万年历', '简约设计，可重复使用，环保又实用。让每一天都有一个温馨的开始。', 68.00, 98.00, 80, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wooden%20perpetual%20calendar%20minimalist%20design%20warm%20wood%20texture&image_size=square', 4, '家居装饰', 1, 4, 76),
('文创帆布袋', '原创设计，厚实帆布材质，文艺气息满满。日常出行的好伴侣。', 39.00, 59.00, 150, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=canvas%20tote%20bag%20with%20artistic%20design%20warm%20beige%20color&image_size=square', 2, '文创周边', 1, 5, 312),
('水墨山水画装饰画', '传统水墨技法，现代审美呈现。为你的空间增添一抹东方韵味。', 198.00, 298.00, 30, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20chinese%20ink%20painting%20mountain%20landscape%20wall%20art%20elegant&image_size=square', 4, '家居装饰', 1, 6, 45),
('古风书签套装', '一套四枚，采用金属材质，精雕细琢，古典雅致。送给爱书之人的绝佳礼物。', 58.00, 88.00, 120, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ancient%20chinese%20style%20metal%20bookmark%20set%20elegant%20carving&image_size=square', 1, '手工艺品', 1, 7, 167),
('文艺礼盒套装', '精选多款文创好物，精美礼盒包装，送礼自用两相宜。', 168.00, 268.00, 60, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20gift%20box%20set%20with%20stationery%20warm%20beige%20aesthetic&image_size=square', 5, '礼品套装', 1, 8, 89),
('手账胶带套装', '原创设计，多款图案可选，让你的手账更加丰富多彩。', 35.00, 55.00, 200, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wasabi%20tape%20set%20with%20floral%20and%20nature%20designs%20warm%20colors&image_size=square', 3, '文具用品', 1, 9, 256),
('木质印章套装', '天然原木手柄，优质橡皮印章，多种图案可选，为生活增添小确幸。', 48.00, 78.00, 90, 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=wooden%20stamp%20set%20with%20floral%20designs%20craft%20supplies%20warm%20lighting&image_size=square', 3, '文具用品', 1, 10, 134);
