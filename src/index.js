const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcryptjs');

const app = express();

// Convertir datos a formato JSON
app.use(express.json());

// Archivos estáticos
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "../public")));

// Middleware para analizar datos codificados en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: false }));

// Configurar la carpeta de vistas y el motor de vistas
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Ruta para la página de inicio de sesión (login)
app.get("/", (req, res) => {
    res.render("login");
});

// Ruta para la página de registro (signup)
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Registrar nuevo usuario
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Verificar si el nombre de usuario ya existe
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash la contraseña usando bcrypt
        const saltRounds = 10; // Número de rondas de sal para bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Reemplazar la contraseña original por la cifrada

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.send("Registration successful! You can now <a href='/'>log in</a>.");
    }
});

// Ruta para la página de inicio después de iniciar sesión (home)
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        
        if (!check) {
            return res.status(400).send("Username not found"); // Respuesta con estado 400 para "Bad Request"
        }
        
        // Comparar la contraseña cifrada de la base de datos con la contraseña proporcionada
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        
        if (!isPasswordMatch) {
            return res.status(400).send("Wrong password"); // Respuesta con estado 400 para "Bad Request"
        }
        
        // Si la autenticación es exitosa, renderizar la página de inicio
        res.render("home");
    } 
    catch (error) {
        console.error("Error during login:", error); // Registrar el error en la consola para depuración
        res.status(500).send("An error occurred while trying to log in. Please try again later."); // Enviar un código de estado 500 para "Internal Server Error"
    }
});

// Define el puerto para la aplicación
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
