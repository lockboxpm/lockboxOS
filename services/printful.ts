// Printful API Service
// Fetches products from your Printful store via Vite proxy

export interface PrintfulVariant {
    id: number;
    sync_product_id: number;
    name: string;
    synced: boolean;
    variant_id: number;
    retail_price: string;
    currency: string;
    product: {
        variant_id: number;
        product_id: number;
        image: string;
        name: string;
    };
    files: Array<{
        id: number;
        type: string;
        preview_url: string;
        thumbnail_url: string;
    }>;
}

export interface PrintfulSyncProduct {
    id: number;
    external_id: string;
    name: string;
    variants: number;
    synced: number;
    thumbnail_url: string;
    is_ignored: boolean;
}

export interface PrintfulSyncProductDetail {
    sync_product: PrintfulSyncProduct;
    sync_variants: PrintfulVariant[];
}

export interface PrintfulProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    printfulSyncProductId: number;
    variants: Array<{
        id: number;
        name: string;
        price: number;
    }>;
}

// Fetch all sync products from the store
export async function fetchPrintfulProducts(): Promise<PrintfulProduct[]> {
    try {
        // First, get the list of sync products
        const response = await fetch('/api/printful/store/products');

        if (!response.ok) {
            throw new Error(`Printful API error: ${response.status}`);
        }

        const data = await response.json();
        const syncProducts: PrintfulSyncProduct[] = data.result || [];

        // Fetch details for each product to get variants and full info
        const products: PrintfulProduct[] = await Promise.all(
            syncProducts.map(async (syncProduct) => {
                try {
                    const detailResponse = await fetch(`/api/printful/store/products/${syncProduct.id}`);

                    if (!detailResponse.ok) {
                        console.warn(`Failed to fetch details for product ${syncProduct.id}`);
                        return null;
                    }

                    const detailData = await detailResponse.json();
                    const detail: PrintfulSyncProductDetail = detailData.result;

                    // Get the first variant's price as the base price
                    const baseVariant = detail.sync_variants[0];
                    const price = baseVariant ? parseFloat(baseVariant.retail_price) : 0;

                    // Get the best image
                    const image = detail.sync_variants[0]?.files?.find(f => f.type === 'preview')?.preview_url
                        || syncProduct.thumbnail_url
                        || '';

                    // Extract category from product name (e.g., "T-Shirt", "Hoodie")
                    const category = extractCategory(detail.sync_product.name);

                    return {
                        id: `printful_${syncProduct.id}`,
                        name: detail.sync_product.name,
                        price,
                        image,
                        category,
                        description: `Premium quality ${category.toLowerCase()}. Printed and fulfilled by Printful.`,
                        printfulSyncProductId: syncProduct.id,
                        variants: detail.sync_variants.map(v => ({
                            id: v.id,
                            name: v.name,
                            price: parseFloat(v.retail_price)
                        }))
                    };
                } catch (err) {
                    console.error(`Error fetching product ${syncProduct.id}:`, err);
                    return null;
                }
            })
        );

        // Filter out any null products (failed fetches)
        return products.filter((p): p is PrintfulProduct => p !== null);
    } catch (error) {
        console.error('Error fetching Printful products:', error);
        return [];
    }
}

function extractCategory(productName: string): string {
    const categories = [
        'T-Shirt', 'Tee', 'Hoodie', 'Sweatshirt', 'Tank Top',
        'Hat', 'Cap', 'Mug', 'Poster', 'Sticker', 'Phone Case',
        'Tote Bag', 'Backpack', 'Pillow', 'Blanket'
    ];

    for (const cat of categories) {
        if (productName.toLowerCase().includes(cat.toLowerCase())) {
            return cat;
        }
    }

    return 'Apparel';
}
