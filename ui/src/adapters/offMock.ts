export interface OffMockItem {
  id: string;
  product_name: string;
  brands: string;
  image_url?: string;
  ecoscore_grade?: 'a' | 'b' | 'c' | 'd' | 'e';
  labels_tags?: string[];
}

const seed: OffMockItem[] = [
  {
    id: '1',
    product_name: 'Organic Apple',
    brands: 'Green Farms',
    image_url: 'https://via.placeholder.com/150',
    ecoscore_grade: 'a',
    labels_tags: ['en:organic']
  },
  {
    id: '2',
    product_name: 'Chocolate Bar',
    brands: 'Very Very Long Brand Name Incorporated',
    ecoscore_grade: 'b'
  },
  {
    id: '3',
    product_name: 'Almond Milk',
    brands: 'EcoMoo',
    image_url: 'https://via.placeholder.com/150',
    ecoscore_grade: 'c'
  },
  {
    id: '4',
    product_name: 'Instant Noodles',
    brands: 'QuickEats',
    image_url: 'https://via.placeholder.com/150',
    ecoscore_grade: 'b'
  },
  {
    id: '5',
    product_name: 'Gluten-Free Bread',
    brands: 'HealthyBites',
    labels_tags: ['en:organic']
  },
  {
    id: '6',
    product_name: 'Tomato Ketchup',
    brands: 'Local Harvest',
    image_url: 'https://via.placeholder.com/150',
    ecoscore_grade: 'a'
  },
  {
    id: '7',
    product_name: 'Canned Beans',
    brands: 'BudgetFoods'
  },
  {
    id: '8',
    product_name: 'Olive Oil',
    brands: 'Mediterranean Gold',
    image_url: 'https://via.placeholder.com/150',
    ecoscore_grade: 'c'
  },
  {
    id: '9',
    product_name: 'Energy Drink',
    brands: 'GreenBoost',
    image_url: 'https://via.placeholder.com/150',
    ecoscore_grade: 'b'
  },
  {
    id: '10',
    product_name: 'Organic Yogurt',
    brands: 'Farm Fresh',
    image_url: 'https://via.placeholder.com/150',
    ecoscore_grade: 'a',
    labels_tags: ['en:organic']
  },
  {
    id: '11',
    product_name: 'Corn Flakes',
    brands: 'MorningCo',
    image_url: 'https://via.placeholder.com/150',
    ecoscore_grade: 'b'
  },
  {
    id: '12',
    product_name: 'Vegan Sausage',
    brands: 'Plantastic',
    ecoscore_grade: 'c',
    image_url: 'https://via.placeholder.com/150'
  }
];

export async function searchOffMock(q: string): Promise<OffMockItem[]> {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  // simulate async latency
  await new Promise((r) => setTimeout(r, 50));
  return seed.filter(
    (item) =>
      item.product_name.toLowerCase().includes(query) ||
      item.brands.toLowerCase().includes(query)
  );
}

export default searchOffMock;
