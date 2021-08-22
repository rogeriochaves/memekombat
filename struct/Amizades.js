// const promisify = (fn) => (...params) => {
//     return new Promise((resolve, reject) => {
//         console.log('params', params);
//         fn.apply(Amizade, [...params, (err, result) => {
//             if (err) return reject(err);
//             return resolve(result);
//         }]);
//     });
// }
const { promisify } = require('util');

module.exports.getFriends = async function (uid) {
    let selfStatus = {};
    let friendsStatus = {};
    let result = {};

    const amizadesFrom = await (promisify(Amizade.find).call(Amizade, { from_id: uid }));
    for (let amizade of amizadesFrom) {
        selfStatus[amizade.to_id] = amizade.status;
    }

    const amizadesTo = await promisify(Amizade.find).call(Amizade, { to_id: uid });
    for (let amizade of amizadesTo) {
        friendsStatus[amizade.from_id] = amizade.status;
    }

    for (let friendId of Object.keys(selfStatus)) {
        const self = selfStatus[friendId];
        const friend = friendsStatus[friendId];

        let relationship;
        if (self == 'approved' && friend == 'approved') {
            relationship = 'friends';
        }
        if (self == 'pending' && friend != 'cancelled') {
            relationship = 'request_received';
        }
        if (self != 'cancelled' && friend == 'pending') {
            relationship = 'request_sent';
        }
        if (self == 'cancelled' || friend == 'cancelled') {
            relationship = 'cancelled';
        }

        result[friendId] = relationship;
    }

    return result;
}