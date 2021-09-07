var firebase = require("firebase-admin");
var crypto = require("crypto");
const { promisify } = require('util');

app.get('/delete-account', authMiddleware, function (request, response) {
    var user = request.session.auth.user;

    response.render('delete.ejs', {
        layout:   false,
        user:     user,
        portugues: (user.locale && user.locale.indexOf('pt') >= 0)
    });
});

app.post('/delete-account', authMiddleware, async function (request, response) {
    try {
        var user = request.session.auth.user;

        const gravatarHash = crypto.createHash('md5').update("deleted@deleted.com").digest("hex");
        const picture = "https://www.gravatar.com/avatar/" + gravatarHash + "?s=200&d=retro";

        const amizades = Amizade.find({ $or: [{ from_id: user.uid }, { to_id: user.uid }] });
        await promisify(amizades.remove).call(amizades);

        const personagem = promisify(Personagem.findOne).call(Personagem, { uid: user.uid });
        const notificacoes = Notificacao.find({ $or: [{ personagem_id: personagem._id }, { personagem2_id: personagem._id }] });
        await promisify(notificacoes.remove).call(notificacoes);

        await promisify(Personagem.updateOne).call(Personagem,
            { uid: user.uid },
            { deleted: true, nome: "[deleted]", avatar: picture },
        );
        await firebase.auth().deleteUser(user.uid);

        response.clearCookie('session');
        response.clearCookie('providerToken');

        response.end("ok");
    } catch (e) {
        response.status(500);
        response.end(e.toString());
        throw e;
    }
});