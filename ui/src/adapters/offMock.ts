// Mocked subset of Open Food Facts items. Keeps variety for UI testing such as
// missing images, long brand names and mixed eco scores.

export interface OffItem {
  code: string;
  product_name: string;
  brands: string;
  image_url?: string;
  ecoscore_grade?: 'a' | 'b' | 'c';
  labels?: string; // e.g. 'en:organic'
}

const items: OffItem[] = [
  {
    code: '0001',
    product_name: 'Organic Apple',
    brands: 'BioFarm',
    image_url: 'https://via.placeholder.com/150?text=Apple',
    ecoscore_grade: 'a',
    labels: 'en:organic',
  },
  {
    code: '0002',
    product_name: 'Chocolate Spread',
    brands: 'Sweet & Delicious International Incorporated',
    image_url: 'https://via.placeholder.com/150?text=Choc',
    ecoscore_grade: 'c',
  },
  {
    code: '0003',
    product_name: 'Soy Milk',
    brands: 'Alpro',
    ecoscore_grade: 'b',
  },
  {
    code: '0004',
    product_name: 'Vegan Burger',
    brands: 'PlantGood',
    image_url: 'https://via.placeholder.com/150?text=Burger',
    ecoscore_grade: 'a',
    labels: 'en:organic',
  },
  {
    code: '0005',
    product_name: 'Instant Noodles',
    brands: 'QuickBite',
    ecoscore_grade: 'c',
  },
  {
    code: '0006',
    product_name: 'Granola Bar',
    brands: 'HealthyChoice',
    image_url: 'https://via.placeholder.com/150?text=Granola',
    ecoscore_grade: 'b',
  },
  {
    code: '0007',
    product_name: 'Soda',
    brands: 'FizzPop',
    ecoscore_grade: 'c',
  },
  {
    code: '0008',
    product_name: 'Olive Oil',
    brands: 'Mediterraneo',
    image_url: 'https://via.placeholder.com/150?text=Oil',
    ecoscore_grade: 'b',
    labels: 'en:organic',
  },
  {
    code: '0009',
    product_name: 'Peanut Butter',
    brands: 'Nutty Co',
    image_url: 'https://via.placeholder.com/150?text=Peanut',
    ecoscore_grade: 'a',
  },
  {
    code: '0010',
    product_name: 'Cereal',
    brands: 'Very Very Long Brand Name That Exceeds Expectations',
    image_url: 'https://via.placeholder.com/150?text=Cereal',
    ecoscore_grade: 'b',
  },
  {
    code: '0011',
    product_name: 'Cheddar Cheese',
    brands: 'Local Dairy',
    image_url: 'https://via.placeholder.com/150?text=Cheese',
    ecoscore_grade: 'a',
  },
  {
    code: '0012',
    product_name: 'Tomato Sauce',
    brands: "Grandma's Kitchen",
    ecoscore_grade: 'b',
    labels: 'en:organic',
  },
];

export async function search(
  q: string,
  _signal?: AbortSignal
): Promise<OffItem[]> {
  const qLower = q.toLowerCase();
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 100));
  return items.filter((i) => i.product_name.toLowerCase().includes(qLower));
}

export default { search };

