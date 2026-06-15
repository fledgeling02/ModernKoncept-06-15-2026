const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// =============================================================================
// MIDDLEWARE
// =============================================================================
app.use(express.json({ limit: '50mb' })); // Allow large base64 images
app.use(cors()); // Enable CORS for frontend

// =============================================================================
// DATABASE CONNECTION
// =============================================================================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'capstone_db'
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database: capstone_db');
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
function generateRefCode() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `DEL-${year}-${random}`;
}

// =============================================================================
// API ROUTES - USER AUTHENTICATION
// =============================================================================

// SIGNUP - Register new user
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Check if email already exists
  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Insert new user (NO HASHING - plain text password)
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to create account'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        userId: result.insertId
      });
    });
  });
});

// LOGIN - User login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Check if user exists with matching email AND password
  const query = 'SELECT id, name, email FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = results[0];
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
});

// =============================================================================
// API ROUTES - FURNITURE MANAGEMENT
// =============================================================================

// GET all furniture
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM furniture ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch furniture'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// GET single furniture by ID
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM furniture WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch furniture'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Furniture not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// ADD new furniture
app.post('/add-product', (req, res) => {
  const { name, category, price, material, dimensions, description, image } = req.body;

  // Validate inputs
  if (!name || !category || !price) {
    return res.status(400).json({
      success: false,
      message: 'Name, category, and price are required'
    });
  }

  const query = 'INSERT INTO furniture (name, category, price, material, dimensions, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [name, category, price, material || '', dimensions || '', description || '', image || ''], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to add furniture'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Furniture added successfully',
      id: result.insertId
    });
  });
});

// UPDATE furniture
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, price, material, dimensions, description, image } = req.body;

  const query = 'UPDATE furniture SET name = ?, category = ?, price = ?, material = ?, dimensions = ?, description = ?, image = ? WHERE id = ?';
  
  db.query(query, [name, category, price, material, dimensions, description, image, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update furniture'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Furniture not found'
      });
    }

    res.json({
      success: true,
      message: 'Furniture updated successfully'
    });
  });
});

// DELETE furniture
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM furniture WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete furniture'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Furniture not found'
      });
    }

    res.json({
      success: true,
      message: 'Furniture deleted successfully'
    });
  });
});

// =============================================================================
// API ROUTES - INVENTORY MANAGEMENT
// =============================================================================

// GET all inventory
app.get('/inventory', (req, res) => {
  const query = 'SELECT * FROM inventory ORDER BY last_updated DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch inventory'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// ADD inventory item
app.post('/inventory', (req, res) => {
  const { name, category, quantity } = req.body;

  if (!name || !category || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Name, category, and quantity are required'
    });
  }

  const query = 'INSERT INTO inventory (name, category, quantity) VALUES (?, ?, ?)';
  
  db.query(query, [name, category, quantity], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to add inventory item'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Inventory item added successfully',
      id: result.insertId
    });
  });
});

// UPDATE inventory item
app.put('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const { name, category, quantity } = req.body;

  const query = 'UPDATE inventory SET name = ?, category = ?, quantity = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?';
  
  db.query(query, [name, category, quantity, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update inventory'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory updated successfully'
    });
  });
});

// DELETE inventory item
app.delete('/inventory/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM inventory WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete inventory item'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  });
});

// =============================================================================
// API ROUTES - DELIVERY MANAGEMENT
// =============================================================================

// GET all deliveries
app.get('/deliveries', (req, res) => {
  const query = 'SELECT * FROM deliveries ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch deliveries'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// GET delivery by reference code
app.get('/deliveries/track/:refCode', (req, res) => {
  const { refCode } = req.params;
  const query = 'SELECT * FROM deliveries WHERE ref_code = ?';
  
  db.query(query, [refCode], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch delivery'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// DELETE delivery
app.delete('/deliveries/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM deliveries WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete delivery'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery deleted successfully'
    });
  });
});
// GET delivery statistics (for metric panel)
app.get('/deliveries/stats', (req, res) => {
  const query = 'SELECT status, COUNT(*) as count FROM deliveries GROUP BY status';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch delivery statistics'
      });
    }

    // Initialize stats object with all possible statuses
    const stats = {
      pending: 0,
      processing: 0,
      in_transit: 0,
      delivered: 0
    };

    // Populate stats from database results
    results.forEach(row => {
      const status = row.status.toLowerCase().replace(/ /g, '_'); // FIXED: Global replace
      if (stats.hasOwnProperty(status)) {
        stats[status] = row.count;
      }
    });

    res.json({
      success: true,
      data: stats
    });
  });
});

