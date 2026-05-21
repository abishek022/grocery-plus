import { useState, useEffect } from 'react'

function App() {
  const [screen, setScreen] = useState('welcome');
  const [activeTab, setActiveTab] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('11 AM - 12 PM');

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('msg_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [authMode, setAuthMode] = useState('signin');
  const [authStep, setAuthStep] = useState('form');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  const [authStatusTone, setAuthStatusTone] = useState('error');
  const [authLoading, setAuthLoading] = useState(false);
  
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I\'m your grocery assistant. How can I help you today?' }]);
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pendingIngredients, setPendingIngredients] = useState([]);

  const products = [
    { id: 1, name: 'Radhuni Shemai', price: 60, image: 'https://images.unsplash.com/photo-1605698801267-27b03657788b?w=600&auto=format&fit=crop', description: 'Traditional vermicelli dessert for festive moments.', rating: 4.5, stock: 15 },
    { id: 2, name: 'Cheese Puffs', price: 70, image: 'https://images.unsplash.com/photo-1599490659223-e153c07ea0b4?w=600&auto=format&fit=crop', description: 'Crunchy cheesy snack for quick cravings.', rating: 4.2, stock: 25 },
    { id: 3, name: 'Fresh Bread', price: 45, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop', description: 'Soft bakery bread baked fresh.', rating: 4.7, stock: 30 },
    { id: 4, name: 'Organic Eggs (12 pcs)', price: 120, image: 'https://images.unsplash.com/photo-1516448424440-9dbca97779c1?w=600&auto=format&fit=crop', description: 'Farm fresh eggs, protein rich.', rating: 4.8, stock: 20 },
    { id: 5, name: 'DANO Milk (500ml)', price: 182, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop', description: 'Pure milk for tea, coffee and daily use.', rating: 4.6, stock: 18 },
    { id: 6, name: 'Basmati Rice (1kg)', price: 165, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop', description: 'Aromatic long-grain rice.', rating: 4.7, stock: 40 },
    { id: 7, name: 'Toor Dal (1kg)', price: 140, image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=600&auto=format&fit=crop', description: 'Premium lentils for everyday cooking.', rating: 4.4, stock: 35 },
    { id: 8, name: 'Fresh Bananas (1 dozen)', price: 55, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop', description: 'Sweet ripe bananas, rich in potassium.', rating: 4.5, stock: 50 },
    { id: 9, name: 'Apples (1kg)', price: 190, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop', description: 'Crisp apples, great for snacking.', rating: 4.6, stock: 45 },
    { id: 10, name: 'Tomatoes (1kg)', price: 48, image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop', description: 'Fresh tomatoes for curries and salads.', rating: 4.3, stock: 60 },
    { id: 11, name: 'Onion (1kg)', price: 52, image: 'https://images.unsplash.com/photo-1618519764620-7403abdbfee9?w=600&auto=format&fit=crop', description: 'Everyday onions for cooking.', rating: 4.2, stock: 55 },
    { id: 12, name: 'Potato (1kg)', price: 38, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop', description: 'Fresh potatoes, versatile for many dishes.', rating: 4.4, stock: 70 },
    { id: 13, name: 'Fresh Chicken (500g)', price: 210, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop', description: 'Fresh cut chicken for delicious meals.', rating: 4.7, stock: 25 },
    { id: 14, name: 'Paneer (200g)', price: 95, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop', description: 'Soft paneer cubes for curries & snacks.', rating: 4.5, stock: 30 },
    { id: 15, name: 'Yogurt Curd (400g)', price: 55, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop', description: 'Thick curd, great with meals.', rating: 4.6, stock: 40 },
    { id: 16, name: 'Butter (100g)', price: 60, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop', description: 'Creamy butter for toast and baking.', rating: 4.5, stock: 35 },
    { id: 17, name: 'Orange Juice (1L)', price: 120, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&auto=format&fit=crop', description: 'Refreshing juice rich in vitamin C.', rating: 4.4, stock: 28 },
    { id: 18, name: 'Green Tea (25 bags)', price: 110, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&auto=format&fit=crop', description: 'Light and refreshing tea bags.', rating: 4.6, stock: 45 },
    { id: 19, name: 'Instant Noodles', price: 35, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop', description: 'Quick noodles for busy days.', rating: 3.8, stock: 80 },
    { id: 20, name: 'Potato Chips', price: 40, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop', description: 'Crispy chips for snacking.', rating: 4.1, stock: 65 },
    { id: 21, name: 'Basmati Flour (Atta) 1kg', price: 78, image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=600&auto=format&fit=crop', description: 'Whole wheat flour for soft rotis.', rating: 4.4, stock: 40 },
    { id: 22, name: 'Sugar (1kg)', price: 55, image: 'https://images.unsplash.com/photo-1622484211148-71649931301c?w=600&auto=format&fit=crop', description: 'Fine sugar for tea and desserts.', rating: 4.2, stock: 70 },
    { id: 23, name: 'Salt (1kg)', price: 22, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop', description: 'Iodized salt for everyday cooking.', rating: 4.6, stock: 90 },
    { id: 24, name: 'Sunflower Oil (1L)', price: 160, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop', description: 'Light cooking oil for frying & sauté.', rating: 4.5, stock: 35 },
    { id: 25, name: 'Turmeric Powder (200g)', price: 48, image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop', description: 'Pure turmeric for aroma and color.', rating: 4.7, stock: 60 },
    { id: 26, name: 'Red Chilli Powder (200g)', price: 55, image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop', description: 'Spice up your meals with chilli.', rating: 4.4, stock: 55 },
    { id: 27, name: 'Cumin Seeds (100g)', price: 38, image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop', description: 'Aromatic cumin seeds for tadka.', rating: 4.6, stock: 65 },
    { id: 28, name: 'Coriander Powder (200g)', price: 44, image: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&auto=format&fit=crop', description: 'Fresh coriander powder for curry.', rating: 4.3, stock: 50 },
    { id: 29, name: 'Fresh Spinach (500g)', price: 35, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop', description: 'Leafy greens rich in iron.', rating: 4.2, stock: 30 },
    { id: 30, name: 'Carrots (1kg)', price: 65, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop', description: 'Fresh crunchy carrots.', rating: 4.4, stock: 45 },
    { id: 31, name: 'Cucumber (1kg)', price: 42, image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&auto=format&fit=crop', description: 'Cool cucumbers for salad.', rating: 4.3, stock: 55 },
    { id: 32, name: 'Capsicum (500g)', price: 58, image: 'https://images.unsplash.com/photo-1517093602195-b40af9688b46?w=600&auto=format&fit=crop', description: 'Fresh bell peppers.', rating: 4.1, stock: 40 },
    { id: 33, name: 'Cauliflower (1 pc)', price: 52, image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ec3?w=600&auto=format&fit=crop', description: 'Fresh cauliflower for curries.', rating: 4.2, stock: 25 },
    { id: 34, name: 'Broccoli (500g)', price: 85, image: 'https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ec?w=600&auto=format&fit=crop', description: 'Healthy broccoli florets.', rating: 4.3, stock: 22 },
    { id: 35, name: 'Ginger (200g)', price: 28, image: 'https://images.unsplash.com/photo-1596316538745-f25603e91122?w=600&auto=format&fit=crop', description: 'Fresh ginger for tea and cooking.', rating: 4.5, stock: 60 },
    { id: 36, name: 'Garlic (200g)', price: 32, image: 'https://images.unsplash.com/photo-1567982047351-76b6f93e38ee?w=600&auto=format&fit=crop', description: 'Aromatic garlic cloves.', rating: 4.6, stock: 65 },
    { id: 37, name: 'Lemon (6 pcs)', price: 25, image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=600&auto=format&fit=crop', description: 'Juicy lemons for salads & drinks.', rating: 4.4, stock: 80 },
    { id: 38, name: 'Mango (1kg)', price: 160, image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&auto=format&fit=crop', description: 'Sweet seasonal mangoes.', rating: 4.7, stock: 20 },
    { id: 39, name: 'Grapes (500g)', price: 110, image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop', description: 'Fresh grapes, perfect snack.', rating: 4.4, stock: 28 },
    { id: 40, name: 'Strawberries (250g)', price: 150, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop', description: 'Juicy strawberries.', rating: 4.6, stock: 18 },
    { id: 41, name: 'Almonds (250g)', price: 220, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&auto=format&fit=crop', description: 'Crunchy almonds, healthy snack.', rating: 4.6, stock: 25 },
    { id: 42, name: 'Cashews (250g)', price: 260, image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop', description: 'Creamy cashews for snacks.', rating: 4.5, stock: 22 },
    { id: 43, name: 'Raisins (200g)', price: 120, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop', description: 'Sweet raisins for desserts.', rating: 4.3, stock: 35 },
    { id: 44, name: 'Corn Flakes (500g)', price: 145, image: 'https://images.unsplash.com/photo-1582401656496-9d75f95f9018?w=600&auto=format&fit=crop', description: 'Crispy cereal for breakfast.', rating: 4.2, stock: 30 },
    { id: 45, name: 'Oats (1kg)', price: 190, image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop', description: 'Healthy oats for breakfast.', rating: 4.6, stock: 28 },
    { id: 46, name: 'Coffee Powder (200g)', price: 160, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop', description: 'Rich coffee for mornings.', rating: 4.5, stock: 35 },
    { id: 47, name: 'Tea (250g)', price: 120, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop', description: 'Strong tea for refreshing breaks.', rating: 4.4, stock: 50 },
    { id: 48, name: 'Mineral Water (1L)', price: 20, image: 'https://images.unsplash.com/photo-1528826194825-0cce0a0f5cb7?w=600&auto=format&fit=crop', description: 'Pure drinking water.', rating: 4.3, stock: 100 },
    { id: 49, name: 'Soft Drink (2L)', price: 95, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop', description: 'Chilled fizzy drink.', rating: 4.0, stock: 40 },
    { id: 50, name: 'Ice Cream (500ml)', price: 160, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&auto=format&fit=crop', description: 'Creamy ice cream dessert.', rating: 4.7, stock: 18 }
  ];

  const categories = [
    { n: 'Fruits', i: '🍎', bg: 'bg-red-50' }, { n: 'Drinks', i: '🧃', bg: 'bg-blue-50' },
    { n: 'Snacks', i: '🥨', bg: 'bg-orange-50' }, { n: 'Dairy', i: '🥛', bg: 'bg-purple-50' },
    { n: 'Meat', i: '🥩', bg: 'bg-rose-50' }, { n: 'Bakery', i: '🥐', bg: 'bg-yellow-50' },
    { n: 'Veggie', i: '🥦', bg: 'bg-green-50' }, { n: 'Frozen', i: '🍦', bg: 'bg-cyan-50' }
  ];

  const suggestions = [
    { text: "You usually buy Bread on Sundays. Add it?", prod: products[2] },
    { text: "Running low on Milk? Add DANO Milk to bag?", prod: products[4] },
    { text: "Special Offer: Organic Eggs are 10% off today!", prod: products[3] }
  ];

  useEffect(() => {
    const interval = setInterval(() => setSuggestionIdx((p) => (p + 1) % suggestions.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('msg_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('msg_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  const addToCart = (prod) => {
    setCartItems(prev => {
      const exists = prev.find(item => item.id === prod.id);
      if (exists) return prev.map(item => item.id === prod.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + delta } : item).filter(i => i.qty > 0));
  };

  const getCartTotal = () => cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const getLocalBotReply = (rawInput) => {
    const input = rawInput.trim();
    const lower = input.toLowerCase();

    if (!input) return "Type something and I’ll help.";

    if (lower === 'help' || lower.includes('what can you do')) {
      return "You can ask: products, price of milk, add bread, cart total, checkout, delivery slots.";
    }

    if (lower.includes('products') || lower.includes('items') || lower.includes('available')) {
      return `Available products: ${products.map(p => p.name).join(', ')}.`;
    }

    if (lower.includes('cart') && (lower.includes('total') || lower.includes('amount'))) {
      return `Your cart total is ₹${getCartTotal()}. Delivery fee is ₹50 at checkout.`;
    }

    if (lower.includes('delivery') || lower.includes('slot') || lower.includes('time')) {
      return `Delivery slots: 8-11 AM, 11-12 PM, 12-2 PM. Selected: ${selectedTime}.`;
    }

    const matchedProduct = products.find(p => {
      const name = p.name.toLowerCase();
      const firstWord = name.split(' ')[0];
      // Use regex to match whole words only
      const regexName = new RegExp(`\\b${name}\\b`, 'i');
      const regexFirst = new RegExp(`\\b${firstWord}\\b`, 'i');
      return regexName.test(lower) || regexFirst.test(lower);
    });

    if (matchedProduct && (lower.includes('price') || lower.includes('cost'))) {
      return `${matchedProduct.name} costs ₹${matchedProduct.price}. Want me to add it to your cart?`;
    }

    if (matchedProduct && (lower.startsWith('add ') || lower.includes(' add ') || lower.includes('buy ') || lower.includes('buy'))) {
      addToCart(matchedProduct);
      return `Added ${matchedProduct.name} to your cart.`;
    }

    if (lower.includes('checkout') || lower.includes('place order')) {
      if (cartItems.length === 0) return "Your cart is empty. Add items first.";
      return "Go to the Cart tab and tap 'Checkout Now →' to place your order.";
    }

    return "I didn’t understand that. Try: 'products', 'price of milk', 'add bread', 'cart total'.";
  };

  const handleAiChat = async (input) => {
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setChatInput('');

    const lowerText = text.toLowerCase();
    const isConfirming = pendingIngredients.length > 0 && (
      lowerText === 'yes' || lowerText === 'y' || lowerText.includes('add') || lowerText.includes('sure') || lowerText.includes('ok') || lowerText.includes('please') || lowerText.includes('yeah')
    );

    if (isConfirming) {
      pendingIngredients.forEach(prod => addToCart(prod));
      const addedNames = pendingIngredients.map(p => `🛍️ ${p.name} is added successfully to your cart.`);
      setMessages(prev => [...prev, { role: 'ai', text: addedNames.join('\n') }]);
      setPendingIngredients([]);
      return;
    }
    
    const isDeclining = pendingIngredients.length > 0 && (
      lowerText === 'no' || lowerText === 'n' || lowerText.includes('don\'t') || lowerText.includes('do not') || lowerText.includes('cancel')
    );
    if (isDeclining) {
      setMessages(prev => [...prev, { role: 'ai', text: "Alright, I haven't added anything to your cart." }]);
      setPendingIngredients([]);
      return;
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            products,
            cartItems,
            selectedDate,
            selectedTime,
          },
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('rate_limit');
        }
        throw new Error('api_failed');
      }
      const data = await res.json();
      
      const replyText = (data?.reply || '').toString().trim();
      const addedItems = [];
      
      if (Array.isArray(data?.ingredients)) {
        data.ingredients.forEach(ingName => {
          const matched = products.find(p => {
            const prodNameLower = p.name.toLowerCase();
            const ingNameLower = ingName.toLowerCase();
            return prodNameLower.includes(ingNameLower) || ingNameLower.includes(prodNameLower) ||
                   prodNameLower.split(' ')[0] === ingNameLower;
          });
          if (matched && !addedItems.some(existing => existing.id === matched.id)) {
            addedItems.push(matched);
          }
        });
      }
      
      let finalReply = replyText || 'Here is what I prepared for you.';
      if (addedItems.length > 0) {
        setPendingIngredients(addedItems);
      }
      
      setMessages(prev => [...prev, { role: 'ai', text: finalReply }]);
    } catch (e) {
      console.error(e);
      if (e.message === 'rate_limit') {
        setMessages(prev => [...prev, { role: 'ai', text: "I'm receiving too many requests right now! Please wait a few seconds before asking me for another recipe." }]);
      } else {
        const reply = getLocalBotReply(text);
        setMessages(prev => [...prev, { role: 'ai', text: reply }]);
      }
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openProductDetails = (product) => setSelectedProduct(product);
  const closeProductDetails = () => setSelectedProduct(null);

  const getFallbackImage = (productName) => {
    const n = (productName || '').toLowerCase();
    if (n.includes('milk') || n.includes('curd') || n.includes('paneer') || n.includes('butter')) return 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop';
    if (n.includes('bread') || n.includes('atta') || n.includes('flour')) return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop';
    if (n.includes('egg')) return 'https://images.unsplash.com/photo-1569291131429-2342c56a1614?w=600&auto=format&fit=crop';
    if (n.includes('rice') || n.includes('dal')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc500f?w=600&auto=format&fit=crop';
    if (n.includes('chicken') || n.includes('meat')) return 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=600&auto=format&fit=crop';
    if (n.includes('tomato') || n.includes('onion') || n.includes('potato') || n.includes('spinach') || n.includes('broccoli') || n.includes('cauliflower') || n.includes('capsicum') || n.includes('carrot') || n.includes('cucumber') || n.includes('ginger') || n.includes('garlic')) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop';
    if (n.includes('banana') || n.includes('apple') || n.includes('mango') || n.includes('grape') || n.includes('straw') || n.includes('lemon')) return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop';
    if (n.includes('tea') || n.includes('coffee')) return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop';
    if (n.includes('water') || n.includes('juice') || n.includes('drink')) return 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop';
    if (n.includes('chips') || n.includes('puffs') || n.includes('noodles')) return 'https://images.unsplash.com/photo-1599490659223-e153c07ea0b4?w=600&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop';
  };

  const handleImgError = (e, productName) => {
    const el = e.currentTarget;
    if (el.dataset.fallbackApplied === '1') return;
    el.dataset.fallbackApplied = '1';
    el.src = getFallbackImage(productName);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000),
      items: [...cartItems],
      date: selectedDate,
      total: cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0) + 50
    };
    setOrders([newOrder, ...orders]);
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setCartItems([]);
      setActiveTab('profile');
    }, 2500);
  };

  const resetAuthForm = () => {
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthConfirmPassword('');
    setAuthStatus('');
    setAuthStatusTone('error');
    setAuthLoading(false);
    setAuthStep('form');
  };

  const loadAccounts = () => {
    try {
      const raw = localStorage.getItem('msg_accounts');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const saveAccounts = (accounts) => {
    try {
      localStorage.setItem('msg_accounts', JSON.stringify(accounts));
    } catch {
      // ignore
    }
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authLoading) return;
    setAuthStatus('');
    setAuthStatusTone('error');
    setAuthLoading(true);

    const email = authEmail.trim().toLowerCase();
    if (!email.includes('@') || !email.includes('.')) {
      setAuthStatus('Please enter a valid email address.');
      setAuthLoading(false);
      return;
    }
    if (authPassword.length < 6) {
      setAuthStatus('Password must be at least 6 characters.');
      setAuthLoading(false);
      return;
    }

    if (authMode === 'signup') {
      if (authName.trim().length < 2) {
        setAuthStatus('Please enter your name.');
        setAuthLoading(false);
        return;
      }
      if (authPassword !== authConfirmPassword) {
        setAuthStatus('Passwords do not match.');
        setAuthLoading(false);
        return;
      }

      const accounts = loadAccounts();
      const exists = accounts.find(a => (a.email || '').toLowerCase() === email);
      if (exists) {
        setAuthStatus('An account with this email already exists. Please sign in.');
        setAuthLoading(false);
        return;
      }

      const nextAccounts = [{ name: authName.trim(), email, password: authPassword }, ...accounts];
      saveAccounts(nextAccounts);

      setUser({ name: authName.trim(), email });
      setActiveTab('home');
      setScreen('main');
      resetAuthForm();
      return;
    }

    const accounts = loadAccounts();
    const account = accounts.find(a => (a.email || '').toLowerCase() === email);
    if (!account) {
      setAuthStatus('No account found for this email. Please sign up.');
      setAuthLoading(false);
      return;
    }
    if ((account.password || '') !== authPassword) {
      setAuthStatus('Incorrect password. Please try again.');
      setAuthLoading(false);
      return;
    }

    setUser({
      name: account.name || 'User',
      email,
    });
    setActiveTab('home');
    setScreen('main');
    resetAuthForm();
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (authLoading) return;
    setAuthLoading(true);
    setAuthStatusTone('error');
    const email = authEmail.trim().toLowerCase();
    if (!email.includes('@') || !email.includes('.')) {
      setAuthStatus('Please enter a valid email address.');
      setAuthStatusTone('error');
      setAuthLoading(false);
      return;
    }
    const accounts = loadAccounts();
    const account = accounts.find(a => (a.email || '').toLowerCase() === email);
    if (!account) {
      setAuthStatus('No account found for this email. Please sign up.');
      setAuthStatusTone('error');
      setAuthLoading(false);
      return;
    }
    setAuthStatus('Reset link sent (demo). In a real app you would receive an email.');
    setAuthStatusTone('success');
    setAuthLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setCartItems([]);
    setActiveTab('home');
    setScreen('auth');
    resetAuthForm();
  };

  if (screen === 'welcome') return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8 text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-64 h-64 bg-emerald-50 rounded-[40px] mb-12 flex items-center justify-center overflow-hidden">
           <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" alt="Fresh groceries" loading="lazy" className="object-cover h-full w-full" />
        </div>
        <h1 className="text-[32px] font-black leading-tight mb-4">Fresh Groceries <br/> Delivered to your <br/> <span className="text-[#4CAF50]">Doorstep</span></h1>
      </div>
      <button onClick={() => setScreen(user ? 'main' : 'auth')} className="w-full bg-[#4CAF50] text-white py-5 rounded-[24px] font-black text-lg mb-10 shadow-lg transition active:scale-[0.99] hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-emerald-200">Get Started</button>
    </div>
  );

  if (screen === 'auth') return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[32px] shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black">Grocery Plus</h1>
              <p className="text-sm font-bold text-gray-400">Smart grocery shopping</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl">🛒</div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-1 flex mb-6">
            <button
              onClick={() => {
                setAuthMode('signin');
                setAuthStep('form');
                setAuthStatus('');
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-sm ${authMode === 'signin' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setAuthStep('form');
                setAuthStatus('');
              }}
              className={`flex-1 py-3 rounded-2xl font-black text-sm ${authMode === 'signup' ? 'bg-white shadow-sm' : 'text-gray-400'}`}
            >
              Sign Up
            </button>
          </div>

          {authStep === 'forgot' ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <h2 className="text-xl font-black">Forgot password</h2>
              <p className="text-sm font-bold text-gray-400">Enter your email to receive a reset link.</p>
              <input
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="w-full bg-white p-4 rounded-2xl border font-black text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              {authStatus && (
                <div className={`text-sm font-black rounded-2xl p-4 border ${authStatusTone === 'success' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-100'}`}>
                  {authStatus}
                </div>
              )}
              <button
                type="submit"
                className={`w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-black shadow-lg transition active:scale-[0.99] ${authLoading ? 'opacity-60' : 'hover:brightness-95'}`}
                disabled={authLoading}
              >
                {authLoading ? 'Sending…' : 'Send reset link'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthStep('form');
                  setAuthStatus('');
                }}
                className="w-full py-4 rounded-2xl font-black border bg-white transition active:scale-[0.99] hover:bg-gray-50"
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <h2 className="text-xl font-black">{authMode === 'signin' ? 'Welcome back' : 'Create your account'}</h2>
              <p className="text-sm font-bold text-gray-400">
                {authMode === 'signin' ? 'Sign in to continue.' : 'Sign up to start shopping.'}
              </p>

              {authMode === 'signup' && (
                <input
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  type="text"
                  placeholder="Full name"
                  className="w-full bg-white p-4 rounded-2xl border font-black text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                />
              )}

              <input
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="w-full bg-white p-4 rounded-2xl border font-black text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />

              <input
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="w-full bg-white p-4 rounded-2xl border font-black text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />

              {authMode === 'signup' && (
                <input
                  value={authConfirmPassword}
                  onChange={(e) => setAuthConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirm password"
                  className="w-full bg-white p-4 rounded-2xl border font-black text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                />
              )}

              {authStatus && (
                <div className={`text-sm font-black rounded-2xl p-4 border ${authStatusTone === 'success' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-100'}`}>
                  {authStatus}
                </div>
              )}

              <button
                type="submit"
                className={`w-full bg-[#4CAF50] text-white py-4 rounded-2xl font-black shadow-lg transition active:scale-[0.99] ${authLoading ? 'opacity-60' : 'hover:brightness-95'}`}
                disabled={authLoading}
              >
                {authLoading ? 'Please wait…' : (authMode === 'signin' ? 'Sign In' : 'Create Account')}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('forgot');
                    setAuthStatus('');
                  }}
                  className="text-sm font-black text-emerald-600"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('welcome')}
                  className="text-sm font-black text-gray-400"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 pt-2">
      {orderPlaced && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center px-6">
            <div className="bg-white p-8 rounded-[40px] text-center w-full max-w-sm">
                <div className="text-6xl mb-4">🚚</div>
                <h2 className="text-2xl font-black mb-2">Order Placed!</h2>
                <p className="text-gray-500 font-bold tracking-tight">Arriving {selectedDate} <br/> at {selectedTime}</p>
            </div>
        </div>
      )}

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[260] bg-black/55 flex items-end sm:items-center justify-center px-4"
          onClick={closeProductDetails}
        >
          <div
            className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">Product Details</p>
                <h3 className="text-xl font-black leading-tight">{selectedProduct.name}</h3>
              </div>
              <button
                onClick={closeProductDetails}
                className="w-10 h-10 bg-gray-100 rounded-full font-bold transition active:scale-[0.98] hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-50 rounded-[28px] p-3 mb-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                loading="lazy"
                onError={(e) => handleImgError(e, selectedProduct.name)}
                className="w-full h-52 object-cover rounded-[22px]"
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-600">{selectedProduct.description || 'Fresh and high quality product.'}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">★</span>
                  <span className="font-black text-sm">{selectedProduct.rating ?? 4.5}</span>
                  <span className="text-[11px] font-black text-gray-400">/ 5</span>
                </div>
                <span className={`text-[11px] font-black px-3 py-1 rounded-full ${selectedProduct.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">Price</p>
                  <p className="text-2xl font-black text-[#F08000]">₹{selectedProduct.price}</p>
                </div>
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    closeProductDetails();
                  }}
                  disabled={selectedProduct.stock === 0}
                  className={`bg-[#4CAF50] text-white px-6 py-4 rounded-[22px] font-black shadow-lg transition active:scale-[0.99] ${selectedProduct.stock === 0 ? 'opacity-50' : 'hover:brightness-95'}`}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAiOpen && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex flex-col justify-end">
          <div className="bg-white rounded-t-[40px] h-[85vh] flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Assistant</h3>
              <button onClick={() => setIsAiOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full font-bold transition active:scale-[0.98] hover:bg-gray-200">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[24px] font-bold text-[13px] ${m.role === 'ai' ? 'bg-emerald-50 text-emerald-900' : 'bg-[#4CAF50] text-white'}`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl border">
              <input value={chatInput} onChange={(e)=>setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiChat(chatInput)} placeholder="Ask about products, prices, cart..." className="flex-1 bg-transparent px-3 outline-none" />
              <button onClick={() => handleAiChat(chatInput)} className="bg-[#4CAF50] text-white w-10 h-10 rounded-xl flex items-center justify-center font-black transition active:scale-[0.98] hover:brightness-95">↑</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-black">Grocery Plus</h1>
        <button onClick={() => setIsAiOpen(true)} className="bg-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-2xl transition active:scale-[0.98] hover:bg-gray-50">✨</button>
      </div>

      {activeTab === 'home' && (
        <div className="px-6 space-y-8">
          <div className="bg-white rounded-[28px] border shadow-sm p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-lg">🔎</div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="flex-1 bg-transparent outline-none font-bold text-[13px]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="w-10 h-10 rounded-2xl bg-gray-50 hover:bg-gray-100 transition active:scale-[0.98] font-black"
              >
                ✕
              </button>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#70B9FF] to-[#C29BFF] p-6 rounded-[32px] text-white shadow-xl">
            <p className="font-bold text-lg leading-tight mb-4">{suggestions[suggestionIdx].text}</p>
            <button onClick={() => addToCart(suggestions[suggestionIdx].prod)} className="bg-[#1E40AF] px-6 py-2 rounded-full text-[10px] font-black uppercase transition active:scale-[0.99] hover:brightness-95">Quick Add</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(searchQuery ? filteredProducts : products).map(p => (
              <button
                key={p.id}
                onClick={() => openProductDetails(p)}
                className="text-left bg-white p-3 rounded-[24px] border shadow-sm flex flex-col items-center transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => handleImgError(e, p.name)}
                  className="h-20 w-full object-cover rounded-2xl mb-2"
                />
                <h3 className="font-black text-[10px] text-center line-clamp-2">{p.name}</h3>
                <p className="text-[#F08000] font-black mb-2 text-[11px]">₹{p.price}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(p);
                  }}
                  className="w-full bg-[#4CAF50] text-white py-2 rounded-xl text-[9px] font-black uppercase transition active:scale-[0.99] hover:brightness-95"
                >
                  Add to Bag
                </button>
              </button>
            ))}
          </div>

          {searchQuery && filteredProducts.length === 0 && (
            <div className="bg-white border rounded-[28px] p-6 text-center font-black text-gray-400">
              No products found
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="px-6 space-y-6">
          <h2 className="text-xl font-black">Categories</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map(c => (
                <div key={c.n} className={`${c.bg} p-6 rounded-[32px] border border-transparent flex flex-col items-center shadow-sm`}>
                  <span className="text-4xl mb-2">{c.i}</span>
                  <span className="font-black text-[10px] uppercase tracking-tighter text-center">{c.n}</span>
                </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cart' && (
        <div className="px-6">
          <h2 className="text-sm font-black text-gray-400 mb-4 tracking-widest uppercase">Shopping Bag</h2>
          {cartItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-3xl flex items-center gap-4 mb-3 shadow-sm">
              <div className="flex-1 font-bold text-[11px]">{item.name}<p className="text-[#F08000]">₹{item.price}</p></div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 bg-red-50 text-red-500 rounded-lg font-black transition active:scale-[0.95] hover:bg-red-100">-</button>
                <span className="font-black text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 bg-emerald-50 text-emerald-500 rounded-lg font-black transition active:scale-[0.95] hover:bg-emerald-100">+</button>
              </div>
            </div>
          ))}

          <div className="mt-6 mb-4">
            <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Delivery Date (Month/Day)</p>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-white p-4 rounded-2xl border font-black text-sm" />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-8">
            {['8-11 AM', '11-12 PM', '12-2 PM'].map(slot => (
              <button key={slot} onClick={() => setSelectedTime(slot)} className={`py-3 rounded-xl text-[9px] font-black border transition active:scale-[0.99] ${selectedTime === slot ? 'bg-emerald-50 border-emerald-500 text-emerald-600 hover:bg-emerald-100' : 'bg-white text-gray-400 hover:bg-gray-50'}`}>{slot}</button>
            ))}
          </div>
          <button onClick={handlePlaceOrder} className="w-full bg-[#4CAF50] text-white py-4 rounded-3xl font-black shadow-lg transition active:scale-[0.99] hover:brightness-95">Checkout Now →</button>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="px-6 space-y-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-2xl">👤</div>
            <div>
               <p className="font-black text-gray-800">{user?.name || 'Abhishek'}</p>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user?.email || 'Premium Member'}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full bg-white border py-4 rounded-3xl font-black text-gray-700 transition active:scale-[0.99] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200">Logout</button>

          <h2 className="text-sm font-black text-gray-400 tracking-widest uppercase">My Orders</h2>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-[32px] text-center text-gray-300 font-bold border-2 border-dashed">No orders found</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white p-5 rounded-[28px] border shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-[12px]">Order ID: #{order.id}</span>
                    <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md uppercase">Delivered</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 mb-2">{order.date}</p>
                  <p className="font-black text-[#F08000]">Total: ₹{order.total}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 w-full bg-white/90 border-t px-6 py-5 flex justify-between items-center z-50">
        <button onClick={() => setActiveTab('home')} className={`text-2xl transition active:scale-[0.95] ${activeTab === 'home' ? '' : 'grayscale opacity-30 hover:opacity-60'}`}>🏠</button>
        <button onClick={() => setActiveTab('categories')} className={`text-2xl transition active:scale-[0.95] ${activeTab === 'categories' ? '' : 'grayscale opacity-30 hover:opacity-60'}`}>📂</button>
        <button onClick={() => setActiveTab('cart')} className={`text-2xl transition active:scale-[0.95] ${activeTab === 'cart' ? '' : 'grayscale opacity-30 hover:opacity-60'}`}>👜</button>
        <button onClick={() => setActiveTab('profile')} className={`text-2xl transition active:scale-[0.95] ${activeTab === 'profile' ? '' : 'grayscale opacity-30 hover:opacity-60'}`}>👤</button>
      </div>
    </div>
  );
}

export default App;