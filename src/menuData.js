// Single source of truth for the menu. Swap `image` with a real photo URL
// (or an import from src/assets) to replace the striped placeholder.
export const MENU = [
  {
    id: 'mezze', name: 'Cold Mezze', arabic: 'مقبلات باردة', image: null,
    items: [
      { id: 'm1', name: 'Hummos Beiruti', arabic: 'حمص بيروتي · مع خبز و زيت زيتون', price: 8, image: null, slot: 'hummus bowl' },
      { id: 'm2', name: 'Moutabal', arabic: 'متبل باذنجان مشوي', price: 8, image: null, slot: 'moutabal' },
      { id: 'm3', name: 'Tabbouleh', arabic: 'تبولة بالبرغل الناعم', price: 9, image: null, slot: 'tabbouleh' },
      { id: 'm4', name: 'Shrimp & Avocado Salad', arabic: 'سلطة الجمبري و الأفوكادو', price: 16, image: null, slot: 'shrimp salad' },
      { id: 'm5', name: 'Smoked Fish Carpaccio', arabic: 'كارباتشيو السمك المدخن', price: 18, image: null, slot: 'carpaccio' }
    ]
  },
  {
    id: 'hot', name: 'Hot Sea Starters', arabic: 'مقبلات بحرية ساخنة', image: null,
    items: [
      { id: 'h1', name: 'Fried Calamari', arabic: 'كاليماري مقلي مع صوص الطرطور', price: 15, image: null, slot: 'calamari' },
      { id: 'h2', name: 'Grilled Octopus', arabic: 'أخطبوط مشوي على الفحم', price: 22, image: null, slot: 'octopus' },
      { id: 'h3', name: 'Shrimp Provençale', arabic: 'جمبري بالثوم و الكزبرة', price: 18, image: null, slot: 'shrimp pan' },
      { id: 'h4', name: 'Fish Kibbeh', arabic: 'كبة السمك', price: 14, image: null, slot: 'fish kibbeh' },
      { id: 'h5', name: 'Samke Harra Bites', arabic: 'لقيمات سمكة حرة', price: 16, image: null, slot: 'samke harra' }
    ]
  },
  {
    id: 'grill', name: 'From the Grill', arabic: 'من الشوّاية', image: null,
    items: [
      { id: 'g1', name: 'Whole Sea Bass', arabic: 'قاروص كامل مشوي · للشخص', price: 34, image: null, slot: 'sea bass' },
      { id: 'g2', name: 'Red Snapper', arabic: 'سمك الفريدي المشوي', price: 38, image: null, slot: 'red snapper' },
      { id: 'g3', name: 'Grilled Salmon Fillet', arabic: 'فيليه سلمون مشوي', price: 29, image: null, slot: 'salmon' },
      { id: 'g4', name: 'Jumbo Shrimp Skewer', arabic: 'أسياخ الجمبري الجامبو', price: 26, image: null, slot: 'shrimp skewer' },
      { id: 'g5', name: 'Mixed Seafood Platter', arabic: 'صحن بحري مشكل · لشخصين', price: 62, image: null, slot: 'seafood platter' }
    ]
  },
  {
    id: 'fried', name: 'Fried & Sayadieh', arabic: 'مقالي و صيادية', image: null,
    items: [
      { id: 'f1', name: 'Sultan Ibrahim', arabic: 'سلطان إبراهيم مقلي', price: 28, image: null, slot: 'sultan ibrahim' },
      { id: 'f2', name: 'Fried Bizri', arabic: 'بزري مقلي', price: 18, image: null, slot: 'bizri' },
      { id: 'f3', name: 'Fish Sayadieh', arabic: 'صيادية سمك مع الأرز', price: 24, image: null, slot: 'sayadieh' }
    ]
  },
  {
    id: 'land', name: 'From the Land', arabic: 'مشاوي و لحوم', image: null,
    items: [
      { id: 'l1', name: 'Mixed Mashawi', arabic: 'مشاوي مشكلة', price: 26, image: null, slot: 'mashawi' },
      { id: 'l2', name: 'Chicken Taouk', arabic: 'شيش طاووق', price: 19, image: null, slot: 'taouk' },
      { id: 'l3', name: 'Kafta Khashkhash', arabic: 'كفتة خشخاش', price: 21, image: null, slot: 'kafta' }
    ]
  },
  {
    id: 'sides', name: 'Sides', arabic: 'أطباق جانبية', image: null,
    items: [
      { id: 's1', name: 'Sayadieh Rice', arabic: 'أرز صيادية', price: 7, image: null, slot: 'rice' },
      { id: 's2', name: 'Batata Harra', arabic: 'بطاطا حرة', price: 7, image: null, slot: 'batata harra' },
      { id: 's3', name: 'Grilled Vegetables', arabic: 'خضار مشوية', price: 8, image: null, slot: 'grilled veg' },
      { id: 's4', name: 'Bread Basket', arabic: 'سلة خبز عربي', price: 3, image: null, slot: 'bread' }
    ]
  },
  {
    id: 'dessert', name: 'Desserts', arabic: 'حلويات', image: null,
    items: [
      { id: 'd1', name: 'Halawet el Jibn', arabic: 'حلاوة الجبن بالقشطة', price: 9, image: null, slot: 'halawet jibn' },
      { id: 'd2', name: 'Ashta & Honey', arabic: 'قشطة بالعسل و الفستق', price: 10, image: null, slot: 'ashta' },
      { id: 'd3', name: 'Seasonal Fruit Platter', arabic: 'صحن فواكه موسمية', price: 14, image: null, slot: 'fruit platter' }
    ]
  },
  {
    id: 'drinks', name: 'Drinks', arabic: 'مشروبات', image: null,
    items: [
      { id: 'b1', name: 'Mint Lemonade', arabic: 'ليموناضة بالنعنع', price: 6, image: null, slot: 'lemonade' },
      { id: 'b2', name: 'Jallab', arabic: 'جلاب بالصنوبر', price: 6, image: null, slot: 'jallab' },
      { id: 'b3', name: 'Arabic Coffee', arabic: 'قهوة عربية', price: 4, image: null, slot: 'coffee' },
      { id: 'b4', name: 'Sparkling Water', arabic: 'مياه غازية', price: 4, image: null, slot: 'water' }
    ]
  }
];

export const ALL_ITEMS = MENU.flatMap(g => g.items);
