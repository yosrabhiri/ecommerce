<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            'Skincare' => [
                ['Noura Skin', 'Hyaluronic Dew Serum', 'skincare,serum,bottle', 34, 'New', 'A hydrating facial serum for dry and sensitive skin with a light daily finish.'],
                ['Noura Skin', 'Oat Milk Cloud Cleanser', 'cleanser,skincare,bottle', 22, null, 'A creamy cleanser made for gentle morning and evening routines.'],
                ['Maison Glow', 'Peptide Night Cream', 'face,cream,jar', 42, null, 'A rich night cream for smoother-looking skin and barrier support.'],
                ['Velvet Leaf', 'Vitamin C Glow Drops', 'vitamin,c,serum', 38, 'Sale', 'Brightening drops for dull skin with a soft glow finish.'],
                ['Sora Studio', 'Mineral SPF Face Cream', 'sunscreen,cream,skincare', 28, null, 'A daily mineral SPF cream designed for lightweight protection.'],
                ['Noura Skin', 'Rose Water Gel Toner', 'toner,skincare,bottle', 19, null, 'A cooling rose water toner for fresh, balanced skin.'],
                ['Maison Glow', 'Ceramide Repair Balm', 'ceramide,balm,skincare', 31, 'New', 'A comforting balm for dry patches and a stronger skin barrier.'],
                ['Velvet Leaf', 'Aloe Sleep Mask', 'sleep,mask,skincare', 27, null, 'A soothing overnight mask with a fresh gel texture.'],
                ['Sora Studio', 'Soft Foam Daily Wash', 'foam,cleanser,skincare', 18, null, 'A soft foaming wash for everyday cleansing.'],
                ['Noura Skin', 'Bright C Renewal Cream', 'face,cream,skincare', 44, 'Sale', 'A brightening renewal cream for uneven tone and dry texture.'],
                ['Maison Glow', 'Milky Barrier Essence', 'essence,skincare,bottle', 26, null, 'A milky essence that layers under serum for extra hydration.'],
                ['Velvet Leaf', 'Calendula Comfort Mist', 'face,mist,skincare', 21, null, 'A calming facial mist for skin that needs quick comfort.'],
                ['Noura Skin', 'Retinol Soft Night Oil', 'face,oil,skincare', 46, null, 'A gentle night oil for smoother-looking texture.'],
                ['Sora Studio', 'Green Tea Pore Toner', 'green,tea,toner', 24, null, 'A fresh toner for combination skin and visible pores.'],
                ['Maison Glow', 'Plum Lip Sleeping Balm', 'lip,balm,cosmetics', 16, 'New', 'A soft lip balm with a glossy overnight finish.'],
                ['Velvet Leaf', 'Honey Enzyme Polish', 'face,polish,skincare', 29, null, 'A gentle exfoliating polish for a smoother glow.'],
                ['Noura Skin', 'Cica Redness Cream', 'cica,cream,skincare', 33, null, 'A calming cream for redness-prone and sensitive skin.'],
                ['Sora Studio', 'Rice Water Bright Toner', 'rice,water,toner', 23, 'Sale', 'A lightweight toner for brighter-looking skin.'],
                ['Maison Glow', 'Marine Collagen Ampoule', 'ampoule,skincare,serum', 48, null, 'A concentrated ampoule for plump, hydrated skin.'],
                ['Velvet Leaf', 'Shea Body Butter', 'body,butter,skincare', 25, null, 'A creamy body butter for soft arms, legs, and elbows.'],
            ],
            'Dresses' => [
                ['Atelier Lumi', 'Ivory Linen Midi Dress', 'linen,dress,fashion', 96, 'New', 'A breathable ivory linen midi dress for warm days and clean styling.'],
                ['Aster Lane', 'Black Satin Slip Dress', 'black,satin,dress', 118, null, 'A fluid satin slip dress for evening dinners and polished events.'],
                ['Sora Studio', 'Cotton Poplin Shirt Dress', 'shirt,dress,cotton', 82, null, 'A crisp cotton shirt dress with an easy everyday silhouette.'],
                ['Maison Glow', 'Ribbed Knit Column Dress', 'knit,dress,fashion', 74, 'Sale', 'A ribbed column dress with a soft stretch fit.'],
                ['Atelier Lumi', 'Floral Garden Wrap Dress', 'floral,wrap,dress', 104, null, 'A floral wrap dress for brunch, garden parties, and spring weekends.'],
                ['Aster Lane', 'Square Neck Day Dress', 'square,neck,dress', 89, null, 'A square neck day dress with a simple tailored shape.'],
                ['Sora Studio', 'Pleated Cream Dress', 'pleated,dress,cream', 112, null, 'A pleated cream dress with light movement and soft structure.'],
                ['Maison Glow', 'Minimal Black Knit Dress', 'black,knit,dress', 79, 'New', 'A minimal black knit dress for weekday dressing.'],
                ['Atelier Lumi', 'Silk Blend Wrap Dress', 'silk,wrap,dress', 136, null, 'A silk blend wrap dress with a refined evening finish.'],
                ['Aster Lane', 'Fluid Maxi Dress', 'maxi,dress,fashion', 129, 'Sale', 'A long fluid maxi dress for vacations and summer evenings.'],
                ['Sora Studio', 'Denim Button Midi Dress', 'denim,dress,fashion', 94, null, 'A structured denim midi dress with button-front detail.'],
                ['Maison Glow', 'Soft Tailored Blazer Dress', 'blazer,dress,fashion', 142, null, 'A tailored blazer dress for a sharper going-out look.'],
                ['Atelier Lumi', 'Sleeveless Linen Shift Dress', 'sleeveless,linen,dress', 88, null, 'A sleeveless shift dress for clean summer styling.'],
                ['Aster Lane', 'Champagne Evening Dress', 'champagne,evening,dress', 148, 'New', 'A champagne evening dress with a polished satin feel.'],
                ['Sora Studio', 'Cotton Tiered Sundress', 'cotton,sundress,fashion', 76, null, 'A tiered sundress for warm weekends and travel.'],
                ['Maison Glow', 'Long Sleeve Jersey Dress', 'jersey,dress,fashion', 69, null, 'A soft jersey dress for relaxed workdays and layering.'],
                ['Atelier Lumi', 'Rose Satin Cami Dress', 'rose,satin,dress', 115, 'Sale', 'A rose satin cami dress with a clean feminine drape.'],
                ['Aster Lane', 'White Poplin Mini Dress', 'white,poplin,dress', 83, null, 'A white poplin mini dress with a fresh crisp finish.'],
                ['Sora Studio', 'Ruffle Hem Midi Dress', 'ruffle,midi,dress', 97, null, 'A ruffle hem midi dress with soft movement.'],
                ['Maison Glow', 'Chocolate Rib Midi Dress', 'brown,ribbed,dress', 72, null, 'A chocolate rib midi dress for easy neutral styling.'],
            ],
            'Knitwear' => [
                ['Velvet Leaf', 'Alpaca Blend Cardigan', 'cardigan,knitwear', 86, 'New', 'A cozy alpaca blend cardigan with a soft brushed handfeel.'],
                ['Maison Glow', 'Organic Cotton Wrap Top', 'cotton,wrap,top', 58, null, 'A cotton wrap knit top for light layering.'],
                ['Aster Lane', 'Fine Rib Long Sleeve', 'ribbed,long,sleeve,top', 42, null, 'A fine rib long sleeve top for everyday styling.'],
                ['Atelier Lumi', 'Merino Soft Crewneck', 'merino,sweater', 92, 'Sale', 'A merino crewneck sweater with a clean neckline.'],
                ['Sora Studio', 'Relaxed Knit Polo', 'knit,polo,fashion', 64, null, 'A relaxed knit polo that works tucked or loose.'],
                ['Velvet Leaf', 'Cashmere Touch Hoodie', 'cashmere,hoodie,knitwear', 98, null, 'A cashmere-touch hoodie for soft lounge layering.'],
                ['Maison Glow', 'Textured Button Vest', 'knit,vest,fashion', 55, 'New', 'A textured knit vest with button-front styling.'],
                ['Aster Lane', 'Lightweight Turtleneck', 'turtleneck,sweater', 48, null, 'A lightweight turtleneck for layering under coats.'],
                ['Atelier Lumi', 'Pointelle Knit Tee', 'pointelle,knit,top', 52, null, 'A pointelle knit tee with a delicate open texture.'],
                ['Sora Studio', 'Soft Lounge Sweater', 'lounge,sweater,knitwear', 69, 'Sale', 'A soft lounge sweater for quiet weekends.'],
                ['Velvet Leaf', 'Cable Knit Cardigan', 'cable,knit,cardigan', 84, null, 'A cable knit cardigan with classic texture.'],
                ['Maison Glow', 'Cream Rib Knit Tank', 'ribbed,knit,tank', 36, null, 'A cream rib knit tank for layering and warm days.'],
                ['Aster Lane', 'Striped Cotton Sweater', 'striped,sweater', 62, null, 'A striped cotton sweater with a relaxed coastal mood.'],
                ['Atelier Lumi', 'Mock Neck Knit Top', 'mock,neck,knit', 46, 'New', 'A mock neck knit top with a close comfortable fit.'],
                ['Sora Studio', 'Boucle Cropped Cardigan', 'boucle,cardigan', 78, null, 'A boucle cropped cardigan with a soft textured finish.'],
                ['Velvet Leaf', 'Oversized Wool Pullover', 'wool,pullover,sweater', 104, null, 'An oversized wool pullover for colder days.'],
                ['Maison Glow', 'Ribbed Knit Bolero', 'knit,bolero,fashion', 44, 'Sale', 'A ribbed bolero for layering over dresses and tanks.'],
                ['Aster Lane', 'Soft V Neck Sweater', 'v,neck,sweater', 66, null, 'A soft v neck sweater with an easy drape.'],
                ['Atelier Lumi', 'Button Shoulder Jumper', 'button,shoulder,sweater', 72, null, 'A jumper with subtle button shoulder detail.'],
                ['Sora Studio', 'Fine Knit Cardigan Top', 'knit,cardigan,top', 59, null, 'A fine knit cardigan top that can be worn open or closed.'],
            ],
            'Sets' => [
                ['Maison Glow', 'Ribbed Cream Lounge Set', 'cream,lounge,set', 88, 'New', 'A ribbed cream lounge set for soft days at home.'],
                ['Sora Studio', 'Weekend Knit Co-Ord', 'knit,co-ord,set', 94, null, 'A coordinated knit set made for weekend errands.'],
                ['Aster Lane', 'Soft Jersey Travel Set', 'jersey,travel,set', 76, null, 'A jersey travel set for long days and easy movement.'],
                ['Atelier Lumi', 'Linen Shirt and Short Set', 'linen,short,set', 102, 'Sale', 'A linen shirt and short set for warm weather.'],
                ['Velvet Leaf', 'Clean Cotton Sleep Set', 'cotton,pajama,set', 64, null, 'A clean cotton sleep set with breathable comfort.'],
                ['Maison Glow', 'Studio Rib Two Piece', 'ribbed,two,piece,set', 72, null, 'A studio rib two piece for lounging or light movement.'],
                ['Sora Studio', 'Brushed Fleece Set', 'fleece,set,fashion', 82, null, 'A brushed fleece set for relaxed cold mornings.'],
                ['Aster Lane', 'Satin Cami Sleep Set', 'satin,cami,set', 68, 'New', 'A satin cami sleep set with a soft sheen.'],
                ['Atelier Lumi', 'Minimal Modal Set', 'modal,lounge,set', 78, null, 'A minimal modal set with a smooth draped feel.'],
                ['Velvet Leaf', 'Everyday Layering Set', 'layering,set,fashion', 84, 'Sale', 'A simple layering set for building easy outfits.'],
                ['Maison Glow', 'Cotton Rib Tank Set', 'cotton,rib,tank,set', 58, null, 'A cotton rib tank and short set for everyday wear.'],
                ['Sora Studio', 'Wide Leg Knit Set', 'wide,leg,knit,set', 96, null, 'A wide leg knit set with a relaxed polished shape.'],
                ['Aster Lane', 'Waffle Robe Set', 'waffle,robe,set', 74, null, 'A waffle robe set for after-shower comfort.'],
                ['Atelier Lumi', 'Silky Blouse Trouser Set', 'silky,trouser,set', 128, 'New', 'A silky blouse and trouser set for elegant evenings.'],
                ['Velvet Leaf', 'Soft Yoga Co-Ord', 'yoga,set,fashion', 69, null, 'A soft yoga co-ord for stretching and errands.'],
                ['Maison Glow', 'Cable Lounge Co-Ord', 'cable,knit,set', 92, null, 'A cable knit lounge co-ord with cozy texture.'],
                ['Sora Studio', 'Poplin Shirt Set', 'poplin,shirt,set', 86, 'Sale', 'A poplin shirt set with a clean crisp finish.'],
                ['Aster Lane', 'Travel Hoodie Set', 'hoodie,set,fashion', 89, null, 'A hoodie travel set for airport days and comfort.'],
                ['Atelier Lumi', 'Ribbed Skirt Set', 'ribbed,skirt,set', 98, null, 'A ribbed skirt set with an elevated everyday shape.'],
                ['Velvet Leaf', 'Cotton Gauze Set', 'cotton,gauze,set', 81, null, 'A cotton gauze set for light breathable dressing.'],
            ],
            'Accessories' => [
                ['Maison Glow', 'Rose Quartz Facial Roller', 'rose,quartz,roller', 26, 'New', 'A cooling rose quartz roller for facial massage.'],
                ['Aster Lane', 'Pearl Mini Shoulder Bag', 'pearl,mini,bag', 78, null, 'A pearl mini shoulder bag for evening essentials.'],
                ['Velvet Leaf', 'Silk Cloud Scrunchie Set', 'silk,scrunchie', 18, null, 'A set of soft silk scrunchies for gentle hair styling.'],
                ['Sora Studio', 'Canvas Beauty Pouch', 'canvas,beauty,pouch', 24, 'Sale', 'A canvas pouch for skincare, makeup, and travel.'],
                ['Atelier Lumi', 'Ribbed Wool Scarf', 'wool,scarf', 44, null, 'A ribbed wool scarf for cold weather layering.'],
                ['Maison Glow', 'Gold Hoop Duo', 'gold,hoop,earrings', 36, null, 'A pair of gold hoop earrings for daily wear.'],
                ['Aster Lane', 'Soft Travel Organizer', 'travel,organizer,bag', 32, null, 'A soft organizer for chargers, beauty, and small extras.'],
                ['Velvet Leaf', 'Cotton Makeup Rounds', 'cotton,makeup,pads', 14, 'New', 'Reusable cotton rounds for cleansing and toner.'],
                ['Sora Studio', 'Minimal Hair Claw', 'hair,claw,accessory', 16, null, 'A minimal hair claw for quick polished styles.'],
                ['Atelier Lumi', 'Satin Sleep Eye Mask', 'satin,eye,mask', 22, 'Sale', 'A satin sleep eye mask with a smooth soft touch.'],
                ['Maison Glow', 'Ceramic Vanity Tray', 'ceramic,vanity,tray', 34, null, 'A ceramic tray for perfume, skincare, and jewelry.'],
                ['Aster Lane', 'Quilted Makeup Bag', 'quilted,makeup,bag', 29, null, 'A quilted makeup bag with a soft compact shape.'],
                ['Velvet Leaf', 'Cashmere Beanie', 'cashmere,beanie', 39, null, 'A soft beanie for cold morning walks.'],
                ['Sora Studio', 'Slim Leather Belt', 'leather,belt,fashion', 42, 'New', 'A slim leather belt for dresses, denim, and tailoring.'],
                ['Atelier Lumi', 'Pearl Hair Pin Set', 'pearl,hair,pin', 21, null, 'A set of pearl hair pins for easy occasion styling.'],
                ['Maison Glow', 'Mini Fragrance Roller', 'perfume,roller,bottle', 28, null, 'A mini fragrance roller for handbag touch-ups.'],
                ['Aster Lane', 'Woven Market Tote', 'woven,tote,bag', 46, 'Sale', 'A woven tote bag for market days and sunny trips.'],
                ['Velvet Leaf', 'Spa Headband', 'spa,headband,skincare', 15, null, 'A soft spa headband for cleansing and masks.'],
                ['Sora Studio', 'Gold Layered Necklace', 'gold,necklace,jewelry', 49, null, 'A layered gold necklace with a clean minimal shine.'],
                ['Atelier Lumi', 'Silk Twilly Scarf', 'silk,scarf,fashion', 38, null, 'A silk twilly scarf for hair, bags, and neck styling.'],
            ],
        ];

        $categories = collect(array_keys($catalog))->mapWithKeys(fn (string $name) => [
            $name => Category::query()->firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            ),
        ]);

        $brands = collect($catalog)
            ->flatten(1)
            ->pluck(0)
            ->unique()
            ->mapWithKeys(fn (string $name) => [
                $name => Brand::query()->firstOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name]
                ),
            ]);

        $id = 1;

        foreach ($catalog as $categoryName => $products) {
            foreach ($products as [$brandName, $name, $imageKeywords, $price, $tag, $description]) {
                $oldPrice = $tag === 'Sale' ? $price + 18 : null;
                $recommendationData = $this->recommendationData($categoryName, $imageKeywords, $id);
                $variants = $this->variantsFor($categoryName, $id);

                $product = Product::query()->updateOrCreate(
                    ['sku' => 'MG-'.str_pad((string) $id, 4, '0', STR_PAD_LEFT)],
                    [
                        'category_id' => $categories[$categoryName]->id,
                        'brand_id' => $brands[$brandName]->id,
                        'name' => $name,
                        'slug' => Str::slug($name.'-'.$id),
                        'description' => $description,
                        'material' => $recommendationData['material'],
                        'skin_type' => $recommendationData['skin_type'],
                        'skin_concern' => $recommendationData['skin_concern'],
                        'occasion' => $recommendationData['occasion'],
                        'product_tags' => $recommendationData['product_tags'],
                        'price' => $price,
                        'old_price' => $oldPrice,
                        'rating' => round(4.2 + (($id % 8) * 0.1), 1),
                        'tag' => $tag,
                        'stock' => collect($variants)->sum('stock'),
                        'is_active' => true,
                    ]
                );

                $product->images()->delete();
                $product->variants()->delete();

                foreach ($this->imageUrls($categoryName, $id) as $position => $url) {
                    $product->images()->create([
                        'url' => $url,
                        'alt' => $product->name,
                        'position' => $position,
                    ]);
                }

                foreach ($variants as $variantIndex => $variant) {
                    $product->variants()->create([
                        'sku' => $product->sku.'-V'.str_pad((string) ($variantIndex + 1), 2, '0', STR_PAD_LEFT),
                        ...$variant,
                    ]);
                }

                $id++;
            }
        }
    }

    private function recommendationData(string $categoryName, string $keywords, int $seed): array
    {
        $keywordTags = collect(explode(',', $keywords))
            ->map(fn (string $tag) => trim($tag))
            ->filter()
            ->values();

        $base = [
            'material' => null,
            'skin_type' => null,
            'skin_concern' => null,
            'occasion' => null,
            'product_tags' => $keywordTags->all(),
        ];

        if ($categoryName === 'Skincare') {
            $skinTypes = ['Dry', 'Sensitive', 'Combination', 'Oily', 'Normal'];
            $concerns = ['Hydration', 'Barrier repair', 'Glow', 'Redness', 'Texture', 'Pores'];

            return [
                ...$base,
                'material' => $this->pick(['Cream', 'Gel', 'Oil', 'Balm', 'Mist'], $seed),
                'skin_type' => $this->pick($skinTypes, $seed),
                'skin_concern' => $this->pick($concerns, $seed + 2),
                'occasion' => $this->pick(['Morning routine', 'Night routine', 'Travel', 'Post-shower'], $seed),
                'product_tags' => $keywordTags->merge(['beauty', 'routine', strtolower($this->pick($concerns, $seed + 2))])->unique()->values()->all(),
            ];
        }

        $materials = [
            'Dresses' => ['Linen', 'Satin', 'Cotton', 'Knit', 'Silk blend', 'Jersey', 'Denim'],
            'Knitwear' => ['Alpaca blend', 'Organic cotton', 'Merino wool', 'Cashmere touch', 'Boucle', 'Wool blend'],
            'Sets' => ['Ribbed cotton', 'Knit', 'Jersey', 'Linen', 'Modal', 'Satin', 'Cotton gauze'],
            'Accessories' => ['Silk', 'Leather', 'Gold plated', 'Cotton', 'Canvas', 'Wool', 'Ceramic'],
        ];

        return [
            ...$base,
            'material' => $this->pick($materials[$categoryName] ?? ['Cotton'], $seed),
            'occasion' => $this->pick(['Everyday', 'Work', 'Evening', 'Travel', 'Weekend', 'Occasion'], $seed + 1),
            'product_tags' => $keywordTags->merge(['fashion', strtolower($categoryName), strtolower($this->pick(['Everyday', 'Work', 'Evening', 'Travel', 'Weekend', 'Occasion'], $seed + 1))])->unique()->values()->all(),
        ];
    }

    private function variantsFor(string $categoryName, int $seed): array
    {
        if ($categoryName === 'Skincare') {
            return collect(['30 ml', '50 ml', '100 ml'])
                ->map(fn (string $size, int $index) => [
                    'size' => $size,
                    'color' => null,
                    'stock' => 6 + (($seed + $index) % 12),
                ])
                ->all();
        }

        if ($categoryName === 'Accessories') {
            return collect($this->colorsFor($seed, 3))
                ->map(fn (string $color, int $index) => [
                    'size' => 'One Size',
                    'color' => $color,
                    'stock' => 5 + (($seed + $index) % 10),
                ])
                ->all();
        }

        $sizes = ['XS', 'S', 'M', 'L', 'XL'];
        $colors = $this->colorsFor($seed, 3);

        return collect($sizes)
            ->flatMap(fn (string $size, int $sizeIndex) => collect($colors)->map(fn (string $color, int $colorIndex) => [
                'size' => $size,
                'color' => $color,
                'stock' => 2 + (($seed + $sizeIndex + $colorIndex) % 8),
            ]))
            ->values()
            ->all();
    }

    private function colorsFor(int $seed, int $count): array
    {
        $colors = ['Ivory', 'Black', 'Rose', 'Sage', 'Chocolate', 'Cream', 'Denim', 'Gold'];

        return collect(range(0, $count - 1))
            ->map(fn (int $offset) => $this->pick($colors, $seed + $offset))
            ->unique()
            ->values()
            ->all();
    }

    private function pick(array $values, int $seed): string
    {
        return $values[$seed % count($values)];
    }

    private function imageUrls(string $categoryName, int $seed): array
    {
        $imagePools = [
            'Skincare' => [
                'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80',
            ],
            'Dresses' => [
                'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
            ],
            'Knitwear' => [
                'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
            ],
            'Sets' => [
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
            ],
            'Accessories' => [
                'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80',
                'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
            ],
        ];

        $pool = $imagePools[$categoryName];

        return [
            $pool[($seed - 1) % count($pool)],
            $pool[$seed % count($pool)],
            $pool[($seed + 1) % count($pool)],
            $pool[($seed + 2) % count($pool)],
        ];
    }
}
