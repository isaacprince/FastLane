const dbConnection = require('../config/db.js');
let db = dbConnection.db;

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  const messages = await req.flash("info");

  const locals = {
    title: "NodeJs",
    description: "FastLane User Management System",
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    let customers = await db.all(`SELECT * FROM Customers ORDER BY created_at DESC LIMIT ? OFFSET ?`, perPage, perPage * page - perPage);
    let count = await db.run(`SELECT COUNT (*) FROM Customers`);
    const stmt = await db.prepare(`SELECT COUNT (*) FROM Customers`);
    const customer = await stmt.all();

    await stmt.finalize();

    if (typeof customers == 'object') {
      customers = []
    }
    console.log(customers, customer, "Hidrf")

    res.render("index", {
      locals,
      customers,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
  const locals = {
    title: "About",
    description: "FastLane User Management System",
  };

  try {
    res.render("about", locals);
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * New Customer Form
 */
exports.addCustomer = async (req, res) => {
  const locals = {
    title: "Add New Customer - NodeJs",
    description: "FastLane User Management System",
  };

  res.render("customer/add", locals);
};

/**
 * POST /
 * Create New Customer
 */
exports.postCustomer = async (req, res) => {
  console.log(req.body);
  try {
    const stmt = await db.prepare(`INSERT INTO Customers 
      (id, firstName, lastName, details, tel, email, created_at, updated_at)
    VALUES
      ( 
        :id,
        :firstName,
        :lastName, 
        :details,
        :tel,
        :email,
        :created_at, 
        :updated_at
      )
  `);

      stmt.bind({
          ":id": Date.now(),
          ":firstName": req.body.firstName,
          ":lastName": req.body.lastName,
          ":details": req.body.details,
          ":tel": req.body.tel,
          ":email": req.body.email,
          ":created_at": new Date(),
          ":updated_at": new Date(),
      });

      const result = await stmt.run();

      await stmt.finalize();
    await req.flash("info", "New customer has been added.");

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Customer Data
 */
exports.view = async (req, res) => {
  try {
    const stmt = await db.prepare(`SELECT * FROM Customers WHERE id = :id`);

        stmt.bind({ ":id": req.params.id });

        const customer = await stmt.all();

        await stmt.finalize();

    const locals = {
      title: "View Customer Data",
      description: "FastLane User Management System",
    };

    res.render("customer/view", {
      locals,
      customer,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Edit Customer Data
 */
exports.edit = async (req, res) => {
  try {
    const stmt = await db.prepare(`SELECT * FROM Customers WHERE id = :id`);

        stmt.bind({ ":id": req.params.id });

        const customer = await stmt.all();

        await stmt.finalize();

    const locals = {
      title: "Edit Customer Data",
      description: "FastLane User Management System",
    };

    res.render("customer/edit", {
      locals,
      customer,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Update Customer Data
 */
exports.editPost = async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
      updatedAt: Date.now(),
    });
    await db.run('UPDATE Customers SET firstName = ?, lastName = ?, tel = ?, email = ?, details = ?, updated_at = ? WHERE id = ?', 
      req.body.firstName, req.body.lastName, req.body.tel, req.body.email, req.body.details, new Date(), req.params.id, (err) => {
      if (err) {
          console.log(err);
          return;
      }
      console.log(`User updated successfully. User name: ${req.body.firstName}`);
  });
    await res.redirect(`/edit/${req.params.id}`);

    console.log("redirected");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Delete /
 * Delete Customer Data
 */
exports.deleteCustomer = async (req, res) => {
  try {
    
    await db.run('DELETE FROM Customers WHERE id = ?', req.params.id, (err) => {
      if (err) {
          console.log(err);
          return;
      }
      console.log(`User updated successfully. User name: ${req.body.firstName}`);
    })
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get /
 * Search Customer Data
 */
exports.searchCustomers = async (req, res) => {
  const locals = {
    title: "Search Customer Data",
    description: "Free NodeJs User Management System",
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const customers = await Customer.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      customers,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};