// CREATE new delivery
app.post('/deliveries', (req, res) => {
  const { customer_name, contact_number, address, product, status, delivery_type, delivery_date } = req.body;

  if (!customer_name || !address) {
    return res.status(400).json({
      success: false,
      message: 'Customer name and address are required'
    });
  }

  const ref_code = generateRefCode();

  const query = `INSERT INTO deliveries
    (ref_code, customer_name, contact_number, address, product, status, delivery_type, delivery_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    ref_code,
    customer_name,
    contact_number || null,
    address,
    product || 'N/A',
    status || 'pending',
    delivery_type || 'Outbound',
    delivery_date || null
  ], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to create delivery'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      id: result.insertId,
      ref_code: ref_code
    });
  });
});

// UPDATE delivery
app.put('/deliveries/:id', (req, res) => {
  const { id } = req.params;
  const { customer_name, contact_number, address, product, status, delivery_type, delivery_date } = req.body;

  const query = `UPDATE deliveries SET
    customer_name = ?,
    contact_number = ?,
    address = ?,
    product = ?,
    status = ?,
    delivery_type = ?,
    delivery_date = ?
    WHERE id = ?`;

  db.query(query, [
    customer_name,
    contact_number,
    address,
    product,
    status,
    delivery_type,
    delivery_date,
    id
  ], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update delivery'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery updated successfully'
    });
  });
});

// UPDATE delivery status only (for staff)
app.patch('/deliveries/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['Pending', 'Processing', 'In Transit', 'Delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be: Pending, Processing, In Transit, or Delivered'
    });
  }

  const query = 'UPDATE deliveries SET status = ? WHERE id = ?';

  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update delivery status'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery status updated successfully'
    });
  });
});

// =============================================================================
// API ROUTES - SALES RECORDS
// =============================================================================

// GET all sales
app.get('/sales', (req, res) => {
  const query = 'SELECT * FROM sales ORDER BY sale_date DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sales'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// ADD sales record
app.post('/sales', (req, res) => {
  const { customer_name, product_name, amount, sale_date } = req.body;

  if (!customer_name || !product_name || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Customer name, product name, and amount are required'
    });
  }

  const query = 'INSERT INTO sales (customer_name, product_name, amount, sale_date) VALUES (?, ?, ?, ?)';
  
  db.query(query, [customer_name, product_name, amount, sale_date || new Date()], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to add sales record'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Sales record added successfully',
      id: result.insertId
    });
  });
});

// UPDATE sales record
app.put('/sales/:id', (req, res) => {
  const { id } = req.params;
  const { customer_name, product_name, amount, sale_date } = req.body;

  if (!customer_name || !product_name || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Customer name, product name, and amount are required'
    });
  }

  const query = 'UPDATE sales SET customer_name = ?, product_name = ?, amount = ?, sale_date = ? WHERE id = ?';
  
  db.query(query, [customer_name, product_name, amount, sale_date, id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update sales record'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sales record not found'
      });
    }

    res.json({
      success: true,
      message: 'Sales record updated successfully'
    });
  });
});

// DELETE sales record
app.delete('/sales/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM sales WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete sales record'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sales record not found'
      });
    }

    res.json({
      success: true,
      message: 'Sales record deleted successfully'
    });
  });
});

// Get monthly sales data for charts
app.get('/sales/monthly', (req, res) => {
  const query = `
    SELECT 
      MONTH(sale_date) AS month, 
      YEAR(sale_date) AS year, 
      SUM(amount) AS total
    FROM sales
    GROUP BY YEAR(sale_date), MONTH(sale_date)
    ORDER BY YEAR(sale_date), MONTH(sale_date)
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching monthly sales:', err);
      return res.status(500).json({ error: 'Failed to fetch monthly sales data' });
    }
    res.json(results);
  });
});

// =============================================================================
// API ROUTES - REVIEWS MANAGEMENT
// =============================================================================

// GET all reviews
app.get('/reviews', (req, res) => {
  const query = 'SELECT * FROM reviews ORDER BY review_date DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// ADD review
app.post('/reviews', (req, res) => {
  const { product_name, reviewer_name, rating, review_text, review_date } = req.body;

  if (!product_name || !reviewer_name || !rating || !review_text) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const query = 'INSERT INTO reviews (product_name, reviewer_name, rating, review_text, review_date) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [product_name, reviewer_name, rating, review_text, review_date || new Date()], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to add review'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      id: result.insertId
    });
  });
});

// DELETE review
app.delete('/reviews/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM reviews WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete review'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  });
});
// =============================================================================
// API ROUTES - BUSINESS INFORMATION (for About Page)
// =============================================================================

