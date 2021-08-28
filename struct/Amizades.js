const { promisify } = require('util');

module.exports.getFriends = async function (uid) {
    let selfStatus = {};
    let friendsStatus = {};
    let relationships = {};

    const amizadesFrom = await (promisify(Amizade.find).call(Amizade, { from_id: uid }));
    for (let amizade of amizadesFrom) {
        selfStatus[amizade.to_id] = amizade.status;
    }

    const amizadesTo = await promisify(Amizade.find).call(Amizade, { to_id: uid });
    for (let amizade of amizadesTo) {
        friendsStatus[amizade.from_id] = amizade.status;
    }

    for (const friendUid of Object.keys(selfStatus)) {
        const self = selfStatus[friendUid];
        const friend = friendsStatus[friendUid];

        let relationship;
        if (self == 'approved' && friend == 'approved') {
            relationship = 'friends';
        }
        if (self == 'pending' && friend != 'cancelled') {
            relationship = 'request_received';
        }
        if (self == 'cancelled' || friend == 'cancelled') {
            relationship = 'cancelled';
        }
        if (self == 'approved' && friend != 'approved') {
            relationship = 'request_sent';
        }

        relationships[friendUid] = relationship;
    }

    const query = Personagem
        .where('uid').in(Object.keys(relationships))
        .select('uid avatar nome')
    const personagens = await promisify(query.exec).call(query);

    let result = {};
    for (const personagem of personagens) {
        personagem.relationship = relationships[personagem.uid];
        result[personagem.uid] = {
            uid: personagem.uid,
            relationship: relationships[personagem.uid],
            avatar: personagem.avatar,
            nome: personagem.nome
        };
    }

    return result;
}