const express = require('express');
const path = require('path');
const app = express();
const {
    db,
    init,
    models: {
        Person,
        Place,
        Thing,
        Purchase,
    },
} = require('./db');

init();

app.get('/', async (req, res, next)=>{
    //console.log('hello!');
    //const people = await Person.findAll();
    const [people, places, things] = await Promise.all(
        [Person, Place, Thing].map(table => table.findAll())
    )
    //console.log(Object.values(people));
    const purchases = await Purchase.findAll({
        include: [Person, Place, Thing]
    });
    console.log(purchases);
    res.send(`
        <html>
            <head>
            <style>
                body{
                    display:flex;
                    flex-direction: column;
                    align-items:center;
                }
                form{
                    display:flex;
                    flex-direction: column;
                    align-items:center;
                }
                form > * {
                    margin:5px;
                }
            </style>
            </head>
            <body>
                <h1>People Places and Things</h1>
                <form>

                <select>
                <option>-Person-</option>
                    ${people.map(person=>
                        `<option>
                            ${person.name}
                        </option>
                        `
                 ).join('')}
                </select>
                <select>
                <option>-Place-</option>
                    ${places.map(place=>
                        `<option>
                            ${place.name}
                        </option>
                        `
                 ).join('')}
                </select>
                <select>
                <option>-Thing-</option>
                    ${things.map(thing=>
                        `<option>
                            ${thing.name}
                        </option>
                        `
                 ).join('')}
                </select>
                <input name= 'count' placeholder ='count'/> 
                <input name= 'date' placeholder ='date'/> 
                <button type='submit'>Create Purchase</button>
                </form>
                <ul>
                  ${purchases.map(purchase=> `
                    <li>
                        <p>
                            ${purchase.Person.name} purchased ${purchase.count} ${purchase.Thing.name}
                            in ${purchase.Place.name} on ${purchase.date}
                        <p>
                        <button type ='submit'>x</button> 
                    </li>
                  `).join('')}      
                </ul>
            </body>
        </html>
    `);

});


const port = process.env.PORT || 3000;

app.listen(port, ()=>console.log(`listening on port ${port}`));