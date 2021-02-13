const { userInfo } = require("os");
const { Sequelize, DataTypes, Model } = require("sequelize");
const db = new Sequelize("postgres://localhost/acme_personplacething", {
    logging: false,
});

class Person extends Model {}
class Place extends Model {}
class Thing extends Model {}
class Purchase extends Model {}

Person.init(
    {
        name: {
            type: DataTypes.STRING,
        },
    },
    { timestamps: false, sequelize: db, modelName: "People" },
);

Place.init(
    {
        name: {
            type: DataTypes.STRING,
        },
    },
    { timestamps: false, sequelize: db, modelName: "Place" },
);

Thing.init(
    {
        name: {
            type: DataTypes.STRING,
        },
    },
    { timestamps: false, sequelize: db, modelName: "Things" },
);

Purchase.init(
    {
        count: {
            type: DataTypes.INTEGER,
        },
        date: {
            type: DataTypes.DATE,
        },
    },
    { timestamps: false, sequelize: db, modelName: "Purchase" },
);

Purchase.belongsTo(Thing);
Thing.hasMany(Purchase);

Purchase.belongsTo(Person);
Person.hasMany(Purchase);

Purchase.belongsTo(Place);
Place.hasOne(Purchase);

const syncAndSeed = async () => {
    const [moe, lucy, larry] = await Promise.all(
        ["lucy", "moe", "larry"].map((name) => Person.create({ name: name })),
    );
    const [nyc, chicago, la, dallas] = await Promise.all(
        ["New York City", "Chicago", "Los Angeles", "Dallas"].map((name) =>
            Place.create({ name: name }),
        ),
    );
    const [foo, bar, baz, quq] = await Promise.all(
        ["foo", "bar", "baz", "quq"].map((name) =>
            Thing.create({ name: name }),
        ),
    );
    const purchase1 = await Purchase.create({
        count: 4,
        date: "2/13/2021",
        ThingId: 1,
        PersonId: 1,
        PlaceId: 1,
    });
};

const init = async () => {
    try {
        await db.sync({ force: true });
        console.log("Connected to Database");
        syncAndSeed();
    } catch (err) {
        console.log(err);
    }
};

init();

module.exports = {
    db,
    syncAndSeed,
    models: {
        Person,
        Place,
        Thing,
    },
};
