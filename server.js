const {Client} = require('pg');
const express = require('express');
const app = express();
app.use(express.json());

const client = new Client({
    user: "postgres",
    password: '20000529Lu',
    host: 'localhost',
    port: 5432,
    database: "petbnb_database"
})

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`));
app.get("/pet", async (req, res) => {
    const listOfPets = await findPets();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(listOfPets));
})

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`));
app.get("/booking", async (req, res) => {
    const bookings = await getBookings();
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(bookings));
})

app.put("/promoCode", async (req, res) => {
    const reqJSON = req.body;
    const promoCodeValue = await getPromoCodes(reqJSON.value);
    res.setHeader('content-type', 'application/json');
    res.send(JSON.stringify(promoCodeValue));
})

app.delete("/pet", async (req, res) => {
    try {
        const reqJSON = req.body;
        await deletePet(reqJSON.id);
        result.success = true;
    } catch (e) {
        result.success=false;
    }
})

app.post("/pet", async (req, res) => {
    let result = {};
    try {
        const reqJSON = req.body;
        await createPet(reqJSON.pet);
        result.success = true;
    } catch (e) {
        result.success=false;
    }
    finally {
        res.setHeader('content-type', 'application/json');
        res.send(JSON.stringify(result));
    }
})

app.put("/pet", async (req, res) => {
    let result = {};
    try {
        const reqJSON = req.body;
        await updatePetInfo(reqJSON.id);
        result.success = true;
    } catch (e) {
        result.success = false;
    } finally {
        res.send(JSON.stringify(result));
    }
})

app.listen(8080, () => console.log("Web server is listening .. on port 8080"))

start()
async function start() {
    await connect();
}

async function findPets() {
    try {
        const results = await client.query("select * from pet")
        return results.rows;
    }
    catch (e) {
        return [];
    }
}

async function updatePetInfo(updatedInfo) {
    // Updated info array with ID: new value
    try {
        let s = "SET ";
        // s = s + "pet_id = " + updatedInfo[0] + ", ";
        s = s + "name = '" + updatedInfo[1] + "', ";
        s = s + '"careInstructions"' + "= '" + updatedInfo[2] + "', ";
        s = s + '"dietInstructions"' + "= '" + updatedInfo[3] + "', ";
        s = s + "age = " + updatedInfo[4] + ", ";
        s = s + "breed = '" + updatedInfo[5] + "', ";
        s = s + "weight = " + updatedInfo[6] + ", ";
        s = s + "user_id = " + updatedInfo[7] + " ";

        s = "UPDATE pet " + s + "WHERE pet_id = " + updatedInfo[0];

        await client.query(s, (err,res) => {
            console.log(err,res);
            return true;
        });

    } catch (e) {
        return false;

    }
}

async function getPromoCodes(promoCodeValue) {

    try {
        let s = "WHERE "
        if (promoCodeValue[0] === "value") {
            s = s + "value >= " + parseInt(promoCodeValue[1]);
        } else {
            s = s + "expires <= " + promoCodeValue[1];
        }
        const results = await client.query("SELECT promocodestring, value, expires from promocode " + s);
        return results.rows;
    }
    catch (e) {
        return [];
    }
}


async function getBookings() {
    try {

        const results = await client.query("SELECT BO.booking_id, BO.datebooked, B.pricepernight, BO.duration, B.user_id FROM booking BO, petboarding B WHERE BO.service_id = B.service_id ")
        return results.rows;
    }
    catch (e) {
        return [];
    }
}

async function createPet(pet) {
    try {
        await client.query("INSERT INTO pet values ($1, $2, $3, $4 ,$5, $6 ,$7, $8)",
            [pet['pet_id'], pet.name ,pet.careInstructions , pet.dietInstructions , pet.age, pet.breed, pet.weight,
            pet['user_id']]);
        return true;
    }
    catch (e) {
        return false;
    }
}

async function deletePet(pet_id) {
    try {
        await client.query("DELETE FROM pet where pet_id = $1", [pet_id])
        return true;
    } 
    catch (e) {
        return false;
    }
}


async function connect() {
    try {
        await client.connect();
    } catch (e) {
        console.error('Failed to connect ${e}')
    }
}