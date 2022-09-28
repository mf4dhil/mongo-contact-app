const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { body, validationResult, check} = require("express-validator");
const methodOverride = require("method-override");

require("./utils/db");
const Contact = require("./model/contact");

const app = express();
const port = 3000;

// setup methode override
app.use(methodOverride("_method"));

//gunakan EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Halaman home
app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Muhammad Fadhil",
      email: "syafwah999@gmail.com",
    },
    {
      nama: "Nadya lorenza",
      email: "nadya03@gmail.com",
    },
  ];

  //res.sendFile('./index.html', {root: __dirname})
  res.render("index", {
    nama: "Muhammad Fadhil",
    tittle: "Ini Adalah Halaman Home",
    mahasiswa: mahasiswa,
    layout: "main-layouts",
  }); //menampilkan viem menggunakan view engine EJS
});

// halaman about
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "main-layouts",
  });
});

// halaman kontak
app.get("/contact", async (req, res) => {
  // Contact.find().then((contact) => {
  // res.send(contact)
  // })

  const contacts = await Contact.find();
  res.render("contact", {
    layout: "main-layouts",
    contacts,
    msg: req.flash("msg"),
  });
});

//halaman form tambah data kontak
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    tittle: "Form tambah data contact",
    layout: "main-layouts",
  });
});

//process tambah data contact
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama contact sudah digunakan");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("nohp", "No HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() })
      res.render("add-contact", {
        title: "Form tambah data contact",
        layout: "main-layouts",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (error, result) => {
        //kirimkan flash message
        req.flash("msg", "Data contact berhasil ditambahkan!");
        res.redirect("/contact");
      });
    }
  }
);

// proses delete contact
// app.get('/contact/delete/:nama',async (req, res) => {
//     const contact = await Contact.findOne({ nama: req.params.nama })
//     console.log(contact)
//     // jika kontak tidak ada
//     if(!contact) {
//         res.status(404);
//         res.send('<h1>KONTAK TIDAK DITEMUKAN</h1>')
//     } else {
//         Contact.deleteOne({ _id : contact._id }).then((result) => {
//             req.flash('msg', 'Data contact berhasil dihapus!')
//             res.redirect('/contact')
//             console.log(result)
//         })
//     }
// })

app.delete("/contact",async (req, res) => {
Contact.deleteOne({ nama : req.body.nama }).then((result) => {
  req.flash("msg", "Data contact berhasil dihapus!");
  res.redirect("/contact");
  console.log(result)
});
  // res.send(req.body)
});


// halaman form ubah data kontak
app.get('/contact/edit/:nama',async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama })
  res.render('edit-contact', {
      tittle: 'Form ubah data contact',
      layout: 'main-layouts',
      contact,
  })
})

// proses ubah data kontak
app.put('/contact', 
  [
    body('nama').custom(async(value, { req }) => {
        const duplikat = await Contact.findOne({ nama: value })
        console.log(value)
        console.log(req.body.oldNama)
        if(value !== req.body.oldNama && duplikat){
          throw new Error('Nama contact sudah digunakan!')
        }
        return true
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('nohp', 'No HP tidak valid').isMobilePhone('id-ID')
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
      res.render('edit-contact', {
          title: 'Form ubah data contact',
          layout: 'main-layouts',
          errors: errors.array(),
          contact: req.body,
      })
  }else{
    const id = req.body._id
    // res.send(id)
    // console.log(id) 
    // console.log(req.body) 
    Contact.updateOne(
      { _id: id},
      {
        $set: {
          nama: req.body.nama,
          email: req.body.email,
          nohp: req.body.nohp,
        }
      }).then((result) => {
        req.flash('msg', 'Data contact berhasil diubah!')
        res.redirect('/contact')
      })
  }
})

//halaman detail kontak
app.get("/contact/:nama", async (req, res) => {
  // const contacts = findContact(req.params.nama)
  const contacts = await Contact.findOne({ nama: req.params.nama });
  res.render("detail", {
    layout: "main-layouts",
    contacts,
  });
});

app.listen(port, () => {
  console.log(`Mongo contact app | listening at http://localhost:${port}`);
});
