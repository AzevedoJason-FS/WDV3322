const saveUser = async (newUser) => {
    console.log('Mocked User')
    return Promise.resolve({
            firstName: "Brad",
            lastName: "Stun",
            address: "road street",
            city: "Houston",
            state: "Texas",
            zip: "30747",
            email: "jasoncees@gmail.com",
            password: "1999"
    })
};

const findUser = async (user) => {
    console.log('Mocked Find')
    return Promise.resolve({
        firstName: "Jason",
        lastName: "Azevedo",
        address: "52 road",
        city: "rome",
        state: "Georgia",
        zip: "30747",
        email: "jasonazeveedo@gmail.com",
        password: "bob"
    })
}

const connect = async() => {
    console.log('Mock Connection')
}

const disconnect = async() => {
    console.log('Mock Disconnection')
}

module.exports = { saveUser, connect, disconnect, findUser };