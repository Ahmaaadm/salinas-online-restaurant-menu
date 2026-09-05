-- Salinas — the Poulet and Viande dishes, French and Arabic.
--
-- Nothing is deleted: the five earlier dishes (Steak shawarma, Fajita
-- Philadelphie, Francisco Zinger, Poulet croustillant, Taouk grillé) stay
-- exactly where they are. These are added after them — sort_order starts at
-- 3 for Poulet and 2 for Viande so nothing collides and the order on
-- the menu stays predictable. Reorder any of it later with the arrows in the
-- admin panel.
--
-- Prices are 0 and photos are null, to fill in later from the admin panel.
-- Remember a price of 0 shows as 0 to guests, so set them before sharing.
--
-- Safe to re-run: ids come from the dish name, so a second run changes nothing.

insert into dishes (id, category_id, name, arabic, price, image_url, slot, available, sort_order) values
  ('poulet-sfain-a-la-creme-366e', 'poulet-u96g', 'Poulet Sfaïn à la crème', 'دجاج سفاين بالكريم', 0, null, 'cream chicken', true, 3),
  ('poulet-sfain-au-citron-et-a-l-ail-28a3', 'poulet-u96g', 'Poulet Sfaïn au citron et à l’ail', 'دجاج سفاين بالحامض والتوم', 0, null, 'lemon garlic chicken', true, 4),
  ('poulet-sfain-a-la-sauce-bef-tik-ca01', 'poulet-u96g', 'Poulet Sfaïn à la sauce béf-tik', 'دجاج سفاين بصوص البيفتيك', 0, null, 'beftik chicken', true, 5),
  ('ailes-de-poulet-croustillantes-a2e0', 'poulet-u96g', 'Ailes de poulet croustillantes', 'دجاج جوانح كرسبي', 0, null, 'crispy wings', true, 6),
  ('ailes-de-poulet-a-la-sauce-au-miel-1ed4', 'poulet-u96g', 'Ailes de poulet à la sauce au miel', 'جوانح بصوص العسل', 0, null, 'honey wings', true, 7),
  ('cuisses-de-poulet-desossees-a-la-sauce-t-7e84', 'poulet-u96g', 'Cuisses de poulet désossées à la sauce turque grillée', 'فخاذ مسحب بصوص التركي المشوي', 0, null, 'turkish chicken', true, 8),
  ('sfain-de-poulet-poele-au-grill-0d84', 'poulet-u96g', 'Sfaïn de poulet poêlé au grill', 'سفاين مشوحة عالجريل', 0, null, 'grilled sfain', true, 9),
  ('steak-de-boeuf-a-la-creme-992b', 'viande-a7db', 'Steak de bœuf à la crème', 'ستيك لحمة بالكريم', 0, null, 'cream steak', true, 2),
  ('steak-de-boeuf-a-la-sauce-citron-et-ail-268e', 'viande-a7db', 'Steak de bœuf à la sauce citron et ail', 'ستيك بصوص الحامض والتوم', 0, null, 'lemon garlic steak', true, 3),
  ('steak-de-boeuf-a-la-sauce-bef-tik-3ebe', 'viande-a7db', 'Steak de bœuf à la sauce béf-tik', 'ستيك بفتيك', 0, null, 'beftik steak', true, 4),
  ('steak-de-boeuf-grille-7630', 'viande-a7db', 'Steak de bœuf grillé', 'ستيك مشوية عالجريل', 0, null, 'grilled steak', true, 5)
on conflict (id) do nothing;


-- Check: both categories, in the order guests will see them.

select c.name as category, d.sort_order, d.name, d.arabic
from dishes d join categories c on c.id = d.category_id
where d.category_id in ('poulet-u96g', 'viande-a7db')
order by c.sort_order, d.sort_order;
