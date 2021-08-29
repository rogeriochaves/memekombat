const { promisify } = require('util');
const { getFriends } = require('../struct/Amizades');

app.get('/amizade/approve', authMiddleware, async function (request, response) {
	const user = request.session.auth.user;
	const friendUid = request.param('uid');

    const friends = await getFriends(user.uid);
    const relationship = friends[friendUid] && friends[friendUid].relationship;

    if (!relationship) {
        await promisify(Amizade.updateOne).call(Amizade,
            { from_id: user.uid, to_id: friendUid },
            { status: 'approved' },
            { upsert: true }
        );

        await promisify(Amizade.updateOne).call(Amizade,
            { from_id: friendUid, to_id: user.uid },
            { status: 'pending' },
            { upsert: true }
        );

        response.redirect("/perfil?uid=" + friendUid);
    } else if (relationship == 'friends' || relationship == 'request_sent') {
        response.redirect("/perfil?uid=" + friendUid);
    } else if (relationship == 'request_received' || relationship == 'cancelled') {
        await promisify(Amizade.updateOne).call(Amizade,
            { from_id: user.uid, to_id: friendUid },
            { status: 'approved' },
            { upsert: true }
        );
        response.redirect("/perfil?uid=" + friendUid);
    } else {
        throw "invalid state";
    }
});

app.get('/amizade/cancel', authMiddleware, async function (request, response) {
    const user = request.session.auth.user;
	const friendUid = request.param('uid');

    await promisify(Amizade.updateOne).call(Amizade,
        { from_id: user.uid, to_id: friendUid },
        { status: 'cancelled' },
        { upsert: true }
    );
    response.redirect("/perfil?uid=" + friendUid);
});