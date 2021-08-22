const { promisify } = require('util');
const { getFriends } = require('../struct/Amizades');

app.get('/amizade/approve', authMiddleware, async function (request, response) {
	const user = request.session.auth.user;
	const friendId = request.param('uid');

    const friends = await getFriends(user.id);
    const friendship = friends[friendId];
    console.log('friends', friends);
    console.log('user', user);
    console.log('friendId', friendId);

    if (!friendship) {
        console.log("here1");
        const amizadeFrom = new Amizade({
            from_id: user.id,
            to_id: friendId,
            status: 'approved',
        });
        await promisify(amizadeFrom.save).call(amizadeFrom);

        console.log("here2");
        const amizadeTo = new Amizade({
            from_id: friendId,
            to_id: user.id,
            status: 'pending',
        });
        await promisify(amizadeTo.save).call(amizadeTo);
        console.log("here3");

        response.redirect("/perfil?uid=" + friendId);
    } else if (friendship.relationship == 'friends' || friendship.relationship == 'request_sent') {
        response.redirect("/perfil?uid=" + friendId);
    } else if (friendship.relationship == 'request_received' || friendship.relationship == 'cancelled') {
        // TODO: broken?
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
        { from_id: friendId, to_id: user.id },
        { status: 'cancelled' },
        { upsert: true }
    );
    response.redirect("/perfil?uid=" + friendId);
});