// GET business information
app.get('/business-info', (req, res) => {
  const query = 'SELECT * FROM business_info WHERE id = 1';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch business info'
      });
    }

    if (results.length === 0) {
      // Return default values if no data exists
      return res.json({
        success: true,
        data: {
          hero_title: 'About ECL FURNITURE MART',
          hero_description: 'We offer complete line of ready made home and office furnitures.',
          story: 'ECL FURNITURE MART has been serving the community for years with quality furniture solutions.',
          policies: 'Our policies ensure customer satisfaction and quality service.',
          mission: 'To provide high-quality, affordable furniture that transforms houses into homes.',
          return_policy: 'We accept returns within 30 days of purchase with original receipt.',
          warranty_policy: 'All furniture comes with a 1-year manufacturer warranty.',
          delivery_policy: 'Free delivery within 50km radius. Additional charges may apply for distant locations.',
          payment_policy: 'We accept cash, credit cards, and online payment methods.'
        }
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// SAVE/UPDATE business information
app.post('/business-info', (req, res) => {
  const { 
    hero_title, 
    hero_description, 
    story, 
    mission, 
    return_policy, 
    warranty_policy, 
    delivery_policy, 
    payment_policy 
  } = req.body;

  // First check if record exists
  const checkQuery = 'SELECT * FROM business_info WHERE id = 1';
  
  db.query(checkQuery, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      // INSERT new record
      const insertQuery = `INSERT INTO business_info 
        (id, hero_title, hero_description, story, mission, return_policy, warranty_policy, delivery_policy, payment_policy) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      db.query(insertQuery, [
        hero_title, hero_description, story, mission, 
        return_policy, warranty_policy, delivery_policy, payment_policy
      ], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to save business info'
          });
        }

        res.json({
          success: true,
          message: 'Business information saved successfully'
        });
      });
    } else {
      // UPDATE existing record
      const updateQuery = `UPDATE business_info SET 
        hero_title = ?, 
        hero_description = ?, 
        story = ?, 
        mission = ?, 
        return_policy = ?, 
        warranty_policy = ?, 
        delivery_policy = ?, 
        payment_policy = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = 1`;
      
      db.query(updateQuery, [
        hero_title, hero_description, story, mission, 
        return_policy, warranty_policy, delivery_policy, payment_policy
      ], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to update business info'
          });
        }

        res.json({
          success: true,
          message: 'Business information updated successfully'
        });
      });
    }
  });
});

// GET contact information
app.get('/contact-info', (req, res) => {
  const query = 'SELECT * FROM contact_info WHERE id = 1';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contact info'
      });
    }

    if (results.length === 0) {
      // Return default values
      return res.json({
        success: true,
        data: {
          phone: '+1 234 567 8900',
          email: 'info@eclfurniture.com',
          address: '123 Furniture Street, City, State 12345',
          business_hours: 'Mon-Sat: 9:00 AM - 6:00 PM'
        }
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// SAVE/UPDATE contact information
app.post('/contact-info', (req, res) => {
  const { phone, email, address, business_hours } = req.body;

  const checkQuery = 'SELECT * FROM contact_info WHERE id = 1';
  
  db.query(checkQuery, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      // INSERT
      const insertQuery = `INSERT INTO contact_info (id, phone, email, address, business_hours) VALUES (1, ?, ?, ?, ?)`;
      
      db.query(insertQuery, [phone, email, address, business_hours], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to save contact info'
          });
        }

        res.json({
          success: true,
          message: 'Contact information saved successfully'
        });
      });
    } else {
      // UPDATE
      const updateQuery = `UPDATE contact_info SET phone = ?, email = ?, address = ?, business_hours = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1`;
      
      db.query(updateQuery, [phone, email, address, business_hours], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to update contact info'
          });
        }

        res.json({
          success: true,
          message: 'Contact information updated successfully'
        });
      });
    }
  });
});
// =============================================================================
// API ROUTES - STAFF ACCOUNT MANAGEMENT
// =============================================================================

// GET all staff accounts (from users table)
app.get('/staff', (req, res) => {
  const query = 'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch staff accounts'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// CREATE staff account (add to users table)
app.post('/staff', (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }

  // Check if email already exists
  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Insert new staff account
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to create staff account'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Staff account created successfully',
        id: result.insertId
      });
    });
  });
});

// DELETE staff account
app.delete('/staff/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete staff account'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Staff account not found'
      });
    }

    res.json({
      success: true,
      message: 'Staff account deleted successfully'
    });
  });
});

// =============================================================================
// START SERVER
// =============================================================================
app.listen(PORT, () => {
  console.log('==============================================');
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('==============================================');
});