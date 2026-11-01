/* ============================================================
   MEHNDI STUDIO â€” Products & Category Database Engine
   Manages Main Categories, Subcategories, Variations,
   Individual Prices, Stock, Cart Items & Orders.
   ============================================================ */

(function () {
  'use strict';

  // â”€â”€ Database Version / Key â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const DB_STORAGE_KEY = 'mehndi_catalog_v2';
  const ORDERS_STORAGE_KEY = 'mehndi_orders_v2';

  // â”€â”€ Main Categories Definition â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const DEFAULT_CATEGORIES = [
    {
      id: 'mehndi-cones',
      name: 'Mehndi Cones',
      description: 'Premium organic & specialty henna cones crafted with pure ingredients for dark, rich, long-lasting stains.',
      hasSubcategory: true,
      hasSize: false,
      subcategoryLabel: 'Select Cone Type',
      image: 'images/mehndi cone.jpeg',
      images: ['images/mehndi cone.jpeg']
    },
    {
      id: 'mehndi-powder',
      name: 'Mehndi Powder',
      description: 'Triple-sifted 100% natural Sojat henna powder for professional artists and home paste makers.',
      hasSubcategory: false,
      hasSize: true,
      sizeLabel: 'Select Weight',
      image: 'images/mehndi powder.jpeg',
      images: ['images/mehndi powder.jpeg']
    },
    {
      id: 'mehndi-oil',
      name: 'Mehndi Oil',
      icon: 'ðŸ«™',
      description: 'Signature darkening essential oils formulated with cajeput, eucalyptus, and clove for maximum stain depth.',
      hasSubcategory: true,
      hasSize: true,
      subcategoryLabel: 'Select Oil Type',
      sizeLabel: 'Select Bottle Size',
      image: 'images/mehndi_oil.jpg',
      images: ['images/mehndi_oil.jpg']
    },
    {
      id: 'piping-bag',
      name: 'Piping Bag',
      icon: 'ðŸ›ï¸',
      description: 'Durable, food-grade transparent plastic piping bags for smooth, mess-free cone filling and paste handling.',
      hasSubcategory: false,
      hasSize: true,
      sizeLabel: 'Select Size',
      image: 'images/Pipping Bag (Small).webp',
      images: ['images/Pipping Bag (Small).webp', 'images/Pipping Bag (Big).webp']
    },
    {
      id: 'measuring-cup',
      name: 'Measuring Cup',
      icon: 'ðŸ§ª',
      description: 'Clear graduated measuring cups for precise ingredient ratios and consistent henna paste preparation.',
      hasSubcategory: false,
      hasSize: true,
      sizeLabel: 'Select Capacity',
      image: 'images/Measurement Cup(25ml).webp',
      images: ['images/Measurement Cup(25ml).webp', 'images/Measurement Cup(50ml).webp', 'images/Measurement Cup(100ml).webp']
    },
    {
      id: 'spatula',
      name: 'Spatula',
      icon: 'ðŸ¥„',
      description: 'Flexible stainless steel spatulas designed for easy paste mixing, scraping, and cone filling.',
      hasSubcategory: false,
      hasSize: true,
      sizeLabel: 'Select Size',
      image: 'images/spatula.webp',
      images: ['images/spatula.webp']
    },
    {
      id: 'weight-machine',
      name: 'Weight Machine',
      icon: 'âš–ï¸',
      description: 'High-precision digital scale accurate to 0.1g for flawless henna recipes and batch consistency.',
      hasSubcategory: false,
      hasSize: false,
      image: 'images/mehndi_tools.jpg',
      images: ['images/mehndi_tools.jpg']
    },
    {
      id: 'tap-cutter',
      name: 'Tap Cutter',
      icon: 'âœ‚ï¸',
      description: 'Precision safety tape cutters for quick, clean tape dispensing and cone tip trimming.',
      hasSubcategory: false,
      hasSize: true,
      sizeLabel: 'Select Size',
      image: 'images/mehndi_tools.jpg',
      images: ['images/mehndi_tools.jpg']
    },
    {
      id: 'tap-roll',
      name: 'Tap Roll',
      icon: 'ðŸŽ',
      description: 'High-tack transparent BOPP adhesive tape rolls for airtight, leakproof cone rolling and sealing.',
      hasSubcategory: false,
      hasSize: true,
      sizeLabel: 'Select Size',
      image: 'images/Tap Roll (small).webp',
      images: ['images/Tap Roll (small).webp', 'images/Tap Roll (big).webp']
    },
    {
      id: 'sheet',
      name: 'Sheet',
      icon: 'ðŸ“„',
      description: 'Specially treated cellophane acrylic practice sheets for mastering henna strokes and patterns.',
      hasSubcategory: false,
      hasSize: true,
      sizeLabel: 'Select Texture / Type',
      image: 'images/sheet.webp',
      images: ['images/sheet.webp']
    },
    {
      id: 'silver-sheet',
      name: 'Silver Sheet',
      icon: 'âœ¨',
      description: 'Delicate metallic silver foil sheets for stunning festive accents and modern bridal adornments.',
      hasSubcategory: false,
      hasSize: false,
      image: 'images/silver sheet.jpeg',
      images: ['images/silver sheet.jpeg']
    },
    {
      id: 'mehndi-pillow',
      name: 'Mehndi Pillow',
      icon: 'ðŸ›ï¸',
      description: 'Ergonomic plush velvet hand rest cushion providing steady, fatigue-free comfort during bridal sessions.',
      hasSubcategory: false,
      hasSize: false,
      image: 'images/mehndi pillow.webp',
      images: ['images/mehndi pillow.webp']
    },
    {
      id: 'stocking',
      name: 'Stocking',
      icon: 'ðŸ§¦',
      description: 'Ultra-fine mesh stockings for double-filtering henna paste to ensure zero clogs and ultra-fine lines.',
      hasSubcategory: false,
      hasSize: false,
      image: 'images/stocking.jpeg',
      images: ['images/stocking.jpeg']
    },
    {
      id: 'aftercare-balm',
      name: 'After Care Balm',
      icon: 'ðŸŒ¸',
      description: 'All-natural herbal beeswax balm that seals in color, nourishes skin, and extends henna stain longevity.',
      hasSubcategory: false,
      hasSize: true,
      sizeLabel: 'Select Quantity Option',
      image: 'images/after care balm.jpeg',
      images: ['images/after care balm.jpeg']
    },
    {
      id: 'aftercare-oil',
      name: 'After Care Oil',
      icon: 'ðŸ’§',
      description: 'Deep-penetrating botanical blend for post-henna hydration and rich mahogany stain development.',
      hasSubcategory: false,
      hasSize: true,
      sizeLabel: 'Select Quantity Option',
      image: 'images/after care oil.jpeg',
      images: ['images/after care oil.jpeg']
    },
    {
      id: 'mehndi-pins',
      name: '0.38mm Pins',
      icon: 'ðŸ“Œ',
      description: 'Rust-proof 0.38mm precision steel pins for unclogging fine cone tips and securing needle-fine cones.',
      hasSubcategory: false,
      hasSize: false,
      image: 'images/0.38mm pins.jpeg',
      images: ['images/0.38mm pins.jpeg']
    }
  ];

  // â”€â”€ All Variations & Products Catalog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const DEFAULT_VARIATIONS = [
    // â”€â”€ 1. MEHNDI CONES (9 Subcategories) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'cone-natural-bridal',
      categoryId: 'mehndi-cones',
      categoryName: 'Mehndi Cones',
      subCategory: 'Natural Bridal Mehndi',
      variation: null,
      name: 'Natural Bridal Mehndi Cone',
      price: 149,
      original: 199,
      img: 'images/mehndi cone.jpeg',
      imgs: ['images/mehndi cone.jpeg'],
      rating: 4.9,
      reviews: 248,
      badge: 'Best Seller',
      stock: 'in-stock',
      stockCount: 150,
      description: 'Made from 100% pure triple-sifted Sojat henna leaves with premium cajeput oil. Yields an intense, dark mahogany bridal stain that lasts 2 to 3 weeks.',
      ingredients: ['100% Organic Henna Powder', 'Pure Eucalyptus & Cajeput Oil', 'Lemon Juice', 'Natural Sugar Gum'],
      usage: ['Wash hands thoroughly and dry', 'Snip cone tip to desired thickness', 'Apply design with even pressure', 'Keep paste for 6-8 hours and scrape off'],
      benefits: ['Deep bridal dark stain', 'Chemical-free & skin safe', 'Smooth clog-free paste flow']
    },
    {
      sku: 'cone-gud-kumkum',
      categoryId: 'mehndi-cones',
      categoryName: 'Mehndi Cones',
      subCategory: 'Gud Kumkum Mehndi',
      variation: null,
      name: 'Gud Kumkum Mehndi Cone',
      price: 129,
      original: 169,
      img: 'images/mehndi cone.jpeg',
      imgs: ['images/mehndi cone.jpeg'],
      rating: 4.8,
      reviews: 132,
      badge: 'Traditional',
      stock: 'in-stock',
      stockCount: 85,
      description: 'Infused with traditional organic jaggery (gud) and natural temple kumkum for an auspicious warm red tint ideal for festive rituals and Karwa Chauth.',
      ingredients: ['Pure Henna Extract', 'Organic Jaggery (Gud)', 'Temple Kumkum Pigment', 'Natural Binders'],
      usage: ['Apply on clean skin', 'Leave for 5-6 hours', 'Scrape off without water'],
      benefits: ['Warm reddish-maroon hue', 'Auspicious festival favorite', 'Pure natural recipe']
    },
    {
      sku: 'cone-nail-mehndi',
      categoryId: 'mehndi-cones',
      categoryName: 'Mehndi Cones',
      subCategory: 'Nail Mehndi Cone',
      variation: null,
      name: 'Nail Mehndi Cone',
      price: 99,
      original: 129,
      img: 'images/mehndi cone.jpeg',
      imgs: ['images/mehndi cone.jpeg'],
      rating: 4.7,
      reviews: 94,
      badge: 'Nail Safe',
      stock: 'in-stock',
      stockCount: 120,
      description: 'Specially filtered extra-fine paste engineered for nail plates and cuticles. A pure organic alternative to chemical nail polishes.',
      ingredients: ['Fine Lawsone Henna', 'Natural Fruit Acids', 'Clove Essential Oil'],
      usage: ['Buff clean unpolished nails', 'Apply thick layer over nail plate', 'Allow to dry for 3-4 hours'],
      benefits: ['Stains nails without chipping', 'Non-toxic & chemical-free', 'Deep natural burgundy tint']
    },
    {
      sku: 'cone-instant-mehndi',
      categoryId: 'mehndi-cones',
      categoryName: 'Mehndi Cones',
      subCategory: 'Instant Mehndi',
      variation: null,
      name: 'Instant Mehndi Cone',
      price: 119,
      original: 159,
      img: 'images/mehndi cone.jpeg',
      imgs: ['images/mehndi cone.jpeg'],
      rating: 4.6,
      reviews: 185,
      badge: 'Quick Color',
      stock: 'in-stock',
      stockCount: 95,
      description: 'Fast-acting quick-dry formula developed for emergency celebrations and rush parties. Develops vibrant color in just 1 to 2 hours.',
      ingredients: ['Fast-release Natural Henna', 'Tea Tree Essential Oil', 'Natural Fixatives'],
      usage: ['Apply pattern', 'Wait 60 to 90 minutes', 'Gently peel off'],
      benefits: ['Full color in 1-2 hours', 'Perfect for last minute events', 'Smooth consistent line flow']
    },
    {
      sku: 'cone-black-mehndi',
      categoryId: 'mehndi-cones',
      categoryName: 'Mehndi Cones',
      subCategory: 'Black Mehndi',
      variation: null,
      name: 'Black Mehndi Cone',
      price: 159,
      original: 199,
      img: 'images/mehndi cone.jpeg',
      imgs: ['images/mehndi cone.jpeg'],
      rating: 4.7,
      reviews: 114,
      badge: 'High Contrast',
      stock: 'in-stock',
      stockCount: 70,
      description: 'Jet black outline and shading henna cone loved by professional artists for sharp border contrast and tattoo-style body art.',
      ingredients: ['Henna Paste', 'Natural Black Tea & Clove Extract', 'Cosmetic Safe Carbon Pigment'],
      usage: ['Create outlines or bold patterns', 'Allow 4 hours drying time', 'Rinse gently with cool water'],
      benefits: ['Dramatic jet-black stain', 'Ideal for outlining Arabic designs', 'Clean crisp edges']
    },
    {
      sku: 'cone-glitter-mehndi',
      categoryId: 'mehndi-cones',
      categoryName: 'Mehndi Cones',
      subCategory: 'Glitter Mehndi',
      variation: null,
      name: 'Glitter Mehndi Cone',
      price: 179,
      original: 229,
      img: 'images/mehndi cone.jpeg',
      imgs: ['images/mehndi cone.jpeg'],
      rating: 4.8,
      reviews: 142,
      badge: 'Sparkle',
      stock: 'in-stock',
      stockCount: 80,
      description: 'Shimmering cosmetic glitter infused into a gel-henna hybrid base. Adds festive sparkle over bridal henna or worn as standalone party art.',
      ingredients: ['Aloe Vera Gel Base', 'Cosmetic-grade Biodegradable Glitter', 'Essential Fixative'],
      usage: ['Outline existing mehndi or paint party motifs', 'Dries in 15 minutes', 'Washable with mild soap'],
      benefits: ['Glitzy sparkling effect', 'Safe for sensitive skin', 'Elevates bridal photography']
    },
    {
      sku: 'cone-long-lasting',
      categoryId: 'mehndi-cones',
      categoryName: 'Mehndi Cones',
      subCategory: 'Long Lasting Mehndi',
      variation: null,
      name: 'Long Lasting Mehndi Cone',
      price: 169,
      original: 219,
      img: 'images/mehndi cone.jpeg',
      imgs: ['images/mehndi cone.jpeg'],
      rating: 4.9,
      reviews: 210,
      badge: 'Top Rated',
      stock: 'in-stock',
      stockCount: 110,
      description: 'Enhanced lawsone binding formula designed for high skin retention. The stain remains visibly dark and vibrant for 3 to 4 weeks.',
      ingredients: ['High Lawsone Rajasthani Henna', 'Eucalyptus Globulus Oil', 'Pure Clove Bud Oil'],
      usage: ['Apply generously', 'Keep paste warm for 8-10 hours', 'Apply aftercare oil upon removal'],
      benefits: ['3-4 weeks lasting power', 'Resists premature fading', 'Ultra-deep color peak']
    },
    {
      sku: 'cone-white-mehndi',
      categoryId: 'mehndi-cones',
      categoryName: 'Mehndi Cones',
      subCategory: 'White Mehndi',
      variation: null,
      name: 'White Mehndi Cone',
      price: 149,
      original: 189,
      img: 'images/mehndi cone.jpeg',
      imgs: ['images/mehndi cone.jpeg'],
      rating: 4.5,
      reviews: 86,
      badge: 'Modern Trend',
      stock: 'in-stock',
      stockCount: 65,
      description: 'Chic body art adhesive cone producing striking lace-white body art patterns. Popular for modern fusion brides, maternity shoots, and editorial looks.',
      ingredients: ['Cosmetic Grade Body Paint', 'Water-resistant Polymer', 'Aloe Leaf Extract'],
      usage: ['Apply directly onto clean skin', 'Dries waterproof in 30 minutes', 'Gently peels off when desired'],
      benefits: ['Stunning lace-like white motifs', 'Water-resistant for 2-3 days', 'No staining or dye commitment']
    },
    {
      sku: 'cone-practice-mehndi',
      categoryId: 'mehndi-cones',
      categoryName: 'Mehndi Cones',
      subCategory: 'Practice Mehndi',
      variation: null,
      name: 'Practice Mehndi Cone',
      price: 89,
      original: 119,
      img: 'images/mehndi cone.jpeg',
      imgs: ['images/mehndi cone.jpeg'],
      rating: 4.6,
      reviews: 275,
      badge: 'Budget Friendly',
      stock: 'in-stock',
      stockCount: 200,
      description: 'Cost-effective washable henna paste cone for students, mehndi academies, and daily practice on acrylic practice boards and hands.',
      ingredients: ['Natural Starch Base', 'Light Henna Powder', 'Washable Food Coloring'],
      usage: ['Use freely on acrylic sheets or skin', 'Washes completely clean with warm water and soap'],
      benefits: ['Zero skin staining', 'Smooth flow mimicking real bridal cones', 'Affordable for beginners']
    },

    // â”€â”€ 2. MEHNDI POWDER (4 Quantity / Weight Options) â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'powder-100g',
      categoryId: 'mehndi-powder',
      categoryName: 'Mehndi Powder',
      subCategory: null,
      variation: '100g',
      name: 'Mehndi Powder - 100g',
      price: 149,
      original: 199,
      img: 'images/mehndi powder.jpeg',
      imgs: ['images/mehndi powder.jpeg'],
      rating: 4.8,
      reviews: 198,
      badge: 'Trial Pack',
      stock: 'in-stock',
      stockCount: 130,
      description: 'Triple-cloth sifted 100g pack of pure organic Sojat henna powder. Yields approximately 8-10 professional bridal cones.',
      ingredients: ['100% Lawsonia Inermis (Sojat Henna Leaves)'],
      usage: ['Mix 100g powder with 30ml lemon juice and 30ml mehndi oil', 'Rest paste for 8-12 hours until dye releases', 'Fill into piping bags and roll cones'],
      benefits: ['Zero clumps or twigs', 'High natural dye content (>3.2% lawsone)', 'Organically harvested']
    },
    {
      sku: 'powder-200g',
      categoryId: 'mehndi-powder',
      categoryName: 'Mehndi Powder',
      subCategory: null,
      variation: '200g',
      name: 'Mehndi Powder - 200g',
      price: 269,
      original: 349,
      img: 'images/mehndi powder.jpeg',
      imgs: ['images/mehndi powder.jpeg'],
      rating: 4.9,
      reviews: 145,
      badge: 'Popular',
      stock: 'in-stock',
      stockCount: 90,
      description: '200g value pack for active artists and festive gatherings. Fills approximately 15-20 high-density bridal cones.',
      ingredients: ['100% Premium Stone-ground Sojat Henna'],
      usage: ['Combine with essential oils and lemon-sugar water', 'Let rest overnight for dark dye release'],
      benefits: ['Silky micro-fine texture', 'Consistent batch quality', 'Airtight resealable zipper pouch']
    },
    {
      sku: 'powder-500g',
      categoryId: 'mehndi-powder',
      categoryName: 'Mehndi Powder',
      subCategory: null,
      variation: '500g',
      name: 'Mehndi Powder - 500g',
      price: 549,
      original: 699,
      img: 'images/mehndi powder.jpeg',
      imgs: ['images/mehndi powder.jpeg'],
      rating: 4.9,
      reviews: 118,
      badge: 'Artist Pack',
      stock: 'in-stock',
      stockCount: 60,
      description: 'Half-kilogram studio size tailored for busy bridal artists and salons. Produces 45-50 full cones.',
      ingredients: ['100% Rajasthani Henna Powder (Crop Season Selection)'],
      usage: ['Mix in 250g batches as needed', 'Store remaining powder in dry airtight container away from sunlight'],
      benefits: ['Wholesale studio pricing', 'Extra-fresh current harvest crop', 'Smooth stringy paste consistency']
    },
    {
      sku: 'powder-1kg',
      categoryId: 'mehndi-powder',
      categoryName: 'Mehndi Powder',
      subCategory: null,
      variation: '1KG',
      name: 'Mehndi Powder - 1KG',
      price: 999,
      original: 1299,
      img: 'images/mehndi powder.jpeg',
      imgs: ['images/mehndi powder.jpeg'],
      rating: 5.0,
      reviews: 84,
      badge: 'Best Value',
      stock: 'in-stock',
      stockCount: 40,
      description: 'Bulk 1 kilogram master pack for mehndi academies, wholesalers, and high-volume wedding seasons.',
      ingredients: ['100% Pure Organic Sojat Lawsonia Inermis'],
      usage: ['Decant into smaller airtight jars', 'Shelf life 18 months when sealed'],
      benefits: ['Maximum savings per gram', 'Tested highest lawsone dye concentration', 'Guaranteed zero chemicals']
    },

    // â”€â”€ 3. MEHNDI OIL (3 Subcategories Ã— 6 Sizes = 18 Variations) â”€
    // Bridal Oil
    {
      sku: 'oil-bridal-30ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Bridal Oil',
      variation: '30ml',
      name: 'Bridal Mehndi Oil - 30ml',
      price: 149,
      original: 199,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.8,
      reviews: 167,
      badge: 'Best Seller',
      stock: 'in-stock',
      stockCount: 140,
      description: 'Handcrafted bridal darkening formula with pure cajeput, eucalyptus, and clove bud terps. Promotes deep dark mahogany stain development.',
      ingredients: ['Pure Australian Cajeput Oil', 'Nilgiri Eucalyptus Essential Oil', 'Clove Bud Terpenes'],
      usage: ['Add 30ml per 100g henna powder, or massage gently over fresh stain'],
      benefits: ['Accelerates oxidation for deep bridal color', 'Natural antiseptic', 'Aromatic floral notes']
    },
    {
      sku: 'oil-bridal-50ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Bridal Oil',
      variation: '50ml',
      name: 'Bridal Mehndi Oil - 50ml',
      price: 229,
      original: 299,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.8,
      reviews: 121,
      badge: 'Popular',
      stock: 'in-stock',
      stockCount: 95,
      description: '50ml dropper bottle of signature Bridal Oil. Enough for multiple bridal applications and paste preparation.',
      ingredients: ['Cajeput Oil', 'Eucalyptus Oil', 'Clove Terpenes', 'Lavender Carrier Base'],
      usage: ['Add directly into henna paste or use as skin pre-wash and post-care oil'],
      benefits: ['Enhanced dye penetration', 'Gentle on skin', 'UV protective glass dropper']
    },
    {
      sku: 'oil-bridal-100ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Bridal Oil',
      variation: '100ml',
      name: 'Bridal Mehndi Oil - 100ml',
      price: 399,
      original: 499,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.9,
      reviews: 98,
      badge: 'Artist Size',
      stock: 'in-stock',
      stockCount: 75,
      description: '100ml professional size for practicing henna artists. Maximum terpene concentration for foolproof dark stains.',
      ingredients: ['Concentrated Essential Terpene Blend', 'Botanical Stabilizers'],
      usage: ['Mix with powder batches or apply after paste removal'],
      benefits: ['Salon-grade strength', 'Economical artist size', 'Deep rich bridal stain']
    },
    {
      sku: 'oil-bridal-200ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Bridal Oil',
      variation: '200ml',
      name: 'Bridal Mehndi Oil - 200ml',
      price: 699,
      original: 899,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.9,
      reviews: 62,
      badge: 'Pro Pack',
      stock: 'in-stock',
      stockCount: 50,
      description: '200ml value bottle for salons and studios managing continuous bridal wedding bookings.',
      ingredients: ['Premium Terpene Extracts', 'Vitamin E Carrier'],
      usage: ['Dispense into working bottles or mix in large batch paste tanks'],
      benefits: ['High yield', 'Consistent purity', 'Great studio value']
    },
    {
      sku: 'oil-bridal-500ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Bridal Oil',
      variation: '500ml',
      name: 'Bridal Mehndi Oil - 500ml',
      price: 1499,
      original: 1899,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 5.0,
      reviews: 41,
      badge: 'Studio Bulk',
      stock: 'in-stock',
      stockCount: 30,
      description: 'Half-liter commercial container for high-output mehndi studios and cone packaging businesses.',
      ingredients: ['100% Pure Essential Terpene Fractions'],
      usage: ['Studio bulk production'],
      benefits: ['Wholesale discount pricing', 'Batch-tested quality']
    },
    {
      sku: 'oil-bridal-1l',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Bridal Oil',
      variation: '1 Liter',
      name: 'Bridal Mehndi Oil - 1 Liter',
      price: 2499,
      original: 2999,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 5.0,
      reviews: 29,
      badge: 'Wholesale',
      stock: 'in-stock',
      stockCount: 20,
      description: '1 Liter master can of our signature Bridal darkening oil for cone manufacturers and wholesalers.',
      ingredients: ['Full Strength Pure Terpenes'],
      usage: ['Industrial & academy manufacturing'],
      benefits: ['Lowest cost per ml', 'Tamper-proof industrial seal']
    },

    // Red Oil
    {
      sku: 'oil-red-30ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Red Oil',
      variation: '30ml',
      name: 'Red Mehndi Oil - 30ml',
      price: 149,
      original: 189,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.7,
      reviews: 134,
      badge: 'Red Tones',
      stock: 'in-stock',
      stockCount: 110,
      description: 'Formulated with red sandalwood and rosehip extracts to stimulate warm, vibrant cherry-red undertones in henna art.',
      ingredients: ['Red Sandalwood Extract', 'Rosehip Oil', 'Cajeput Terpenes'],
      usage: ['Add to henna mix or apply post removal to highlight red undertones'],
      benefits: ['Rich ruby-red henna tint', 'Gentle soothing aroma', 'Skin nourishing']
    },
    {
      sku: 'oil-red-50ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Red Oil',
      variation: '50ml',
      name: 'Red Mehndi Oil - 50ml',
      price: 229,
      original: 289,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.7,
      reviews: 88,
      badge: 'Popular',
      stock: 'in-stock',
      stockCount: 80,
      description: '50ml bottle of Red Mehndi Oil for artists who love traditional Rajasthani warm hues.',
      ingredients: ['Red Sandalwood', 'Essential Oils', 'Botanical Carriers'],
      usage: ['Apply generously to dried mehndi design'],
      benefits: ['Warm radiant color', 'Skin hydrating', 'Long lasting stain']
    },
    {
      sku: 'oil-red-100ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Red Oil',
      variation: '100ml',
      name: 'Red Mehndi Oil - 100ml',
      price: 399,
      original: 489,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.8,
      reviews: 73,
      badge: 'Artist Size',
      stock: 'in-stock',
      stockCount: 60,
      description: '100ml professional size Red Mehndi Oil for wedding seasons and festive orders.',
      ingredients: ['Red Botanical Infusion', 'Pure Terpenes'],
      usage: ['Salon & bridal application'],
      benefits: ['Vibrant color boost', 'Professional quantity']
    },
    {
      sku: 'oil-red-200ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Red Oil',
      variation: '200ml',
      name: 'Red Mehndi Oil - 200ml',
      price: 699,
      original: 849,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.8,
      reviews: 45,
      badge: 'Pro Pack',
      stock: 'in-stock',
      stockCount: 40,
      description: '200ml bulk bottle of Red Oil for salons catering to traditional red-mehndi lovers.',
      ingredients: ['Red Sandalwood Extract Blend'],
      usage: ['Studio use'],
      benefits: ['Great economy', 'Consistent red tones']
    },
    {
      sku: 'oil-red-500ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Red Oil',
      variation: '500ml',
      name: 'Red Mehndi Oil - 500ml',
      price: 1499,
      original: 1799,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.9,
      reviews: 31,
      badge: 'Studio Bulk',
      stock: 'in-stock',
      stockCount: 25,
      description: 'Half-liter commercial bottle of Red Mehndi Oil for large academies and studios.',
      ingredients: ['Premium Red Oil Extract'],
      usage: ['Wholesale batching'],
      benefits: ['Bulk economy', 'Reliable performance']
    },
    {
      sku: 'oil-red-1l',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Red Oil',
      variation: '1 Liter',
      name: 'Red Mehndi Oil - 1 Liter',
      price: 2499,
      original: 2899,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.9,
      reviews: 19,
      badge: 'Wholesale',
      stock: 'in-stock',
      stockCount: 15,
      description: '1 Liter bulk container of Red Mehndi Oil for resellers and cone producers.',
      ingredients: ['Pure Red Henna Oil Blend'],
      usage: ['Commercial cone filling'],
      benefits: ['Best wholesale price', 'Sealed master pack']
    },

    // Mix Oil
    {
      sku: 'oil-mix-30ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Mix Oil',
      variation: '30ml',
      name: 'Mix Mehndi Oil - 30ml',
      price: 169,
      original: 219,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.9,
      reviews: 156,
      badge: 'Best Seller',
      stock: 'in-stock',
      stockCount: 120,
      description: 'The best of both worlds â€” harmoniously blends dark bridal terpenes with red sandalwood oil for complex mahogany-burgundy tones.',
      ingredients: ['Cajeput & Eucalyptus Terpenes', 'Red Sandalwood Extract', 'Tea Tree Oil', 'Clove Bud Essential'],
      usage: ['Use directly in paste creation or as post-peel aftercare'],
      benefits: ['Deepest multifaceted stain', 'Universal favorite of top artists', 'Rapid color peak within 24 hrs']
    },
    {
      sku: 'oil-mix-50ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Mix Oil',
      variation: '50ml',
      name: 'Mix Mehndi Oil - 50ml',
      price: 249,
      original: 319,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.9,
      reviews: 99,
      badge: 'Popular',
      stock: 'in-stock',
      stockCount: 85,
      description: '50ml bottle of balanced Mix Mehndi Oil. Great size for bridal appointments.',
      ingredients: ['Balanced Bridal & Red Oil Compound'],
      usage: ['Add to paste or apply to finished henna'],
      benefits: ['Luxurious aroma', 'Intense dark-red stain']
    },
    {
      sku: 'oil-mix-100ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Mix Oil',
      variation: '100ml',
      name: 'Mix Mehndi Oil - 100ml',
      price: 449,
      original: 549,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.9,
      reviews: 78,
      badge: 'Artist Size',
      stock: 'in-stock',
      stockCount: 65,
      description: '100ml professional size of Mix Mehndi Oil for regular paste makers.',
      ingredients: ['Full Spectrum Mixed Terpenes'],
      usage: ['Professional studio preparation'],
      benefits: ['Balanced color tones', 'Artist trusted formula']
    },
    {
      sku: 'oil-mix-200ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Mix Oil',
      variation: '200ml',
      name: 'Mix Mehndi Oil - 200ml',
      price: 749,
      original: 899,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 4.8,
      reviews: 52,
      badge: 'Pro Pack',
      stock: 'in-stock',
      stockCount: 45,
      description: '200ml bottle of Mix Mehndi Oil for bridal studios.',
      ingredients: ['Mix Oil Master Blend'],
      usage: ['High volume studio mixing'],
      benefits: ['Long lasting bottle', 'Cost effective']
    },
    {
      sku: 'oil-mix-500ml',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Mix Oil',
      variation: '500ml',
      name: 'Mix Mehndi Oil - 500ml',
      price: 1599,
      original: 1899,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 5.0,
      reviews: 35,
      badge: 'Studio Bulk',
      stock: 'in-stock',
      stockCount: 25,
      description: 'Half-liter commercial container of Mix Mehndi Oil.',
      ingredients: ['Concentrated Terpene & Botanical Blend'],
      usage: ['Commercial cone preparation'],
      benefits: ['Bulk studio savings', 'Premium quality']
    },
    {
      sku: 'oil-mix-1l',
      categoryId: 'mehndi-oil',
      categoryName: 'Mehndi Oil',
      subCategory: 'Mix Oil',
      variation: '1 Liter',
      name: 'Mix Mehndi Oil - 1 Liter',
      price: 2799,
      original: 3299,
      img: 'images/mehndi_oil.jpg',
      imgs: ['images/mehndi_oil.jpg'],
      rating: 5.0,
      reviews: 24,
      badge: 'Wholesale',
      stock: 'in-stock',
      stockCount: 15,
      description: '1 Liter wholesale canister of Mix Mehndi Oil for manufacturers and resellers.',
      ingredients: ['Pure Mixed Botanical Extract'],
      usage: ['Industrial cone factories & academies'],
      benefits: ['Best bulk rate', 'Guaranteed freshness']
    },

    // â”€â”€ 4. PIPING BAG (Small Size, Big Size) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'piping-small',
      categoryId: 'piping-bag',
      categoryName: 'Piping Bag',
      subCategory: null,
      variation: 'Small Size',
      name: 'Piping Bag - Small Size',
      price: 49,
      original: 69,
      img: 'images/Pipping Bag (Small).webp',
      imgs: ['images/Pipping Bag (Small).webp', 'images/Pipping Bag (Big).webp'],
      rating: 4.6,
      reviews: 182,
      badge: 'Pack of 20',
      stock: 'in-stock',
      stockCount: 150,
      description: 'Small transparent food-grade LDPE piping bags (pack of 20). Perfect for filling individual henna cones neatly with zero paste spillage.',
      ingredients: ['Food-grade Polyethylene (BPA Free)'],
      usage: ['Spoon henna paste into bag, tie top with rubber band, snip bottom corner to pipe into cones'],
      benefits: ['Tear resistant seams', 'Crystal clear transparency', 'Mess-free cone filling']
    },
    {
      sku: 'piping-big',
      categoryId: 'piping-bag',
      categoryName: 'Piping Bag',
      subCategory: null,
      variation: 'Big Size',
      name: 'Piping Bag - Big Size',
      price: 69,
      original: 89,
      img: 'images/Pipping Bag (Big).webp',
      imgs: ['images/Pipping Bag (Big).webp', 'images/Pipping Bag (Small).webp'],
      rating: 4.7,
      reviews: 139,
      badge: 'Pack of 15',
      stock: 'in-stock',
      stockCount: 120,
      description: 'Large heavy-duty piping bags (pack of 15). Ideal for batch paste preparation and transferring large quantities of henna into cones.',
      ingredients: ['Reinforced Virgin LDPE Plastic'],
      usage: ['Fill with up to 500g of paste for continuous cone rolling'],
      benefits: ['Extra capacity', 'Heavy-duty burst proof', 'Smooth paste flow']
    },

    // â”€â”€ 5. MEASURING CUP (25ml, 50ml, 100ml) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'cup-25ml',
      categoryId: 'measuring-cup',
      categoryName: 'Measuring Cup',
      subCategory: null,
      variation: '25ml',
      name: 'Measuring Cup - 25ml',
      price: 39,
      original: 59,
      img: 'images/Measurement Cup(25ml).webp',
      imgs: ['images/Measurement Cup(25ml).webp', 'images/Measurement Cup(50ml).webp', 'images/Measurement Cup(100ml).webp'],
      rating: 4.5,
      reviews: 92,
      badge: 'Precision',
      stock: 'in-stock',
      stockCount: 100,
      description: 'Compact 25ml graduated polypropylene measuring cup with embossed 1ml increments for accurate essential oil dosage.',
      ingredients: ['Chemical-resistant Polypropylene (PP)'],
      usage: ['Measure exact oil amounts for small batches'],
      benefits: ['Clear legible markings', 'Essential oil safe', 'Reusable & washable']
    },
    {
      sku: 'cup-50ml',
      categoryId: 'measuring-cup',
      categoryName: 'Measuring Cup',
      subCategory: null,
      variation: '50ml',
      name: 'Measuring Cup - 50ml',
      price: 49,
      original: 69,
      img: 'images/Measurement Cup(50ml).webp',
      imgs: ['images/Measurement Cup(50ml).webp', 'images/Measurement Cup(25ml).webp', 'images/Measurement Cup(100ml).webp'],
      rating: 4.6,
      reviews: 115,
      badge: 'Popular',
      stock: 'in-stock',
      stockCount: 110,
      description: 'Standard 50ml measuring beaker for measuring liquids, lemon water, and oils for 100g-200g henna powder batches.',
      ingredients: ['Shatter-proof Clear PP Plastic'],
      usage: ['Measure water, lemon juice, or essential oils'],
      benefits: ['Stable flat base', 'Pouring spout design', 'Durable']
    },
    {
      sku: 'cup-100ml',
      categoryId: 'measuring-cup',
      categoryName: 'Measuring Cup',
      subCategory: null,
      variation: '100ml',
      name: 'Measuring Cup - 100ml',
      price: 59,
      original: 79,
      img: 'images/Measurement Cup(100ml).webp',
      imgs: ['images/Measurement Cup(100ml).webp', 'images/Measurement Cup(50ml).webp', 'images/Measurement Cup(25ml).webp'],
      rating: 4.7,
      reviews: 147,
      badge: 'Best Seller',
      stock: 'in-stock',
      stockCount: 95,
      description: '100ml capacity measuring cup for larger batch paste preparation in studios and salons.',
      ingredients: ['Heavy-gauge Graduated PP Plastic'],
      usage: ['Measure liquids for bulk paste batches'],
      benefits: ['Large capacity', 'Ergonomic grip', 'Dishwasher safe']
    },

    // â”€â”€ 6. SPATULA (Small Size, Big Size) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'spatula-small',
      categoryId: 'spatula',
      categoryName: 'Spatula',
      subCategory: null,
      variation: 'Small Size',
      name: 'Spatula - Small Size',
      price: 59,
      original: 79,
      img: 'images/spatula.webp',
      imgs: ['images/spatula.webp'],
      rating: 4.6,
      reviews: 124,
      badge: 'Flexible',
      stock: 'in-stock',
      stockCount: 130,
      description: 'Small stainless steel flexible spatula with wooden handle. Ideal for precision scraping, cone loading, and small batch mixing.',
      ingredients: ['Food-grade Stainless Steel', 'Natural Teak Wood Handle'],
      usage: ['Mix paste and scrape sides of mixing bowls cleanly'],
      benefits: ['Rust-proof blade', 'Perfect flexibility', 'Reaches bowl contours']
    },
    {
      sku: 'spatula-big',
      categoryId: 'spatula',
      categoryName: 'Spatula',
      subCategory: null,
      variation: 'Big Size',
      name: 'Spatula - Big Size',
      price: 79,
      original: 99,
      img: 'images/spatula.webp',
      imgs: ['images/spatula.webp'],
      rating: 4.7,
      reviews: 106,
      badge: 'Heavy Duty',
      stock: 'in-stock',
      stockCount: 85,
      description: 'Large heavy-duty stainless steel spatula for whipping and folding large volumes of henna paste smoothly.',
      ingredients: ['Wide Gauge 304 Stainless Steel', 'Riveted Wooden Handle'],
      usage: ['Knead and fold large henna batches until silky'],
      benefits: ['Wide paddle surface', 'Sturdy ergonomic balance', 'Long-lasting']
    },

    // â”€â”€ 7. WEIGHT MACHINE (No Variation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'weight-machine-std',
      categoryId: 'weight-machine',
      categoryName: 'Weight Machine',
      subCategory: null,
      variation: null,
      name: 'Digital Weight Machine',
      price: 499,
      original: 699,
      img: 'images/mehndi_tools.jpg',
      imgs: ['images/mehndi_tools.jpg'],
      rating: 4.9,
      reviews: 198,
      badge: 'Best Seller',
      stock: 'in-stock',
      stockCount: 75,
      description: 'Professional high-precision digital scale with 0.1g accuracy and tare function. Essential for exact powder, sugar, and oil measurements.',
      ingredients: ['High-precision Strain Gauge Sensor', 'Stainless Steel Weighing Deck', 'Backlit LCD Screen', '2x AAA Batteries Included'],
      usage: ['Turn on, place mixing container, hit TARE to zero, and measure ingredients with 0.1g accuracy'],
      benefits: ['0.1g ultra-fine precision', 'Weight capacity up to 3000g', 'Auto-off power saver', 'Batteries included']
    },

    // â”€â”€ 8. TAP CUTTER (Small Size, Big Size) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'cutter-small',
      categoryId: 'tap-cutter',
      categoryName: 'Tap Cutter',
      subCategory: null,
      variation: 'Small Size',
      name: 'Tap Cutter - Small Size',
      price: 29,
      original: 45,
      img: 'images/mehndi_tools.jpg',
      imgs: ['images/mehndi_tools.jpg'],
      rating: 4.4,
      reviews: 162,
      badge: 'Handy',
      stock: 'in-stock',
      stockCount: 160,
      description: 'Small handheld tape cutter dispenser with razor-sharp micro-serrated blade. Cuts tape cleanly in one quick motion while rolling cones.',
      ingredients: ['Impact Resistant ABS Plastic', 'Serrated Stainless Steel Blade'],
      usage: ['Fit onto standard small tape roll for instant one-handed cutting'],
      benefits: ['Saves time while rolling cones', 'Zero tape wastage', 'Safe enclosed blade']
    },
    {
      sku: 'cutter-big',
      categoryId: 'tap-cutter',
      categoryName: 'Tap Cutter',
      subCategory: null,
      variation: 'Big Size',
      name: 'Tap Cutter - Big Size',
      price: 39,
      original: 55,
      img: 'images/mehndi_tools.jpg',
      imgs: ['images/mehndi_tools.jpg'],
      rating: 4.5,
      reviews: 119,
      badge: 'Heavy Duty',
      stock: 'in-stock',
      stockCount: 105,
      description: 'Heavy-duty tape cutter dispenser for wider tape rolls and studio packing benches.',
      ingredients: ['Durable Polymer Body', 'Hardened Steel Cutter Blade'],
      usage: ['Use on wide tape rolls for cone sealing and parcel packaging'],
      benefits: ['Handles larger rolls', 'Smooth roll tensioner', 'Durable build']
    },

    // â”€â”€ 9. TAP ROLL (Small Size, Big Size) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'roll-small',
      categoryId: 'tap-roll',
      categoryName: 'Tap Roll',
      subCategory: null,
      variation: 'Small Size',
      name: 'Tap Roll - Small Size',
      price: 35,
      original: 49,
      img: 'images/Tap Roll (small).webp',
      imgs: ['images/Tap Roll (small).webp', 'images/Tap Roll (big).webp'],
      rating: 4.6,
      reviews: 215,
      badge: 'Best Seller',
      stock: 'in-stock',
      stockCount: 220,
      description: 'Small crystal-clear cellophane tape roll with high-tack adhesive. Specially formulated to stick reliably to slippery cellophane sheets.',
      ingredients: ['High-clarity BOPP Film', 'Pressure-sensitive Acrylic Adhesive'],
      usage: ['Seal the seams and top folds of rolled henna cones'],
      benefits: ['Will not peel from essential oil residue', 'Crystal clear finish', 'Strong reliable grip']
    },
    {
      sku: 'roll-big',
      categoryId: 'tap-roll',
      categoryName: 'Tap Roll',
      subCategory: null,
      variation: 'Big Size',
      name: 'Tap Roll - Big Size',
      price: 55,
      original: 75,
      img: 'images/Tap Roll (big).webp',
      imgs: ['images/Tap Roll (big).webp', 'images/Tap Roll (small).webp'],
      rating: 4.7,
      reviews: 148,
      badge: 'Studio Size',
      stock: 'in-stock',
      stockCount: 170,
      description: 'Wide high-strength transparent tape roll for bulk cone production and parcel sealing.',
      ingredients: ['Heavy-gauge BOPP Adhesive Tape'],
      usage: ['Seal master cone packs, bubble wrap, and shipping boxes'],
      benefits: ['Extra length per roll', 'Tear-resistant backing', 'High tensile strength']
    },

    // â”€â”€ 10. SHEET (Soft, Medium, Hard) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'sheet-soft',
      categoryId: 'sheet',
      categoryName: 'Sheet',
      subCategory: null,
      variation: 'Soft',
      name: 'Mehndi Sheet - Soft',
      price: 79,
      original: 109,
      img: 'images/sheet.webp',
      imgs: ['images/sheet.webp'],
      rating: 4.7,
      reviews: 112,
      badge: 'Beginner Choice',
      stock: 'in-stock',
      stockCount: 140,
      description: 'Soft, flexible cellophane sheets (pack of 50). Supple and easy to roll into soft-pinch cones preferred by beginners and delicate motif artists.',
      ingredients: ['Ultra-clear 25-micron Soft Cellophane Film'],
      usage: ['Roll into pencil-style or carrot cones for henna application'],
      benefits: ['Gentle on fingers', 'Easy to roll without creasing', 'Smooth henna paste extrusion']
    },
    {
      sku: 'sheet-medium',
      categoryId: 'sheet',
      categoryName: 'Sheet',
      subCategory: null,
      variation: 'Medium',
      name: 'Mehndi Sheet - Medium',
      price: 99,
      original: 129,
      img: 'images/sheet.webp',
      imgs: ['images/sheet.webp'],
      rating: 4.9,
      reviews: 198,
      badge: 'Most Popular',
      stock: 'in-stock',
      stockCount: 180,
      description: 'Medium firmness cellophane sheets (pack of 50). The gold standard for professional bridal artists offering ideal rigidity and responsiveness.',
      ingredients: ['Premium 35-micron Balanced Gloss Film'],
      usage: ['The universal choice for rolling precision bridal cones'],
      benefits: ['Firm cone tip that does not bend under pressure', 'Smooth hand feel', 'Tear proof']
    },
    {
      sku: 'sheet-hard',
      categoryId: 'sheet',
      categoryName: 'Sheet',
      subCategory: null,
      variation: 'Hard',
      name: 'Mehndi Sheet - Hard',
      price: 119,
      original: 149,
      img: 'images/sheet.webp',
      imgs: ['images/sheet.webp'],
      rating: 4.8,
      reviews: 84,
      badge: 'Pro Grade',
      stock: 'in-stock',
      stockCount: 90,
      description: 'High-rigidity hard cellophane sheets (pack of 50). Yields firm, unbending cones for ultra-fine needle-point detailing and bold fills.',
      ingredients: ['Heavy 45-micron High-density Film'],
      usage: ['Ideal for needle-point Arabic and intricate bridal work'],
      benefits: ['Zero cone body deflection', 'Precise line control', 'Durable for fast-paced work']
    },

    // â”€â”€ 11. SILVER SHEET (No Variation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'silver-sheet-std',
      categoryId: 'silver-sheet',
      categoryName: 'Silver Sheet',
      subCategory: null,
      variation: null,
      name: 'Silver Sheet for Mehndi',
      price: 149,
      original: 199,
      img: 'images/silver sheet.jpeg',
      imgs: ['images/silver sheet.jpeg'],
      rating: 4.7,
      reviews: 95,
      badge: 'Festive Luxury',
      stock: 'in-stock',
      stockCount: 80,
      description: 'Reflective metallic silver transfer foil sheets (pack of 10). Create dazzling silver highlights and festive shimmer on dried bridal henna designs.',
      ingredients: ['Cosmetic-safe Silver Metallic Foil', 'Skin-safe Hydro-transfer Layer'],
      usage: ['Apply over semi-dry henna or body adhesive, press gently for 20 seconds, and peel back backing sheet'],
      benefits: ['Brilliant metallic mirror shine', 'Magnificent in wedding photography', 'Skin safe and hypoallergenic']
    },

    // â”€â”€ 12. MEHNDI PILLOW (No Variation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'pillow-std',
      categoryId: 'mehndi-pillow',
      categoryName: 'Mehndi Pillow',
      subCategory: null,
      variation: null,
      name: 'Mehndi Hand Pillow',
      price: 199,
      original: 279,
      img: 'images/mehndi pillow.webp',
      imgs: ['images/mehndi pillow.webp'],
      rating: 4.9,
      reviews: 146,
      badge: 'Comfort Essential',
      stock: 'in-stock',
      stockCount: 65,
      description: 'Ergonomic high-density foam cushion with removable, washable royal maroon velvet cover. Supports client hand and arm to eliminate shaking and fatigue.',
      ingredients: ['High-resilience Orthopedic Foam', 'Plush Royal Velvet Fabric Cover with Zipper'],
      usage: ['Position under client\'s forearm and palm during long bridal sessions'],
      benefits: ['Steady hand support for flawless symmetry', 'Keeps client relaxed for hours', 'Washable luxury cover']
    },

    // â”€â”€ 13. STOCKING (No Variation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'stocking-std',
      categoryId: 'stocking',
      categoryName: 'Stocking',
      subCategory: null,
      variation: null,
      name: 'Mehndi Stocking (Pack of 10)',
      price: 89,
      original: 129,
      img: 'images/stocking.jpeg',
      imgs: ['images/stocking.jpeg'],
      rating: 4.8,
      reviews: 188,
      badge: 'Best Seller',
      stock: 'in-stock',
      stockCount: 150,
      description: 'Micro-weave stretch nylon filtering stockings (pack of 10). Double-strains henna paste to remove microscopic fibers and prevent cone tip clogging.',
      ingredients: ['Micro-denier Surgical Grade Nylon'],
      usage: ['Stretch over container, pour paste through, squeeze paste out gently for silk-smooth consistency'],
      benefits: ['Guarantees zero clogged cone tips', 'Washable and reusable multiple times', 'Essential for fine-line bridal art']
    },

    // â”€â”€ 14. AFTER CARE BALM (1, 3, 5, 10 Quantity Options) â”€â”€â”€â”€
    {
      sku: 'balm-1',
      categoryId: 'aftercare-balm',
      categoryName: 'After Care Balm',
      subCategory: null,
      variation: '1',
      name: 'After Care Balm - 1 Unit',
      price: 99,
      original: 149,
      img: 'images/after care balm.jpeg',
      imgs: ['images/after care balm.jpeg'],
      rating: 4.8,
      reviews: 215,
      badge: 'Single Pack',
      stock: 'in-stock',
      stockCount: 130,
      description: '100% natural herbal beeswax aftercare balm (15g tin). Locks in heat and essential oils, shields stain from water, and deepens stain by up to 30%.',
      ingredients: ['Organic Yellow Beeswax', 'Raw Shea Butter', 'Eucalyptus Oil', 'Clove Bud Oil', 'Vitamin E'],
      usage: ['Scrape off dry henna without water', 'Rub warm balm thoroughly over entire design', 'Reapply before showering or washing hands'],
      benefits: ['Waterproofing barrier protection', 'Boosts stain depth to deep mahogany', 'Soothes and softens skin']
    },
    {
      sku: 'balm-3',
      categoryId: 'aftercare-balm',
      categoryName: 'After Care Balm',
      subCategory: null,
      variation: '3',
      name: 'After Care Balm - Pack of 3',
      price: 269,
      original: 349,
      img: 'images/after care balm.jpeg',
      imgs: ['images/after care balm.jpeg'],
      rating: 4.9,
      reviews: 152,
      badge: 'Value Pack',
      stock: 'in-stock',
      stockCount: 90,
      description: 'Value pack of 3 aftercare balm tins. Perfect for bride and bridesmaids or gifting to wedding guests.',
      ingredients: ['Beeswax', 'Shea Butter', 'Essential Darkening Terpenes', 'Vitamin E'],
      usage: ['Distribute among bridal party members'],
      benefits: ['Save â‚¹178 compared to single units', 'Gift-ready packaging', 'Complete bridal party aftercare']
    },
    {
      sku: 'balm-5',
      categoryId: 'aftercare-balm',
      categoryName: 'After Care Balm',
      subCategory: null,
      variation: '5',
      name: 'After Care Balm - Pack of 5',
      price: 399,
      original: 549,
      img: 'images/after care balm.jpeg',
      imgs: ['images/after care balm.jpeg'],
      rating: 4.9,
      reviews: 98,
      badge: 'Popular',
      stock: 'in-stock',
      stockCount: 70,
      description: 'Pack of 5 balm tins for professional artists to provide complimentary aftercare to their bridal clients.',
      ingredients: ['Natural Botanical Beeswax Blend'],
      usage: ['Client giveaway after premium bridal bookings'],
      benefits: ['Increases client satisfaction and word of mouth', 'Great per-unit discount']
    },
    {
      sku: 'balm-10',
      categoryId: 'aftercare-balm',
      categoryName: 'After Care Balm',
      subCategory: null,
      variation: '10',
      name: 'After Care Balm - Pack of 10',
      price: 749,
      original: 999,
      img: 'images/after care balm.jpeg',
      imgs: ['images/after care balm.jpeg'],
      rating: 5.0,
      reviews: 64,
      badge: 'Studio Bulk',
      stock: 'in-stock',
      stockCount: 45,
      description: 'Wholesale box of 10 aftercare balm tins for busy salons, bridal studios, and event coordinators.',
      ingredients: ['100% Organic Herbal Balm Compound'],
      usage: ['Retail resale or bridal packages'],
      benefits: ['Maximum wholesale savings', 'High margin resale item for salons']
    },

    // â”€â”€ 15. AFTER CARE OIL (1, 3, 5, 10 Quantity Options) â”€â”€â”€â”€
    {
      sku: 'aftercare-oil-1',
      categoryId: 'aftercare-oil',
      categoryName: 'After Care Oil',
      subCategory: null,
      variation: '1',
      name: 'After Care Oil - 1 Unit',
      price: 129,
      original: 179,
      img: 'images/after care oil.jpeg',
      imgs: ['images/after care oil.jpeg'],
      rating: 4.8,
      reviews: 184,
      badge: 'Single Pack',
      stock: 'in-stock',
      stockCount: 125,
      description: 'Lightweight, rapid-penetration post-henna hydration oil (20ml dropper). Infuses warming botanicals to seal and deepen fresh stains.',
      ingredients: ['Fractionated Coconut Oil', 'Pure Cajeput', 'Lavender Essential', 'Cold-pressed Jojoba', 'Vitamin E'],
      usage: ['Apply 4-6 drops after removing dry paste, massage gently for 2 minutes, avoid water for 24 hours'],
      benefits: ['Deepens color into mahogany within 24 hours', 'Non-sticky fast absorption', 'Keeps skin soft and moisturized']
    },
    {
      sku: 'aftercare-oil-3',
      categoryId: 'aftercare-oil',
      categoryName: 'After Care Oil',
      subCategory: null,
      variation: '3',
      name: 'After Care Oil - Pack of 3',
      price: 349,
      original: 449,
      img: 'images/after care oil.jpeg',
      imgs: ['images/after care oil.jpeg'],
      rating: 4.9,
      reviews: 116,
      badge: 'Value Pack',
      stock: 'in-stock',
      stockCount: 85,
      description: '3-pack of After Care Oil droppers. Ideal for full wedding groups, family functions, and bridesmaids.',
      ingredients: ['Pure Post-Care Botanical Oil Blend'],
      usage: ['Apply on hands and feet after henna removal'],
      benefits: ['Cost saving trio set', 'Convenient dropper bottles']
    },
    {
      sku: 'aftercare-oil-5',
      categoryId: 'aftercare-oil',
      categoryName: 'After Care Oil',
      subCategory: null,
      variation: '5',
      name: 'After Care Oil - Pack of 5',
      price: 549,
      original: 699,
      img: 'images/after care oil.jpeg',
      imgs: ['images/after care oil.jpeg'],
      rating: 4.9,
      reviews: 82,
      badge: 'Popular',
      stock: 'in-stock',
      stockCount: 60,
      description: 'Set of 5 dropper bottles for professional artist giveaway kits and bridal packages.',
      ingredients: ['Botanical Darkening Oil Formulation'],
      usage: ['Hand out to bridal clients post-application'],
      benefits: ['Professional presentation', 'Enhances artist reputation with dark results']
    },
    {
      sku: 'aftercare-oil-10',
      categoryId: 'aftercare-oil',
      categoryName: 'After Care Oil',
      subCategory: null,
      variation: '10',
      name: 'After Care Oil - Pack of 10',
      price: 999,
      original: 1299,
      img: 'images/after care oil.jpeg',
      imgs: ['images/after care oil.jpeg'],
      rating: 5.0,
      reviews: 51,
      badge: 'Studio Bulk',
      stock: 'in-stock',
      stockCount: 40,
      description: 'Wholesale box of 10 dropper bottles for commercial salons and bridal studios.',
      ingredients: ['Full Strength Aftercare Botanical Oil'],
      usage: ['Resale or bulk salon treatments'],
      benefits: ['Lowest wholesale cost per bottle', 'Best margin for beauty parlors']
    },

    // â”€â”€ 0.38 MM PINS (No Variation) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      sku: 'pins-std',
      categoryId: 'mehndi-pins',
      categoryName: '0.38mm Pins',
      subCategory: null,
      variation: null,
      name: '0.38mm Mehndi Pins (Pack of 50)',
      price: 49,
      original: 79,
      img: 'images/0.38mm pins.jpeg',
      imgs: ['images/0.38mm pins.jpeg'],
      rating: 4.9,
      reviews: 265,
      badge: 'Best Seller',
      stock: 'in-stock',
      stockCount: 250,
      description: 'Pack of 50 ultra-fine 0.38mm stainless steel safety pins with round pearlized heads. Essential for sealing cone tips and clearing microscopic paste clogs instantly.',
      ingredients: ['Surgical Grade Rust-proof Stainless Steel', 'Smooth Rounded Pearlized Grip Head'],
      usage: ['Insert pin into cone tip when rolling to standardize opening; keep inserted when not in use to prevent paste drying and clogging'],
      benefits: ['Exact 0.38mm gauge for razor-sharp thin lines', 'Rust-proof & reusable', 'Prevents cone tip from drying out']
    }
  ];

  // â”€â”€ Soap Products Definition (22 Natural Handmade Soaps) â”€â”€â”€â”€â”€â”€
  const SOAPS_STORAGE_KEY = 'mehndi_soaps_v2';
  const DEFAULT_SOAPS = [
    {
      sku: 'soap-1',
      id: 'soap-1',
      name: 'Saffron Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 100,
      original: 130,
      img: 'images/saffron soap.png',
      imgs: ['images/saffron soap.png'],
      badge: 'â­ Best Seller',
      naturalBadge: 'ðŸŒ¿ 100% Organic',
      stock: 'in-stock',
      stockCount: 65,
      rating: 4.9,
      reviews: 184,
      unit: 'bar',
      description: 'Handcrafted saffron soap enriched with pure Kashmiri saffron strands, almond oil, and goat milk for deep radiance and luminous skin.',
      variants: [
        { name: '1 Bar (Single)', price: 100, original: 130 },
        { name: 'Pack of 2 (Twin)', price: 190, original: 260 },
        { name: 'Pack of 3 (Trio)', price: 270, original: 390 },
        { name: 'Box of 5 (Family)', price: 425, original: 650 }
      ],
      benefits: [
        'Natural Glow â€” Helps brighten the skin and provide a healthy-looking radiance.',
        'Skin Brightening â€” Helps reduce the appearance of dark spots and pigmentation.',
        'Deep Cleansing â€” Removes dirt and impurities while keeping skin soft.',
        'Gentle Care â€” Made with natural ingredients for gentle daily cleansing.',
        'Anti-Inflammatory â€” Saffron is traditionally known for soothing properties.',
        'Improved Texture â€” Regular use helps skin look smoother and more even-toned.'
      ]
    },
    {
      sku: 'soap-2',
      id: 'soap-2',
      name: 'Beetroot Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 90,
      original: 120,
      img: 'images/beetroot soap.png',
      imgs: ['images/beetroot soap.png'],
      badge: 'ðŸŒ¸ Antioxidant',
      naturalBadge: 'ðŸŒ¿ Natural',
      stock: 'in-stock',
      stockCount: 50,
      rating: 4.8,
      reviews: 142,
      unit: 'bar',
      description: 'Pure beetroot extract packed with natural antioxidants, vitamin C, and hydrating botanical oils for a youthful rosy complexion.',
      variants: [
        { name: '1 Bar (Single)', price: 90, original: 120 },
        { name: 'Pack of 2 (Twin)', price: 170, original: 240 },
        { name: 'Pack of 3 (Trio)', price: 245, original: 360 },
        { name: 'Box of 5 (Family)', price: 385, original: 600 }
      ],
      benefits: [
        'Natural Glow â€” Beetroot contains antioxidants that help support healthy-looking skin.',
        'Skin Brightening â€” Contains vitamin C, which supports skin health.',
        'Moisture Support â€” Formulated to leave skin feeling soft and moisturized.',
        'Anti-Aging Care â€” May help reduce the visible signs of skin fatigue.',
        'Gentle Exfoliation â€” Mild formulation helps remove surface impurities.',
        'Even Skin Tone â€” Regular use may promote a clearer-looking complexion.'
      ]
    },
    {
      sku: 'soap-3',
      id: 'soap-3',
      name: 'Charcoal Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 90,
      original: 120,
      img: 'images/charcoal soap.png',
      imgs: ['images/charcoal soap.png'],
      badge: 'ðŸ–¤ Detox',
      naturalBadge: 'ðŸŒ¿ Natural',
      stock: 'in-stock',
      stockCount: 75,
      rating: 4.9,
      reviews: 198,
      unit: 'bar',
      description: 'Activated bamboo charcoal draws out deep toxins, excess sebum, and pollution micro-particles without stripping moisture.',
      variants: [
        { name: '1 Bar (Single)', price: 90, original: 120 },
        { name: 'Pack of 2 (Twin)', price: 170, original: 240 },
        { name: 'Pack of 3 (Trio)', price: 245, original: 360 },
        { name: 'Box of 5 (Family)', price: 385, original: 600 }
      ],
      benefits: [
        'Deep Cleansing â€” Activated charcoal draws out dirt, impurities, and excess oil from pores.',
        'Oil Control â€” Helps balance sebum production, ideal for oily and combination skin.',
        'Gentle Exfoliation â€” Lightly buffs away dead skin cells to reveal smoother skin.',
        'Detoxifying Care â€” Helps clear pollution residue and environmental buildup.',
        'Reduces Blemishes â€” Supports clearer-looking skin with regular daily use.',
        'Non-Drying Finish â€” Formulated with nourishing oils to prevent skin tightness.'
      ]
    },
    {
      sku: 'soap-4',
      id: 'soap-4',
      name: 'Aloe Vera Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/Aloe vera soap.png',
      imgs: ['images/Aloe vera soap.png'],
      badge: 'ðŸŒ¿ Soothing',
      naturalBadge: 'ðŸŒ¿ Organic',
      stock: 'in-stock',
      stockCount: 90,
      rating: 4.8,
      reviews: 165,
      unit: 'bar',
      description: 'Freshly harvested aloe vera gel combined with olive and coconut oils to hydrate, soothe sunburns, and calm irritated skin.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Soothing Relief â€” Aloe vera helps calm redness, irritation, and sunburned skin.',
        'Intense Hydration â€” Delivers lightweight moisture that keeps skin supple and soft.',
        'Skin Repair â€” Contains enzymes that support natural skin barrier healing.',
        'Gentle for Sensitive Skin â€” Mild and hypoallergenic for daily whole-body use.',
        'Cooling Sensation â€” Leaves skin feeling refreshed after every wash.',
        'Smooth Finish â€” Helps soften rough patches on elbows, knees, and hands.'
      ]
    },
    {
      sku: 'soap-5',
      id: 'soap-5',
      name: 'Honey Kesar Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/honey kesar soap.jpeg',
      imgs: ['images/honey kesar soap.jpeg'],
      badge: 'ðŸ¯ Moisturizing',
      naturalBadge: 'ðŸŒ¿ Natural',
      stock: 'in-stock',
      stockCount: 80,
      rating: 4.9,
      reviews: 177,
      unit: 'bar',
      description: 'Golden organic raw forest honey blended with handpicked saffron stigmas for deep cellular hydration and golden radiance.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Deep Moisture Lock â€” Raw honey is a natural humectant that locks moisture into skin cells.',
        'Golden Complexion â€” Saffron promotes a natural, luminous bridal glow.',
        'Antibacterial Support â€” Honey helps keep skin clear of acne-causing bacteria.',
        'Skin Softening â€” Leaves skin velvet-smooth and delicately scented.',
        'Protective Barrier â€” Reinforces the skin against dry weather and pollution.',
        'Rich Lather â€” Produces a luxurious, creamy lather without synthetic foaming agents.'
      ]
    },
    {
      sku: 'soap-6',
      id: 'soap-6',
      name: 'Neem Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/neem soap.png',
      imgs: ['images/neem soap.png'],
      badge: 'ðŸƒ Purifying',
      naturalBadge: 'ðŸŒ¿ 100% Herbal',
      stock: 'in-stock',
      stockCount: 100,
      rating: 4.8,
      reviews: 210,
      unit: 'bar',
      description: 'Traditional Ayurvedic cold-pressed neem leaf extract and neem oil providing potent antibacterial and antifungal protection.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Antibacterial Power â€” Pure neem fights bacteria that cause body acne, boils, and rashes.',
        'Purifies Pores â€” Deeply cleanses congested skin without disrupting natural pH balance.',
        'Soothes Itching â€” Relieves itchy, irritated, or allergy-prone skin.',
        'Natural Deodorant â€” Helps neutralize body odor caused by sweat and bacteria.',
        'Herbal Healing â€” Accelerates recovery of minor skin abrasions and blemishes.',
        'Daily Protection â€” Perfect for family wellness during hot and humid seasons.'
      ]
    },
    {
      sku: 'soap-7',
      id: 'soap-7',
      name: 'Milky Jelly Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 100,
      original: 130,
      img: 'images/milky jelly soap.png',
      imgs: ['images/milky jelly soap.png'],
      badge: 'ðŸ¥› Nourishing',
      naturalBadge: 'ðŸŒ¿ Gentle',
      stock: 'in-stock',
      stockCount: 45,
      rating: 4.9,
      reviews: 130,
      unit: 'bar',
      description: 'Ultra-creamy goat milk protein base with bouncy jelly texture for velvety soft, baby-smooth skin.',
      variants: [
        { name: '1 Bar (Single)', price: 100, original: 130 },
        { name: 'Pack of 2 (Twin)', price: 190, original: 260 },
        { name: 'Pack of 3 (Trio)', price: 270, original: 390 },
        { name: 'Box of 5 (Family)', price: 425, original: 650 }
      ],
      benefits: [
        'Milk Protein Nutrition â€” Nourishes skin with vitamins A, B, and D for lasting resilience.',
        'Silky Soft Feel â€” Leaves skin supple with zero post-wash dryness.',
        'Lactic Acid Renewal â€” Gently dissolves dull surface cells for a refreshed look.',
        'Rich Cream Lather â€” Generates dense cushion foam for a spa-like shower.',
        'Moisture Barrier Support â€” Ideal for dry, sensitive, or aging skin types.',
        'Subtle Sweet Scent â€” Delightful calming milky aroma that lingers gently.'
      ]
    },
    {
      sku: 'soap-8',
      id: 'soap-8',
      name: 'Lavender Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 90,
      original: 120,
      img: 'images/lavender soap.png',
      imgs: ['images/lavender soap.png'],
      badge: 'ðŸ’œ Relaxing',
      naturalBadge: 'ðŸŒ¿ Aromatherapy',
      stock: 'in-stock',
      stockCount: 60,
      rating: 4.9,
      reviews: 156,
      unit: 'bar',
      description: 'Infused with pure French lavender essential oil and crushed lavender buds to de-stress the mind and soothe stressed skin.',
      variants: [
        { name: '1 Bar (Single)', price: 90, original: 120 },
        { name: 'Pack of 2 (Twin)', price: 170, original: 240 },
        { name: 'Pack of 3 (Trio)', price: 245, original: 360 },
        { name: 'Box of 5 (Family)', price: 385, original: 600 }
      ],
      benefits: [
        'Aromatherapy Relaxation â€” Calming floral aroma relieves tension and prepares body for sleep.',
        'Anti-Inflammatory â€” Eases skin redness, swelling, and minor irritations.',
        'Gentle Antiseptic â€” Keeps skin hygienic and protects against microbial growth.',
        'Hydrates Dry Skin â€” Enriched with shea butter for lasting softness.',
        'Soothing Evening Bath â€” Perfect for an unwinding nighttime ritual.',
        'Natural Color & Scent â€” Colored naturally with lavender herbs, no artificial fragrance.'
      ]
    },
    {
      sku: 'soap-9',
      id: 'soap-9',
      name: 'Lemon Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/lemon soap.png',
      imgs: ['images/lemon soap.png'],
      badge: 'ðŸ‹ Refreshing',
      naturalBadge: 'ðŸŒ¿ Natural',
      stock: 'in-stock',
      stockCount: 85,
      rating: 4.8,
      reviews: 140,
      unit: 'bar',
      description: 'Zesty cold-pressed lemon rind oil with natural fruit AHAs to wake up tired skin, eliminate grease, and brighten skin tone.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Energizing Citrus Burst â€” Uplifts mood and invigorates the senses with pure lemon zest.',
        'Astringent Action â€” Tightens enlarged pores and removes oily shine.',
        'Skin Clarifying â€” Lightens blemishes and uneven tanning over regular use.',
        'Natural Deodorizer â€” Keeps you feeling and smelling fresh all day long.',
        'Antioxidant Vitamin C â€” Fights free radical damage caused by sun and pollution.',
        'Cleanses Thoroughly â€” Rinses away cleanly leaving squeaky-clean skin.'
      ]
    },
    {
      sku: 'soap-10',
      id: 'soap-10',
      name: 'Milky Rose Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 100,
      original: 130,
      img: 'images/milky rose soap.png',
      imgs: ['images/milky rose soap.png'],
      badge: 'ðŸŒ¹ Hydrating',
      naturalBadge: 'ðŸŒ¿ Organic',
      stock: 'in-stock',
      stockCount: 55,
      rating: 4.9,
      reviews: 190,
      unit: 'bar',
      description: 'Luxurious fusion of steam-distilled Kannauj rose water, fresh goat milk, and cold-pressed rosehip seed oil.',
      variants: [
        { name: '1 Bar (Single)', price: 100, original: 130 },
        { name: 'Pack of 2 (Twin)', price: 190, original: 260 },
        { name: 'Pack of 3 (Trio)', price: 270, original: 390 },
        { name: 'Box of 5 (Family)', price: 425, original: 650 }
      ],
      benefits: [
        'Rose Petal Radiance â€” Imparts a delicate rose-petal glow and softness to the body.',
        'Deep Hydration â€” Goat milk proteins nourish parched skin cells.',
        'Soothes Inflammation â€” Rose water balances skin pH and calms heat sensations.',
        'Romantic Floral Fragrance â€” Authentic rose aroma without synthetic perfumes.',
        'Improves Skin Elasticity â€” Rosehip antioxidants support firmness and youthful bounce.',
        'Bridal Pampering â€” Popular choice for pre-wedding bridal skincare routines.'
      ]
    },
    {
      sku: 'soap-11',
      id: 'soap-11',
      name: 'Honey Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/Honey soap.png',
      imgs: ['images/Honey soap.png'],
      badge: 'ðŸ¯ Antioxidant',
      naturalBadge: 'ðŸŒ¿ Natural',
      stock: 'in-stock',
      stockCount: 70,
      rating: 4.8,
      reviews: 148,
      unit: 'bar',
      description: '100% pure raw apiary honey loaded with natural enzymes to gently cleanse, nourish, and preserve vital skin moisture.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Moisture Magnet â€” Honey draws environmental moisture into the skin for 24h hydration.',
        'Antioxidant Shield â€” Protects cellular collagen from oxidative environmental damage.',
        'Natural Antimicrobial â€” Keeps minor breakouts and body acne in check.',
        'Ultra-Gentle Cleanser â€” Ideal for babies, elderly, and sensitive skin.',
        'Non-Comedogenic â€” Hydrates thoroughly without clogging facial or body pores.',
        'Warm Amber Aroma â€” Natural honey scent creates a comforting bath atmosphere.'
      ]
    },
    {
      sku: 'soap-12',
      id: 'soap-12',
      name: 'Herbal Hair Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 90,
      original: 120,
      img: 'images/herbal hair soap.png',
      imgs: ['images/herbal hair soap.png'],
      badge: 'ðŸŒ¿ Hair Care',
      naturalBadge: 'ðŸŒ¿ Ayurvedic',
      stock: 'in-stock',
      stockCount: 60,
      rating: 4.8,
      reviews: 135,
      unit: 'bar',
      description: 'Solid herbal shampoo bar crafted with Amla, Reetha, Shikakai, and Bhringraj to strengthen roots and cleanse the scalp naturally.',
      variants: [
        { name: '1 Bar (Single)', price: 90, original: 120 },
        { name: 'Pack of 2 (Twin)', price: 170, original: 240 },
        { name: 'Pack of 3 (Trio)', price: 245, original: 360 },
        { name: 'Box of 5 (Family)', price: 385, original: 600 }
      ],
      benefits: [
        'Zero Sulfates & Silicones â€” Cleanses hair without toxic chemicals or plastic bottle waste.',
        'Root Strengthening â€” Bhringraj and Amla nourish hair follicles to reduce fall.',
        'Natural Foam â€” Reetha and Shikakai create gentle botanical suds that wash clean.',
        'Dandruff Control â€” Ayurvedic herbs soothe itchy scalp and prevent fungal flakes.',
        'Natural Shine & Volume â€” Leaves hair bouncy, lightweight, and lustrous.',
        'Travel-Friendly Bar â€” Leakproof solid bar perfect for travel and daily gym carry.'
      ]
    },
    {
      sku: 'soap-13',
      id: 'soap-13',
      name: 'Ubtan Powder',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 200,
      original: 260,
      img: 'images/ubtan powder.png',
      imgs: ['images/ubtan powder.png'],
      badge: 'âœ¨ Traditional',
      naturalBadge: 'ðŸŒ¿ 100% Ayurvedic',
      stock: 'in-stock',
      stockCount: 85,
      rating: 5.0,
      reviews: 245,
      unit: 'pouch',
      description: 'Royal Ayurvedic bridal ubtan blend of chickpea flour, turmeric, sandalwood, saffron, and almond powder for timeless radiance.',
      variants: [
        { name: '100g Pouch', price: 120, original: 150 },
        { name: '200g Value Pack', price: 200, original: 260 },
        { name: '500g Family Pack', price: 450, original: 600 }
      ],
      benefits: [
        'Pre-Wedding Radiance â€” The traditional Ayurvedic bridal glow recipe handed down generations.',
        'Deep Exfoliation â€” Clears dead skin cells, tan lines, and micro-ingrown hairs.',
        'Tan Removal â€” Reverses stubborn sun tan and restores natural skin tone.',
        'Customizable Paste â€” Mix with milk for dry skin, rose water for oily skin, or yogurt for glow.',
        'Chemical Free â€” 100% edible-grade botanical ingredients, completely preservative-free.',
        'Full Body & Face â€” Safe for whole body polishing, elbows, neck, and face mask.'
      ]
    },
    {
      sku: 'soap-14',
      id: 'soap-14',
      name: "Fuller's Earth Soap",
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: "images/Fuller's earth soap(multani mati).png",
      imgs: ["images/Fuller's earth soap(multani mati).png"],
      badge: 'ðŸ”ï¸ Cooling',
      naturalBadge: 'ðŸŒ¿ Natural',
      stock: 'in-stock',
      stockCount: 65,
      rating: 4.8,
      reviews: 155,
      unit: 'bar',
      description: 'Authentic Multani Mitti (Fuller\'s Earth) bar that absorbs excess oil, shrinks pores, and cools overheated summer skin.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Oil Absorption â€” Multani Mitti soaks up sebum and controls facial shine all day.',
        'Pore Refining â€” Helps tighten enlarged pores and prevent blackhead formation.',
        'Cooling Relief â€” Calms prickly heat, rashes, and sweat irritations in summer.',
        'Natural Clay Detox â€” Binds to heavy metals and airborne pollutants for a clean wash.',
        'Even Complexion â€” Clears blemishes, dark spots, and stubborn discoloration.',
        'Earthy Aromatherapy â€” Natural clay petrichor scent evokes soothing fresh rain.'
      ]
    },
    {
      sku: 'soap-15',
      id: 'soap-15',
      name: 'Turmeric Sandalwood Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/turmeric sandalwood soap.png',
      imgs: ['images/turmeric sandalwood soap.png'],
      badge: 'ðŸŒŸ Anti-aging',
      naturalBadge: 'ðŸŒ¿ Ayurvedic',
      stock: 'in-stock',
      stockCount: 80,
      rating: 4.9,
      reviews: 215,
      unit: 'bar',
      description: 'Curcumin-rich Kasturi Manjal paired with pure red sandalwood (Chandan) extract to protect, tone, and illuminate.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Curcumin Healing â€” Turmeric combats bacteria and speeds recovery of blemishes.',
        'Sandalwood Cooling â€” Chandan pacifies skin heat, reducing sun redness and irritation.',
        'Firming & Toning â€” Supports youthful elasticity and helps diminish fine lines.',
        'Golden Complexion â€” Delivers a warm, natural radiance without yellow staining.',
        'Sacred Fragrance â€” Uplifting divine sandalwood aroma promotes inner calm.',
        'Gentle Daily Ritual â€” Suitable for morning bath rituals and pre-event skincare.'
      ]
    },
    {
      sku: 'soap-16',
      id: 'soap-16',
      name: 'D-Tan Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/D-tan soap.png',
      imgs: ['images/D-tan soap.png'],
      badge: 'â˜€ï¸ De-Tan',
      naturalBadge: 'ðŸŒ¿ Natural',
      stock: 'in-stock',
      stockCount: 95,
      rating: 4.9,
      reviews: 172,
      unit: 'bar',
      description: 'Specially engineered tan-reversing formula with tomato extract, licorice root, and niacinamide to fade sun-darkened patches.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Reverses Sun Tan â€” Lightens tanned arms, neck, hands, and feet after sun exposure.',
        'Licorice Brightening â€” Glabridin in licorice inhibits melanin overproduction naturally.',
        'Gentle Micro-Exfoliation â€” Buffs away dead hyper-pigmented skin layers safely.',
        'Restores Natural Hue â€” Brings back your natural skin undertone within weeks.',
        'Safe & Bleach-Free â€” Absolutely zero harsh chemical bleaches, peroxides, or parabens.',
        'Daily Outdoor Defense â€” Perfect for daily use by commuters, travelers, and athletes.'
      ]
    },
    {
      sku: 'soap-17',
      id: 'soap-17',
      name: 'Camphor Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 90,
      original: 120,
      img: 'images/camphor soap.png',
      imgs: ['images/camphor soap.png'],
      badge: 'â„ï¸ Cooling',
      naturalBadge: 'ðŸŒ¿ Pure Herbal',
      stock: 'in-stock',
      stockCount: 50,
      rating: 4.8,
      reviews: 128,
      unit: 'bar',
      description: 'Infused with edible Bhimseni camphor and menthol crystals for an icy tingling freshness that relieves itching and muscle tension.',
      variants: [
        { name: '1 Bar (Single)', price: 90, original: 120 },
        { name: 'Pack of 2 (Twin)', price: 170, original: 240 },
        { name: 'Pack of 3 (Trio)', price: 245, original: 360 },
        { name: 'Box of 5 (Family)', price: 385, original: 600 }
      ],
      benefits: [
        'Instant Ice Sensation â€” Delivers a refreshing cooling blast that instantly beats summer heat.',
        'Anti-Itch Specialist â€” Stops persistent fungal itching, hives, and skin irritation.',
        'Muscle Relaxation â€” Camphor promotes blood flow and relieves sore, fatigued muscles.',
        'Antiseptic Wash â€” Guards against fungal skin infections and sweat buildup.',
        'Aromatic Clarity â€” Invigorating herbal vapors clear nasal passage and focus mind.',
        'Long Lasting Freshness â€” Keeps skin cool and comfortable for hours post-shower.'
      ]
    },
    {
      sku: 'soap-18',
      id: 'soap-18',
      name: 'Casudo Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/casudo soap.png',
      imgs: ['images/casudo soap.png'],
      badge: 'ðŸŒ¼ Summer Care',
      naturalBadge: 'ðŸŒ¿ Heritage',
      stock: 'in-stock',
      stockCount: 60,
      rating: 4.8,
      reviews: 115,
      unit: 'bar',
      description: 'Traditional Gujarati herbal formulation of Casudo (Palash / Butea monosperma) flowers to heal heat boils and prickly heat.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Heritage Flower Healing â€” Palash flower extract is celebrated for cooling summer ailments.',
        'Clears Prickly Heat â€” Resolves heat rashes, red bumps, and summer sweat boils.',
        'Blood Purifier â€” Traditional herbs purify micro-circulation in outer skin layers.',
        'Gentle On Children â€” Highly recommended for children and seniors during summer.',
        'Hydrating Cold-Pressed Base â€” Crafted with coconut and sesame oils for balanced hydration.',
        'Authentic Folk Wisdom â€” Time-tested home remedy in a convenient handmade bar.'
      ]
    },
    {
      sku: 'soap-19',
      id: 'soap-19',
      name: 'Rose Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/Rose soap.jpeg',
      imgs: ['images/Rose soap.jpeg'],
      badge: 'ðŸŒ¹ Floral',
      naturalBadge: 'ðŸŒ¿ Natural',
      stock: 'in-stock',
      stockCount: 75,
      rating: 4.8,
      reviews: 160,
      unit: 'bar',
      description: 'Handmade cold-process bar infused with crushed desi gulab (damask rose) petals and virgin olive oil for satin-like smoothness.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Classic Desi Gulab â€” Captures the pure essence of wild Indian damask roses.',
        'Satin Skin Feel â€” Olive oil and rose extract leave skin silky soft to touch.',
        'Natural Pore Toner â€” Helps tighten pores and balances surface oiliness.',
        'Uplifting Aroma â€” Natural rose fragrance reduces stress and promotes peace.',
        'Free from Artificial Color â€” Colored naturally by real steeped rose petals.',
        'Universal Everyday Soap â€” Perfect gentle wash for all family members.'
      ]
    },
    {
      sku: 'soap-20',
      id: 'soap-20',
      name: 'Orange Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/orange soap.png',
      imgs: ['images/orange soap.png'],
      badge: 'ðŸŠ Vitamin C',
      naturalBadge: 'ðŸŒ¿ Natural',
      stock: 'in-stock',
      stockCount: 85,
      rating: 4.8,
      reviews: 145,
      unit: 'bar',
      description: 'Bursting with Nagpur orange peel oil and dried orange zest for natural citric exfoliation and glowing clarity.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Pure Vitamin C Power â€” Brightens fatigued, dull skin and fades dark spots.',
        'Micro-Peel Exfoliation â€” Fine orange peel particles gently buff away dead cells.',
        'Energizing Citrus Aroma â€” Fresh citrus fragrance sparks energy and positivity.',
        'Balances Sebum â€” Keeps oily skin clear without stripping vital hydration.',
        'Collagen Support â€” Citrus antioxidants encourage natural skin elasticity.',
        'Smooth Body Polishing â€” Great for smoothing rough arms and legs in the morning.'
      ]
    },
    {
      sku: 'soap-21',
      id: 'soap-21',
      name: 'Rice Potato Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 80,
      original: 110,
      img: 'images/rice potato soap.png',
      imgs: ['images/rice potato soap.png'],
      badge: 'ðŸ¥” Brightening',
      naturalBadge: 'ðŸŒ¿ Korean Glass Skin',
      stock: 'in-stock',
      stockCount: 70,
      rating: 4.9,
      reviews: 178,
      unit: 'bar',
      description: 'Viral brightening remedy combining fermented rice water and raw potato enzyme (catecholase) to fade dark circles and blemishes.',
      variants: [
        { name: '1 Bar (Single)', price: 80, original: 110 },
        { name: 'Pack of 2 (Twin)', price: 150, original: 220 },
        { name: 'Pack of 3 (Trio)', price: 215, original: 330 },
        { name: 'Box of 5 (Family)', price: 340, original: 550 }
      ],
      benefits: [
        'Potato Catecholase Enzyme â€” Proven traditional remedy for fading dark spots and pigmentation.',
        'Fermented Rice Water â€” Promotes glass skin radiance and refines skin texture.',
        'Starch Soothing â€” Natural starches calm irritation and create a velvet barrier.',
        'Tones Uneven Skin â€” Balances patchy skin tone on face, neck, and underarms.',
        'Non-Comedogenic â€” Safe for acne-prone skin that needs blemish reduction.',
        'Gentle Daily Polish â€” Mild enough for twice-daily facial and whole-body washing.'
      ]
    },
    {
      sku: 'soap-22',
      id: 'soap-22',
      name: 'Pimple Soap',
      categoryId: 'soap',
      categoryName: 'Handmade Soap',
      price: 90,
      original: 120,
      img: 'images/pimple soap.png',
      imgs: ['images/pimple soap.png'],
      badge: 'ðŸ’œ Acne Care',
      naturalBadge: 'ðŸŒ¿ Targeted Care',
      stock: 'in-stock',
      stockCount: 90,
      rating: 4.9,
      reviews: 230,
      unit: 'bar',
      description: 'Potent targeted anti-acne therapy featuring tea tree oil, clove extract, and willow bark salicylic acid to eliminate breakout cycles.',
      variants: [
        { name: '1 Bar (Single)', price: 90, original: 120 },
        { name: 'Pack of 2 (Twin)', price: 170, original: 240 },
        { name: 'Pack of 3 (Trio)', price: 245, original: 360 },
        { name: 'Box of 5 (Family)', price: 385, original: 600 }
      ],
      benefits: [
        'Targeted Blemish Defense â€” Penetrates deep into pores to dissolve acne-causing plugs.',
        'Tea Tree & Clove Extract â€” Powerful antibacterial agents neutralize pimple bacteria.',
        'Reduces Inflammation â€” Calms angry red pimples, cystic spots, and swelling.',
        'Prevents Post-Acne Marks â€” Gentle botanicals prevent dark marks after breakouts heal.',
        'Controls T-Zone Oil â€” Keeps forehead, nose, and chin shine-free all day.',
        'Back & Chest Acne â€” Highly effective for clearing stubborn body breakouts.'
      ]
    }
  ];

  // â”€â”€ Database Manager Class â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // BLOG MANAGEMENT ENGINE (3 SUBMENUS: BRIDAL TIPS, PRODUCT USE, AFTER CARE)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  const BLOG_STORAGE_KEY = 'mehndi_blogs_v3';

  const BLOG_CATEGORIES = [
    {
      id: 'bridal-tips',
      name: 'Bridal Tips',
      desc: 'Wedding Henna Prep & Design Guides',
      badge: 'Bridal Guide'
    },
    {
      id: 'product-use',
      name: 'Product Use',
      desc: 'Cones, Powder, Oils & Tools Tutorials',
      badge: 'Product Tutorial'
    },
    {
      id: 'after-care',
      name: 'After Care',
      desc: 'Balms, Oils & Stain Longevity Secrets',
      badge: 'Aftercare Guide'
    }
  ];

  const DEFAULT_BLOGS = [
    // â”€â”€ BRIDAL TIPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id: 'bridal-1',
      title: '10 Things Every Bride Should Know About Mehndi',
      category: 'bridal-tips',
      categoryName: 'Bridal Tips',
      badge: 'Bridal Guide',
      author: 'Meena Devi (Lead Bridal Artist)',
      date: 'January 15, 2025',
      readTime: '8 min read',
      img: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=700&h=450&fit=crop',
      featured: true,
      excerpt: 'The complete guide to getting the darkest, longest-lasting bridal mehndi stain â€” from timing your session 48 hours before the wedding to grandmothers aftercare secrets.',
      content: `Getting married is one of the most memorable milestones in life, and your bridal mehndi holds a deeply sacred and artistic place in your wedding celebrations. At Khushi Mehndi Studio, having adorned thousands of brides across Gujarat and India, we have perfected the essential rules for a breathtaking, rich mahogany stain.

First and foremost, timing is everything. Always book your bridal mehndi ceremony 48 hours prior to the main wedding day. Henna reaches its deepest color through natural oxidation, which takes between 36 to 48 hours to peak. If your ceremony is on a Thursday night, your mehndi will look its absolute darkest and most radiant for your Saturday reception.

Second, prepare your skin thoughtfully. Ensure all waxing, threading, manicures, and pedicures are completed at least 24 to 48 hours before your henna session. Applying mehndi right after waxing can cause mild skin irritation and prevent the dye from absorbing evenly. On the day of your appointment, wash your hands and feet thoroughly with gentle soap to eliminate all residual body lotion, sunscreen, and oils.

During the application, sit in a comfortably warm room with adequate back support. Cold skin slows down dye transfer, while gentle warmth encourages the natural Lawsone molecules to bind with your epidermal keratin. Once the application is complete, allow the paste to dry naturally for at least 6 to 8 hours before gentle scraping.`
    },
    {
      id: 'bridal-2',
      title: 'Bridal Mehndi Design Trends: Traditional Rajasthani to Modern Minimalist',
      category: 'bridal-tips',
      categoryName: 'Bridal Tips',
      badge: 'Bridal Guide',
      author: 'Khushi Studio Bridal Team',
      date: 'February 2, 2025',
      readTime: '6 min read',
      img: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=250&fit=crop',
      featured: false,
      excerpt: 'Explore popular bridal motifs â€” intricate portraits, jharokha arches, peacock feathers, lotus mandalas, and personalized wedding date storytelling.',
      content: `Bridal mehndi styles are evolving beautifully, blending centuries-old cultural motifs with contemporary elegance. Today's brides are curating bespoke designs that narrate their unique love story on their palms and arms.

Traditional Rajasthani bridal patterns remain a perennial favorite. Characterized by royal doli-baraat processions, majestic peacocks, kalash elements, and intricate fine-line jali (lattice work), these designs offer unparalleled richness and full forearm coverage.

Simultaneously, Modern Minimalist & Arabic Fusion has captured the hearts of modern brides who prefer airy, breathable layouts. Featuring bold negative-space floral mandalas, delicate cuff bracelets, and leafy vines, this style creates a sophisticated statement that pairs gracefully with diamond jewellery and pastel lehengas.

At Khushi Mehndi Studio, we customize every bridal layout to complement your wedding attire, sleeve length, and personal aesthetic so you look breathtaking from every angle in your wedding album.`
    },
    {
      id: 'bridal-3',
      title: 'The 48-Hour Bridal Mehndi Preparation Timeline',
      category: 'bridal-tips',
      categoryName: 'Bridal Tips',
      badge: 'Bridal Guide',
      author: 'Pooja Sharma (Senior Bridal Consultant)',
      date: 'February 18, 2025',
      readTime: '5 min read',
      img: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&h=250&fit=crop',
      featured: false,
      excerpt: 'Hour-by-hour countdown to your bridal henna appointment: waxing schedules, avoiding skin oils, setting up a warm room, and post-application rest.',
      content: `Smooth preparation is the key to enjoying a relaxing bridal mehndi day. Here is our recommended timeline practiced by professional bridal stylists:

â€¢ 3 Days Before: Complete all salon grooming, body waxing, hair removal, and exfoliating scrubs. This gives pores time to close and ensures smooth skin.
â€¢ 2 Days Before (Morning): Enjoy your manicure and pedicure treatments. Opt for clean, unpolished nails or neutral polish so henna does not stain acrylic tips.
â€¢ Day of Mehndi: Eat a wholesome, energizing meal before the artist arrives. Wear loose, comfortable clothing with half sleeves or button-down fronts so you can move without smudging fresh designs.
â€¢ Night of Mehndi: Keep the dry paste intact for 8 hours. Before sleeping, wrap hands lightly with cotton or stockings to trap warmth while sleeping.`
    },

    // â”€â”€ PRODUCT USE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id: 'product-1',
      title: 'Master Guide: How to Mix Organic Mehndi Powder, Mehndi Oil & Water for Silk Paste',
      category: 'product-use',
      categoryName: 'Product Use',
      badge: 'Product Tutorial',
      author: 'Khushi Formulation Lab',
      date: 'January 28, 2025',
      readTime: '7 min read',
      img: 'https://images.unsplash.com/photo-1587052755473-89ed4bef0975?w=600&h=250&fit=crop',
      featured: false,
      excerpt: 'Learn exact professional mixing ratios: 100g Sojat Mehndi Powder, 30ml Bridal Oil, and filtered water. Master dye release timing and stocking filtration for clump-free cones.',
      content: `Creating velvety, stringy, clump-free henna paste is both an art and a science. The secret lies in using 100% organic, triple-sifted micro-fine henna powder and pure terpene-rich mehndi oil.

Step 1 â€” The Base Measurement:
Weigh exactly 100 grams of Khushi Organic Mehndi Powder in a clean ceramic or stainless steel bowl using our precision Digital Weight Machine. Gradually add 150ml to 180ml of lukewarm filtered water or brewed tea, stirring continuously with our silicone Spatula until a thick mashed potato consistency forms.

Step 2 â€” Dye Release & Essential Oil Addition:
Add exactly 30ml of Khushi Bridal Mehndi Oil (or Red Oil / Mix Oil). The natural monoterpene alcohols in cajeput and eucalyptus oils trigger the Lawsone dye molecules to release from plant cell walls, transforming the stain from dull orange to intense deep maroon. Mix vigorously for 5 minutes until glossy and smooth.

Step 3 â€” Resting & Stocking Straining:
Cover the bowl directly with plastic wrap touching the paste surface to eliminate air pockets. Allow the paste to rest at room temperature (25Â°C - 30Â°C) for 8 to 12 hours until a dark brown puddle forms on top. Finally, stretch an 80-denier Khushi Stocking over a tall cup, pour the rested paste inside, and squeeze firmly to filter out every micro-fiber for an ultra-smooth flow that never clogs your cone tip.`
    },
    {
      id: 'product-2',
      title: 'Piping Bags, Spatulas & Cone Rolling: How Professionals Fill Cones Without Air Bubbles',
      category: 'product-use',
      categoryName: 'Product Use',
      badge: 'Product Tutorial',
      author: 'Senior Henna Technician',
      date: 'February 10, 2025',
      readTime: '6 min read',
      img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=250&fit=crop',
      featured: false,
      excerpt: 'A complete walkthrough on using our cellophane Sheets, 0.38mm Pins, Tap Cutters, Spatulas, and heavy-duty Piping Bags to roll precision henna cones that never burst.',
      content: `Every henna artist knows that the finest mehndi art requires an airtight, perfectly weighted cone that provides consistent line control without straining your hand.

1. Rolling the Cone Sheet:
Take a Khushi Pre-cut Cellophane Sheet (Soft for flexible grip, Medium for standard durability, or Hard for firm precision). Roll diagonally from the corner into a tight funnel. Insert a Khushi 0.38mm Pin at the tip to guarantee an ultra-fine, uniform opening. Secure the seam firmly using our Tap Roll and Tap Cutter.

2. Using the Piping Bag & Spatula:
Never spoon henna directly into small cones â€” this introduces stubborn air pockets that cause henna to sputter. Instead, transfer your strained paste into a large Khushi Piping Bag using our broad Spatula. Snip the piping bag tip to a 3mm opening.

3. Bubble-Free Filling:
Slide the piping bag tip deep into the rolled cone, gently squeeze the paste filling 2/3 of the cone, and slowly withdraw. Fold the top edges down in neat triangles, seal with heavy-duty tape, and remove the 0.38mm pin only when ready to draw. Store filled cones in the freezer to keep them fresh for up to 6 months!`
    },
    {
      id: 'product-3',
      title: 'Why Precision Tools Matter: Digital Weight Machine & Measuring Cup Guide',
      category: 'product-use',
      categoryName: 'Product Use',
      badge: 'Product Tutorial',
      author: 'Henna Quality Control',
      date: 'February 24, 2025',
      readTime: '5 min read',
      img: 'https://images.unsplash.com/photo-1574786527860-f2e274867c91?w=600&h=250&fit=crop',
      featured: false,
      excerpt: 'Why guessing measurements causes runny or cracking paste. Learn how 0.1g digital weight machines and 25ml-100ml measuring cups give consistent professional stains every batch.',
      content: `The difference between an amateur paste that cracks off skin in 20 minutes and a professional elastic paste that stays glued for 8 hours is strict measurement accuracy.

Measuring by eye often leads to too much water (causing bleeding fine lines) or too much essential oil (which can cause mild skin warmth without adding extra stain depth). 

By utilizing our 0.1g Digital Weight Machine:
â€¢ 100g powder + 30g sugar + 30ml oil = The golden standard formula.
â€¢ In dry summer weather, increase sugar to 35g for superior humidity retention and skin adhesion.
â€¢ In humid monsoon seasons, reduce sugar to 25g to keep the paste drying at the optimal speed.

Our 25ml, 50ml, and 100ml graduated Measuring Cups make measuring your Bridal Oil and lemon-sugar sealants effortless, ensuring batch-to-batch consistency every single time.`
    },

    // â”€â”€ AFTER CARE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    {
      id: 'aftercare-1',
      title: 'How to Make Your Mehndi Last 3+ Weeks: The Oxidation & Heat Guide',
      category: 'after-care',
      categoryName: 'After Care',
      badge: 'Aftercare Guide',
      author: 'Radhika Patel (Stain Specialist)',
      date: 'January 20, 2025',
      readTime: '6 min read',
      img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=250&fit=crop',
      featured: false,
      excerpt: 'Preserve deep rich mahogany color for weeks. Secrets to keeping paste on for 8+ hours, avoiding water for the first 24 hours, clove smoke steaming, and natural sealing.',
      content: `Once the henna paste is expertly applied, your aftercare routine determines 60% of the final color depth and longevity. Follow these time-tested aftercare rules for unmatched stain longevity:

1. Keep Paste On for 6 to 8 Hours:
The longer the dried paste remains in contact with the skin, the deeper the dye penetrates. Many brides prefer keeping the paste on overnight.

2. Never Wash with Water:
When you are ready to remove the paste, gently scrape it off using a butter knife, card edge, or your fingers. Strictly avoid washing hands with water or soap for the first 24 hours! Water halts the oxidation reaction and dilutes the stain before it has matured.

3. Clove Steam (Laung Ka Dhua):
Heat 4 to 5 whole cloves on a tawa or pan until aromatic smoke rises. Hold your hands 8 inches above the smoke for 2 to 3 minutes. The natural eugenol fumes and gentle warmth accelerate the oxidation process, turning bright orange into deep maroon.

4. Protect When Bathing:
Before taking showers, apply a generous layer of Khushi After Care Balm. The natural beeswax and botanical oils form a waterproof shield, repelling water and harsh soaps.`
    },
    {
      id: 'aftercare-2',
      title: 'After Care Balm vs After Care Oil: Which One to Use & When',
      category: 'after-care',
      categoryName: 'After Care',
      badge: 'Aftercare Guide',
      author: 'Natural Skincare Formulator',
      date: 'February 5, 2025',
      readTime: '5 min read',
      img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=250&fit=crop',
      featured: false,
      excerpt: 'Comparing our herbal beeswax After Care Balm and essential After Care Oil. Learn when to apply oil post-scraping and how balm creates a waterproof barrier before showers.',
      content: `Both Khushi After Care Balm and After Care Oil are handcrafted from 100% natural ingredients, but each plays a distinct, complementary role in preserving your henna stain.

Khushi After Care Oil:
Formulated with concentrated eucalyptus, clove, and sweet almond oils, this liquid oil is designed to be applied immediately after scraping off the dry paste. The light essential oils penetrate the top layer of skin, trapping body heat and feeding the developing dye without any synthetic mineral oils or parabens.

Khushi After Care Balm:
Infused with pure organic beeswax, shea butter, and coconut extracts, our balm is a richer, solid salve. It is specifically formulated to create a durable, water-resistant barrier. Apply a smooth coat before taking a shower, washing dishes, or swimming to shield your stain from water, chlorinated pools, and soaps.

Together, using the Oil on day one and the Balm daily for the next two weeks will keep your mehndi looking rich, vibrant, and lustrous for up to 21 days!`
    },
    {
      id: 'aftercare-3',
      title: 'The Science of Mehndi Oxidation: Why Henna Darkens Over 48 Hours',
      category: 'after-care',
      categoryName: 'After Care',
      badge: 'Aftercare Guide',
      author: 'Khushi Studio Research',
      date: 'February 22, 2025',
      readTime: '6 min read',
      img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=250&fit=crop',
      featured: false,
      excerpt: 'Understand the biochemical process of Lawsone binding with keratin. Why skin warmth, oxygen exposure, and avoiding petroleum jellies ensure the deepest dark maroon finish.',
      content: `Have you ever wondered why your henna stain appears bright pumpkin orange upon removal, but darkens into a gorgeous deep burgundy or chocolate brown 48 hours later? The answer lies in the unique chemistry of Lawsonia inermis.

The active dye compound in henna is Lawsone (2-hydroxy-1,4-naphthoquinone). Lawsone has a strong natural affinity for keratin, the primary protein found in human skin cells, nails, and hair. Because the palms and soles of the feet have the thickest layer of keratinized cells (the stratum corneum), they always yield the darkest and longest-lasting stain.

When you scrape the dried paste away, Lawsone molecules are freshly bound to skin keratin. In the presence of atmospheric oxygen and natural body heat, an oxidation reaction occurs. Over the next 36 to 48 hours, the molecular structure stabilizes and darkens progressively.

Avoid petroleum-based jellies (like Vaseline) during the first 24 hours, as petroleum forms an impenetrable seal that deprives the skin of the oxygen required for oxidation. Stick to breathable botanical balms and oils for the darkest possible stain!`
    }
  ];

  class MehndiDatabase {
    constructor() {
      this.categories = [];
      this.variations = [];
      this.soaps = [];
      this.orders = [];
      this.blogs = [];
      this.init();
    }

    init() {
      // Load or Initialize Catalog
      try {
        const storedCatalog = localStorage.getItem(DB_STORAGE_KEY);
        if (storedCatalog) {
          const parsed = JSON.parse(storedCatalog);
          if (parsed && Array.isArray(parsed.categories) && Array.isArray(parsed.variations) && parsed.categories.length === DEFAULT_CATEGORIES.length) {
            this.categories = parsed.categories;
            this.variations = parsed.variations;
            this.syncImagesFromDefaults();
          } else {
            this.resetToDefaults();
          }
        } else {
          this.resetToDefaults();
        }
      } catch (e) {
        console.warn('Error reading MehndiDB from localStorage, using defaults:', e);
        this.resetToDefaults();
      }

      // Load Orders
      try {
        const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        this.orders = storedOrders ? JSON.parse(storedOrders) : [];
      } catch (e) {
        this.orders = [];
        this.blogs = [];
      }

      // Load or Initialize Soaps
      try {
        const storedSoaps = localStorage.getItem(SOAPS_STORAGE_KEY);
        if (storedSoaps) {
          const parsedSoaps = JSON.parse(storedSoaps);
          if (parsedSoaps && Array.isArray(parsedSoaps) && parsedSoaps.length === DEFAULT_SOAPS.length) {
            this.soaps = parsedSoaps;
            this.syncSoapImagesFromDefaults();
          } else {
            this.resetSoapsToDefaults();
          }
        } else {
          this.resetSoapsToDefaults();
        }
      } catch (e) {
        console.warn('Error reading soaps from localStorage, using defaults:', e);
        this.resetSoapsToDefaults();
      }
    }

    syncImagesFromDefaults() {
      let updated = false;
      this.categories.forEach(cat => {
        const def = DEFAULT_CATEGORIES.find(d => d.id === cat.id);
        if (def) {
          cat.image = def.image;
          cat.images = def.images;
          updated = true;
        }
      });
      this.variations.forEach(v => {
        const def = DEFAULT_VARIATIONS.find(d => d.sku === v.sku);
        if (def) {
          v.img = def.img;
          v.imgs = def.imgs;
          updated = true;
        }
      });
      if (updated) this.persist();
    }

    persist() {
      try {
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify({
          version: 2,
          lastUpdated: new Date().toISOString(),
          categories: this.categories,
          variations: this.variations
        }));
        window.dispatchEvent(new CustomEvent('mehndi_db_updated', {
          detail: { timestamp: Date.now() }
        }));
      } catch (e) {
        console.error('Failed to persist MehndiDB to localStorage:', e);
      }
    }

    persistOrders() {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
        window.dispatchEvent(new CustomEvent('mehndi_orders_updated', {
          detail: { count: this.orders.length }
        }));
      } catch (e) {
        console.error('Failed to persist orders:', e);
      }
    }

    resetToDefaults() {
      this.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
      this.variations = JSON.parse(JSON.stringify(DEFAULT_VARIATIONS));
      this.persist();
      this.resetSoapsToDefaults();
      return true;
    }

    // â”€â”€ Queries â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getCategories() {
      return [...this.categories];
    }

    getCategory(categoryId) {
      return this.categories.find(c => c.id === categoryId) || null;
    }

    getAllVariations() {
      return [...this.variations];
    }

    getVariationsByCategory(categoryId) {
      return this.variations.filter(v => v.categoryId === categoryId);
    }

    getSubcategories(categoryId) {
      const vars = this.getVariationsByCategory(categoryId);
      const subs = [];
      vars.forEach(v => {
        if (v.subCategory && !subs.includes(v.subCategory)) {
          subs.push(v.subCategory);
        }
      });
      return subs;
    }

    getSizes(categoryId, subCategory = null) {
      let vars = this.getVariationsByCategory(categoryId);
      if (subCategory) {
        vars = vars.filter(v => v.subCategory === subCategory);
      }
      const sizes = [];
      vars.forEach(v => {
        if (v.variation && !sizes.includes(v.variation)) {
          sizes.push(v.variation);
        }
      });
      return sizes;
    }

    getVariation(sku) {
      const v = this.variations.find(v => v.sku === sku);
      if (v) return v;
      return this.getSoap(sku);
    }

    // â”€â”€ Soap Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    getSoaps() {
      return [...this.soaps];
    }

    getSoap(skuOrId) {
      if (!skuOrId) return null;
      return this.soaps.find(s => s.sku === skuOrId || s.id === skuOrId) || null;
    }

    updateSoapPrice(sku, newPrice, newOriginal = null) {
      const item = this.soaps.find(s => s.sku === sku || s.id === sku);
      if (!item) return false;
      item.price = Number(newPrice);
      if (newOriginal !== null && newOriginal !== undefined) {
        item.original = Number(newOriginal);
      }
      if (item.variants && item.variants.length > 0) {
        item.variants[0].price = item.price;
        if (item.original) item.variants[0].original = item.original;
      }
      this.persistSoaps();
      return true;
    }

    updateSoapStock(sku, newStock, newCount = null) {
      const item = this.soaps.find(s => s.sku === sku || s.id === sku);
      if (!item) return false;
      item.stock = newStock;
      if (newCount !== null && newCount !== undefined) {
        item.stockCount = Number(newCount);
      }
      this.persistSoaps();
      return true;
    }

    persistSoaps() {
      try {
        localStorage.setItem(SOAPS_STORAGE_KEY, JSON.stringify(this.soaps));
        window.dispatchEvent(new CustomEvent('mehndi_soaps_updated', {
          detail: { count: this.soaps.length, timestamp: Date.now() }
        }));
      } catch (e) {
        console.error('Failed to persist soaps:', e);
      }
    }

    resetSoapsToDefaults() {
      this.soaps = JSON.parse(JSON.stringify(DEFAULT_SOAPS));
      this.persistSoaps();
      return true;
    }

    syncSoapImagesFromDefaults() {
      let updated = false;
      this.soaps.forEach(soap => {
        const def = DEFAULT_SOAPS.find(d => d.id === soap.id || d.sku === soap.sku);
        if (def) {
          soap.img = def.img;
          soap.imgs = def.imgs;
          if (!soap.variants || soap.variants.length === 0) {
            soap.variants = def.variants;
          }
          updated = true;
        }
      });
      if (updated) this.persistSoaps();
    }

    findVariation(categoryId, subCategory = null, size = null) {
      return this.variations.find(v => {
        if (v.categoryId !== categoryId) return false;
        if (subCategory && v.subCategory !== subCategory) return false;
        if (size && v.variation !== size) return false;
        return true;
      }) || null;
    }

    // â”€â”€ Admin Updates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    updatePrice(sku, newPrice, newOriginal = null) {
      const item = this.variations.find(v => v.sku === sku);
      if (!item) return false;
      item.price = Number(newPrice);
      if (newOriginal !== null && newOriginal !== undefined) {
        item.original = newOriginal ? Number(newOriginal) : null;
      }
      this.persist();
      return true;
    }

    updateStock(sku, stockStatus, stockCount = null) {
      const item = this.variations.find(v => v.sku === sku);
      if (!item) return false;
      item.stock = stockStatus;
      if (stockCount !== null) {
        item.stockCount = Number(stockCount);
      }
      this.persist();
      return true;
    }

    updateVariationDetails(sku, updates) {
      const item = this.variations.find(v => v.sku === sku);
      if (!item) return false;
      Object.assign(item, updates);
      this.persist();
      return true;
    }

    // â”€â”€ Order Operations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    saveOrder(orderData) {
      const order = {
        id: orderData.id || ('MHD-' + Date.now().toString().slice(-6)),
        createdAt: new Date().toISOString(),
        customer: orderData.customer || {},
        items: orderData.items || [],
        subtotal: orderData.subtotal || 0,
        shipping: orderData.shipping || 0,
        total: orderData.total || 0,
        paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
        status: orderData.status || 'Placed'
      };

      this.orders.unshift(order);
      this.persistOrders();

      // Decrement stock for purchased variations or soaps
      let soapStockChanged = false;
      order.items.forEach(item => {
        const variant = this.getVariation(item.sku);
        if (variant && variant.stockCount !== undefined) {
          variant.stockCount = Math.max(0, variant.stockCount - (item.qty || 1));
          if (variant.stockCount === 0) variant.stock = 'out-of-stock';
          else if (variant.stockCount < 10) variant.stock = 'low-stock';
          if (variant.categoryId === 'soap') soapStockChanged = true;
        }
      });
      this.persist();
      if (soapStockChanged) this.persistSoaps();

      return order;
    }

    getOrders() {
      return [...this.orders];
    }

    getOrderById(id) {
      return this.orders.find(o => o.id === id) || null;
    }

    updateOrderStatus(orderId, newStatus) {
      const order = this.orders.find(o => o.id === orderId);
      if (!order) return false;
      order.status = newStatus;
      this.persistOrders();
      return true;
    }
  }


  // â”€â”€ Blog Operations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  loadBlogs() {
    try {
      const stored = localStorage.getItem(BLOG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.blogs = parsed;
          return this.blogs;
        }
      }
    } catch (e) {
      console.warn('Could not load blogs from storage:', e);
    }
    this.blogs = JSON.parse(JSON.stringify(DEFAULT_BLOGS));
    this.persistBlogs();
    return this.blogs;
  }

  persistBlogs() {
    try {
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(this.blogs));
    } catch (e) {
      console.error('Failed to persist blogs:', e);
    }
  }

  getBlogs() {
    if (!this.blogs || this.blogs.length === 0) {
      this.loadBlogs();
    }
    return [...this.blogs];
  }

  getBlogsByCategory(catId) {
    const all = this.getBlogs();
    if (!catId || catId === 'all') return all;
    return all.filter(b => b.category === catId);
  }

  getBlog(id) {
    const all = this.getBlogs();
    return all.find(b => b.id === id) || null;
  }

  saveBlog(blogData) {
    if (!this.blogs) this.blogs = [];
    const index = this.blogs.findIndex(b => b.id === blogData.id);
    if (index >= 0) {
      this.blogs[index] = { ...this.blogs[index], ...blogData, updatedAt: new Date().toISOString() };
    } else {
      const newBlog = {
        id: blogData.id || ('blog-' + Date.now().toString().slice(-6)),
        createdAt: new Date().toISOString(),
        ...blogData
      };
      this.blogs.unshift(newBlog);
    }
    this.persistBlogs();
    window.dispatchEvent(new CustomEvent('mehndi_blogs_updated', { detail: { blogs: this.blogs } }));
    return true;
  }

  deleteBlog(id) {
    if (!this.blogs) return false;
    const initialLen = this.blogs.length;
    this.blogs = this.blogs.filter(b => b.id !== id);
    if (this.blogs.length !== initialLen) {
      this.persistBlogs();
      window.dispatchEvent(new CustomEvent('mehndi_blogs_updated', { detail: { blogs: this.blogs } }));
      return true;
    }
    return false;
  }

  resetBlogsToDefaults() {
    this.blogs = JSON.parse(JSON.stringify(DEFAULT_BLOGS));
    this.persistBlogs();
    window.dispatchEvent(new CustomEvent('mehndi_blogs_updated', { detail: { blogs: this.blogs } }));
    return this.blogs;
  }
}

  // Create single instance and expose globally
  const db = new MehndiDatabase();
window.MehndiDB = db;
window.DEFAULT_SOAPS = DEFAULT_SOAPS;
window.SOAPS = db.getSoaps();
window.BLOG_CATEGORIES = BLOG_CATEGORIES;
window.DEFAULT_BLOGS = DEFAULT_BLOGS;
window.BLOGS = db.getBlogs();

}) ();


