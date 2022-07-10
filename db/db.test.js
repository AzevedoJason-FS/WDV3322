const mongoose = require('mongoose');
const User = require('../api/model/user');
const { connect, disconnect, saveUser, findUser } = require('./db')

jest.mock('./db')

beforeEach(async () => {
    await connect();
})

describe("Db Test", () => {

    test("Save user to mongoDB", async() => {
        const newUser = new User({
            _id: mongoose.Types.ObjectId(),
            firstName: "Jason",
            lastName: "Azevedo",
            address: "52 road",
            city: "rome",
            state: "Georgia",
            zip: "30747",
            email: "jasoncees@gmail.com",
            password: "bob"
        })
        const user = await saveUser(newUser);
        expect(user.firstName).toEqual("Brad");
        expect(user).toEqual(expect.objectContaining({email: expect.any(String)}));
        expect(user.email).not.toBe(''); 
        expect(user.lastName).toEqual('Stun')
    });

    test("Find User ", async() => {
        const user = await findUser({email:"jasonazeveedo@gmail.com"})
        expect(user.email).toEqual('jasonazeveedo@gmail.com')
        expect(user.firstName).toEqual('Jason')
        expect(user.lastName).toEqual('Azevedo')
        expect(user.state).toEqual('Georgia')
    });
    
});

afterEach((async () => {
    await disconnect();
}))