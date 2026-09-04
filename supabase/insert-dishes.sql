-- Salinas — the 37 dishes from menu-draft.md, in the six categories.
--
-- The categories must already exist; this only adds dishes and references them
-- by the ids that are live now. Soupes gets nothing: the menu photos had none.
--
-- Price is 0 and image_url is null on every row, to be filled in later from the
-- admin panel. A dish with no photo renders the striped placeholder, using the
-- `slot` text, so the menu looks deliberate until the photos arrive. A price of
-- 0 shows as 0 to guests — set the real prices before sharing the menu.
--
-- Safe to re-run: ids are derived from the dish name, and a second run
-- conflicts on the primary key and changes nothing.

insert into dishes (id, category_id, name, arabic, price, image_url, slot, available, sort_order) values
  ('grillade-de-poisson-signature-101b', 'fruits-de-mer-02ln', 'Grillade de poisson signature', 'سمك مشوي · أعشاب، ثوم، ليمون', 0, null, 'grilled fish', true, 0),
  ('poisson-dore-croustillant-7534', 'fruits-de-mer-02ln', 'Poisson doré croustillant', 'سمك مقرمش · صلصة كريمية', 0, null, 'crispy fish', true, 1),
  ('poisson-citronne-d98d', 'fruits-de-mer-02ln', 'Poisson citronné', 'سمك بالليمون · زبدة، ثوم', 0, null, 'lemon fish', true, 2),
  ('poisson-mediterraneen-au-four-d8e0', 'fruits-de-mer-02ln', 'Poisson méditerranéen au four', 'سمك بالفرن · خضار، أعشاب', 0, null, 'baked fish', true, 3),
  ('riz-au-poisson-e00e', 'fruits-de-mer-02ln', 'Riz au poisson', 'أرز بالسمك · بصل، بهارات', 0, null, 'fish rice', true, 4),
  ('riz-aux-fruits-de-mer-5482', 'fruits-de-mer-02ln', 'Riz aux fruits de mer', 'أرز بثمار البحر · قريدس، كاليماري، كراب', 0, null, 'seafood rice', true, 5),
  ('plateau-royal-de-la-mer-bf6e', 'fruits-de-mer-02ln', 'Plateau royal de la mer', 'صحن البحر الملكي · كاليماري، قريدس، فلفل حار', 0, null, 'sea platter', true, 6),
  ('plateau-prestige-grille-fbd7', 'fruits-de-mer-02ln', 'Plateau prestige grillé', 'صحن مشاوي بحرية · سمك، قريدس، كاليماري، كراب', 0, null, 'grilled platter', true, 7),
  ('seau-royal-signature-du-chef-f581', 'fruits-de-mer-02ln', 'Seau royal signature du chef', 'سطل الشيف الملكي · سمك، قريدس، كاليماري، خضار', 0, null, 'royal bucket', true, 8),
  ('crevettes-aux-legumes-097e', 'fruits-de-mer-02ln', 'Crevettes aux légumes', 'قريدس بالخضار · ثمار البحر، صلصة الثوم', 0, null, 'shrimp veg', true, 9),
  ('crevettes-a-la-provencale-7ce4', 'fruits-de-mer-02ln', 'Crevettes à la provençale', 'قريدس بروفنسال · صلصة الزبدة والثوم', 0, null, 'provencale shrimp', true, 10),
  ('crevettes-grillees-ou-poulpe-96d3', 'fruits-de-mer-02ln', 'Crevettes grillées ou poulpe', 'قريدس أو أخطبوط مشوي · صلصة الزنجبيل', 0, null, 'grilled shrimp', true, 11),
  ('crevettes-croustillantes-ou-poulpe-9c2c', 'fruits-de-mer-02ln', 'Crevettes croustillantes ou poulpe', 'قريدس أو أخطبوط مقرمش · صلصة الشيلي', 0, null, 'crispy shrimp', true, 12),
  ('crevettes-a-la-creme-ou-poulpe-8292', 'fruits-de-mer-02ln', 'Crevettes à la crème ou poulpe', 'قريدس أو أخطبوط بالكريما · ثوم، فطر', 0, null, 'cream shrimp', true, 13),
  ('assiette-premium-9f2d', 'fruits-de-mer-02ln', 'Assiette premium', 'صحن مميز · أرز أو أتييكيه، ثمار البحر', 0, null, 'premium plate', true, 14),
  ('poulpe-aux-herbes-936b', 'fruits-de-mer-02ln', 'Poulpe aux herbes', 'أخطبوط بالأعشاب · خضار، بهارات', 0, null, 'octopus herbs', true, 15),
  ('poulpe-citronne-d016', 'fruits-de-mer-02ln', 'Poulpe citronné', 'أخطبوط بالليمون · ثوم، كزبرة، زبدة', 0, null, 'lemon octopus', true, 16),
  ('pates-au-thiof-grille-28f4', 'fruits-de-mer-02ln', 'Pâtes au thiof grillé', 'باستا بالتيوف المشوي · صلصة البندورة، فليفلة', 0, null, 'thiof pasta', true, 17),
  ('spaghetti-aux-crevettes-ou-poulpe-6c12', 'fruits-de-mer-02ln', 'Spaghetti aux crevettes ou poulpe', 'سباغيتي بالقريدس أو الأخطبوط · زيت زيتون، ليمون', 0, null, 'shrimp spaghetti', true, 18),
  ('pates-au-capitaine-bf63', 'fruits-de-mer-02ln', 'Pâtes au capitaine', 'باستا بالكابيتان · صلصة بيضاء، فطر، بارميزان', 0, null, 'white sauce pasta', true, 19),
  ('pates-aux-fruits-de-mer-72c3', 'fruits-de-mer-02ln', 'Pâtes aux fruits de mer', 'باستا بثمار البحر · قريدس، كاليماري، بحري', 0, null, 'seafood pasta', true, 20),
  ('pates-sauce-rouge-51db', 'fruits-de-mer-02ln', 'Pâtes sauce rouge', 'باستا بالصلصة الحمراء · سمك مقلي، بندورة، بصل', 0, null, 'red sauce pasta', true, 21),
  ('spaghetti-au-crabe-aba9', 'fruits-de-mer-02ln', 'Spaghetti au crabe', 'سباغيتي بالكراب · صلصة كريما، أعشاب', 0, null, 'crab spaghetti', true, 22),
  ('steak-shawarma-fedb', 'viande-a7db', 'Steak shawarma', 'شاورما ستيك · خبز، بصل، صلصة', 0, null, 'steak shawarma', true, 0),
  ('fajita-philadelphie-4fd7', 'viande-a7db', 'Fajita Philadelphie', 'فاهيتا فلادلفيا · لحم، فليفلة، جبنة', 0, null, 'philly fajita', true, 1),
  ('francisco-zinger-548a', 'poulet-u96g', 'Francisco Zinger', 'فرانسيسكو زنجر · دجاج بانيه، صلصة', 0, null, 'zinger', true, 0),
  ('poulet-croustillant-b2fa', 'poulet-u96g', 'Poulet croustillant', 'دجاج كرسبي · صلصة البيت', 0, null, 'crispy chicken', true, 1),
  ('taouk-grille-78fa', 'poulet-u96g', 'Taouk grillé', 'طاووق مشوي · ثوم، بهارات', 0, null, 'taouk', true, 2),
  ('salade-de-fruits-de-mer-45ac', 'salades-73pw', 'Salade de fruits de mer', 'سلطة ثمار البحر · أفوكادو، فواكه، خضار', 0, null, 'seafood salad', true, 0),
  ('carpaccio-de-poisson-f026', 'salades-73pw', 'Carpaccio de poisson', 'كارباتشيو السمك · خضار طازجة، صلصة خاصة', 0, null, 'carpaccio', true, 1),
  ('limonade-d330', 'boissons-azue', 'Limonade', 'ليموناضة · ليمون، نعناع', 0, null, 'lemonade', true, 0),
  ('cocktail-tropical-d1b0', 'boissons-azue', 'Cocktail tropical', 'كوكتيل استوائي · خليط فواكه', 0, null, 'cocktail', true, 1),
  ('jus-de-mangue-1c3c', 'boissons-azue', 'Jus de mangue', 'عصير مانجو · طبيعي', 0, null, 'mango juice', true, 2),
  ('avocat-012f', 'boissons-azue', 'Avocat', 'أفوكادو · قشطة، عسل', 0, null, 'avocado', true, 3),
  ('banane-et-lait-d5fe', 'boissons-azue', 'Banane et lait', 'موز بالحليب · فراولة', 0, null, 'banana milk', true, 4),
  ('pepsi-mandarina-eau-gazeuse-e9f6', 'boissons-azue', 'Pepsi, mandarina, eau gazeuse', 'مشروبات غازية', 0, null, 'soda', true, 5),
  ('boissons-energetiques-afff', 'boissons-azue', 'Boissons énergétiques', 'مشروبات الطاقة', 0, null, 'energy drink', true, 6)
on conflict (id) do nothing;


-- Check: dish counts per category.

select c.name as category, count(d.id) as dishes
from categories c
left join dishes d on d.category_id = c.id
group by c.name, c.sort_order
order by c.sort_order;
