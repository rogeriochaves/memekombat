const { promisify } = require('util');
const { getFriends } = require('../struct/Amizades');

app.get('/amizade/approve', authMiddleware, async function (request, response) {
	const user = request.session.auth.user;
	const friendId = request.param('uid');

    const friends = await getFriends(user.id);
    const relationship = friends[friendId] && friends[friendId].relationship;

    if (!relationship) {
        await promisify(Amizade.update).call(Amizade,
            { from_id: user.id, to_id: friendId },
            { status: 'approved' },
            { upsert: true }
        );

        await promisify(Amizade.update).call(Amizade,
            { from_id: friendId, to_id: user.id },
            { status: 'pending' },
            { upsert: true }
        );

        response.redirect("/perfil?uid=" + friendId);
    } else if (relationship == 'friends' || relationship == 'request_sent') {
        response.redirect("/perfil?uid=" + friendId);
    } else if (relationship == 'request_received' || relationship == 'cancelled') {
        await promisify(Amizade.update).call(Amizade,
            { from_id: user.id, to_id: friendId },
            { status: 'approved' },
            { upsert: true }
        );
        response.redirect("/perfil?uid=" + friendId);
    } else {
        throw "invalid state";
    }
});

app.get('/amizade/cancel', authMiddleware, async function (request, response) {
    const user = request.session.auth.user;
	const friendId = request.param('uid');

    await promisify(Amizade.update).call(Amizade,
        { from_id: user.id, to_id: friendId },
        { status: 'cancelled' },
        { upsert: true }
    );
    response.redirect("/perfil?uid=" + friendId);
});