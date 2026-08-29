-- Salinas seed data, generated from src/menuData.js by scripts/gen-seed.mjs.
-- Run AFTER schema.sql. Safe to re-run: existing rows are left untouched.

insert into categories (id, name, arabic, image_url, sort_order) values
  ('mezze', 'Cold Mezze', 'مقبلات باردة', null, 0),
  ('hot', 'Hot Sea Starters', 'مقبلات بحرية ساخنة', null, 1),
  ('grill', 'From the Grill', 'من الشوّاية', null, 2),
  ('fried', 'Fried & Sayadieh', 'مقالي و صيادية', null, 3),
  ('land', 'From the Land', 'مشاوي و لحوم', null, 4),
  ('sides', 'Sides', 'أطباق جانبية', null, 5),
  ('dessert', 'Desserts', 'حلويات', null, 6),
  ('drinks', 'Drinks', 'مشروبات', null, 7)
on conflict (id) do nothing;

insert into dishes (id, category_id, name, arabic, price, image_url, slot, available, sort_order) values
  ('m1', 'mezze', 'Hummos Beiruti', 'حمص بيروتي · مع خبز و زيت زيتون', 8.00, null, 'hummus bowl', true, 0),
  ('m2', 'mezze', 'Moutabal', 'متبل باذنجان مشوي', 8.00, null, 'moutabal', true, 1),
  ('m3', 'mezze', 'Tabbouleh', 'تبولة بالبرغل الناعم', 9.00, null, 'tabbouleh', true, 2),
  ('m4', 'mezze', 'Shrimp & Avocado Salad', 'سلطة الجمبري و الأفوكادو', 16.00, null, 'shrimp salad', true, 3),
  ('m5', 'mezze', 'Smoked Fish Carpaccio', 'كارباتشيو السمك المدخن', 18.00, null, 'carpaccio', true, 4),
  ('h1', 'hot', 'Fried Calamari', 'كاليماري مقلي مع صوص الطرطور', 15.00, null, 'calamari', true, 0),
  ('h2', 'hot', 'Grilled Octopus', 'أخطبوط مشوي على الفحم', 22.00, null, 'octopus', true, 1),
  ('h3', 'hot', 'Shrimp Provençale', 'جمبري بالثوم و الكزبرة', 18.00, null, 'shrimp pan', true, 2),
  ('h4', 'hot', 'Fish Kibbeh', 'كبة السمك', 14.00, null, 'fish kibbeh', true, 3),
  ('h5', 'hot', 'Samke Harra Bites', 'لقيمات سمكة حرة', 16.00, null, 'samke harra', true, 4),
  ('g1', 'grill', 'Whole Sea Bass', 'قاروص كامل مشوي · للشخص', 34.00, null, 'sea bass', true, 0),
  ('g2', 'grill', 'Red Snapper', 'سمك الفريدي المشوي', 38.00, null, 'red snapper', true, 1),
  ('g3', 'grill', 'Grilled Salmon Fillet', 'فيليه سلمون مشوي', 29.00, null, 'salmon', true, 2),
  ('g4', 'grill', 'Jumbo Shrimp Skewer', 'أسياخ الجمبري الجامبو', 26.00, null, 'shrimp skewer', true, 3),
  ('g5', 'grill', 'Mixed Seafood Platter', 'صحن بحري مشكل · لشخصين', 62.00, null, 'seafood platter', true, 4),
  ('f1', 'fried', 'Sultan Ibrahim', 'سلطان إبراهيم مقلي', 28.00, null, 'sultan ibrahim', true, 0),
  ('f2', 'fried', 'Fried Bizri', 'بزري مقلي', 18.00, null, 'bizri', true, 1),
  ('f3', 'fried', 'Fish Sayadieh', 'صيادية سمك مع الأرز', 24.00, null, 'sayadieh', true, 2),
  ('l1', 'land', 'Mixed Mashawi', 'مشاوي مشكلة', 26.00, null, 'mashawi', true, 0),
  ('l2', 'land', 'Chicken Taouk', 'شيش طاووق', 19.00, null, 'taouk', true, 1),
  ('l3', 'land', 'Kafta Khashkhash', 'كفتة خشخاش', 21.00, null, 'kafta', true, 2),
  ('s1', 'sides', 'Sayadieh Rice', 'أرز صيادية', 7.00, null, 'rice', true, 0),
  ('s2', 'sides', 'Batata Harra', 'بطاطا حرة', 7.00, null, 'batata harra', true, 1),
  ('s3', 'sides', 'Grilled Vegetables', 'خضار مشوية', 8.00, null, 'grilled veg', true, 2),
  ('s4', 'sides', 'Bread Basket', 'سلة خبز عربي', 3.00, null, 'bread', true, 3),
  ('d1', 'dessert', 'Halawet el Jibn', 'حلاوة الجبن بالقشطة', 9.00, null, 'halawet jibn', true, 0),
  ('d2', 'dessert', 'Ashta & Honey', 'قشطة بالعسل و الفستق', 10.00, null, 'ashta', true, 1),
  ('d3', 'dessert', 'Seasonal Fruit Platter', 'صحن فواكه موسمية', 14.00, null, 'fruit platter', true, 2),
  ('b1', 'drinks', 'Mint Lemonade', 'ليموناضة بالنعنع', 6.00, null, 'lemonade', true, 0),
  ('b2', 'drinks', 'Jallab', 'جلاب بالصنوبر', 6.00, null, 'jallab', true, 1),
  ('b3', 'drinks', 'Arabic Coffee', 'قهوة عربية', 4.00, null, 'coffee', true, 2),
  ('b4', 'drinks', 'Sparkling Water', 'مياه غازية', 4.00, null, 'water', true, 3)
on conflict (id) do nothing;

-- Plat du jour starts empty on purpose — add slides from the admin panel.
