var finished = 0;
var total = 0;
var done = function(){
	finished++;
	if(finished == total){
		console.log("Finalizado!");
		mongoose.disconnect();
	}
}

require.paths.unshift(__dirname + '/lib');

global.mongoose = require('mongoose')
global.Schema = mongoose.Schema
global.ObjectId = Schema.ObjectId;
if(process.env.NODE_ENV){
	mongoose.connect(process.env.MONGOLAB_URI);
}else{
	mongoose.connect('mongodb://localhost/memekombat');
}

require('./schema.js');

e = [
	{num: 1, nome: 'Taco', atq: 3, def: 1, vel: 0, crit: 2, nivel_minimo: 4},
	{num: 2, nome: 'Faca', atq: 2, def: 1, vel: 5, crit: 2, nivel_minimo: 4},
	{num: 3, nome: 'Soco Inglês', atq: 8, def: 2, vel: 5, crit: 1, nivel_minimo: 5},
	{num: 4, nome: 'Patinha', atq: 1, def: 0, vel: 0, crit: 0, nivel_minimo: 1},
	{num: 5, nome: 'Marreta', atq: 10, def: 3, vel: 1, crit: 3, nivel_minimo: 8},
	{num: 6, nome: 'Marreta do Chapolim', atq: 6, def: 3, vel: 5, crit: 4, nivel_minimo: 8},
	{num: 7, nome: 'Catapulta', atq: 13, def: 3, vel: 2, crit: 5, nivel_minimo: 10},
	{num: 8, nome: 'Serra Elétrica', atq: 10, def: 4, vel: 3, crit: 5, nivel_minimo: 10},
	{num: 9, nome: 'Mace', atq: 15, def: 5, vel: 2, crit: 8, nivel_minimo: 13},
	{num: 10, nome: 'Espada', atq: 15, def: 5, vel: 10, crit: 5, nivel_minimo: 15},
	{num: 11, nome: 'Ferramenta', atq: 20, def: 8, vel: 0, crit: 8, nivel_minimo: 11},
	{num: 12, nome: 'Coxa', atq: 2, def: 0, vel: 0, crit: 5, nivel_minimo: 1},
	{num: 13, nome: 'Espada de Fogo', atq: 25, def: 5, vel: 10, crit: 10, nivel_minimo: 150, preco_creditos: 10},
	{num: 14, nome: 'Bacon', atq: 3, def: 0, vel: 0, crit: 5, nivel_minimo: 1},
	{num: 15, nome: 'Doce', atq: 1, def: 0, vel: 0, crit: 0, nivel_minimo: 1},
	{num: 16, nome: 'Foice', atq: 10, def: 10, vel: 0, crit: 5, nivel_minimo: 10},
	{num: 17, nome: 'Espada 2', atq: 15, def: 8, vel: 0, crit: 1, nivel_minimo: 12},
	{num: 18, nome: 'Ice Sword', atq: 25, def: 5, vel: 10, crit: 10, nivel_minimo: 150, preco_creditos: 10},
	{num: 19, nome: 'Thunder Sword', atq: 25, def: 5, vel: 10, crit: 10, nivel_minimo: 150, preco_creditos: 10},
	{num: 20, nome: 'Ogre Axe', atq: 20, def: 7, vel: 2, crit: 10, nivel_minimo: 15},
	{num: 21, nome: 'Lolipop', atq: 10, def: 5, vel: 10, crit: 6, nivel_minimo: 10},
	{num: 22, nome: 'Flame Sword', atq: 18, def: 7, vel: 12, crit: 8, nivel_minimo: 17},
	{num: 23, nome: 'Steel Dagger', atq: 15, def: 13, vel: 20, crit: 7, nivel_minimo: 19},
	{num: 24, nome: 'Fly Sword', atq: 20, def: 10, vel: 10, crit: 10, nivel_minimo: 20},
	{num: 25, nome: 'Double Axe', atq: 25, def: 9, vel: 4, crit: 10, nivel_minimo: 21},
	{num: 26, nome: 'Arabian Dagger', atq: 20, def: 16, vel: 25, crit: 10, nivel_minimo: 23},
	{num: 27, nome: 'Poseidon Trident', atq: 15, def: 20, vel: 30, crit: 5, nivel_minimo: 25},
	{num: 28, nome: 'Egg Staff', atq: 20, def: 30, vel: 20, crit: 15, nivel_minimo: 26},
	{num: 29, nome: 'Devil Mace', atq: 30, def: 15, vel: 10, crit: 20, nivel_minimo: 28},
	{num: 30, nome: 'Talisma Axe', atq: 35, def: 10, vel: 10, crit: 30, nivel_minimo: 30},
	{num: 31, nome: 'Dragon Sword', atq: 35, def: 15, vel: 10, crit: 10, nivel_minimo: 150, preco_creditos: 20},
	{num: 32, nome: 'Angel Sword', atq: 32, def: 13, vel: 12, crit: 11, nivel_minimo: 32 },
	{num: 33, nome: 'Darkness Sword', atq: 35, def: 20, vel: 13, crit: 5 , nivel_minimo: 150, preco_creditos: 15},
	{num: 34, nome: 'Devil Sword', atq: 33, def: 15, vel: 10, crit: 15, nivel_minimo: 34 },
	{num: 35, nome: 'Hell Axe', atq: 35, def: 20, vel: 10, crit: 15, nivel_minimo: 36 },
	{num: 36, nome: 'Knight Sword', atq: 35, def: 20, vel: 20, crit: 20, nivel_minimo: 150, preco_creditos: 20},
	{num: 37, nome: 'Steel Axe', atq: 37, def: 20, vel: 10, crit: 5 , nivel_minimo: 38 },
	{num: 38, nome: 'Wing Axe', atq: 40, def: 20, vel: 15, crit: 10, nivel_minimo: 40 },
	{num: 39, nome: 'Fireman Axe', atq: 10, def: 3 , vel: 3 , crit: 5 , nivel_minimo: 9  },
	{num: 40, nome: 'Magic Wand', atq: 2 , def: 0 , vel: 0 , crit: 20, nivel_minimo: 5  },
	{num: 41, nome: 'Plank', atq: 9 , def: 1 , vel: 2 , crit: 4 , nivel_minimo: 7  },
	{num: 42, nome: 'Extintor de Incendio', atq: 15, def: 10, vel: 1 , crit: 1 , nivel_minimo: 15 },
	{num: 43, nome: 'Pé de Cabra', atq: 15, def: 1 , vel: 10, crit: 1 , nivel_minimo: 12 }
];

h = [
	{num: 1, nome: 'Nyan Cat', dano: 15},
	{num: 2, nome: 'Pedobear', dano: 25},
	{num: 3, nome: 'Domo Kun', dano: 20},
	{num: 4, nome: 'Over 9000', dano: 30},
];

a = [
	{num: 1, titulo: 'Primeira Vitória', descricao: 'Consiga sua primeira vitória', titulo_en: 'First Win', descricao_en: 'Have your first win', pontos: 1, img: 'courage-wolf.jpg', texto_cima: 'PRIMEIRA VITÓRIA', texto_baixo: 'QUE VENHAM MAIS DE 8000', texto_cima_en: 'FIRST VICTORY', texto_baixo_en: 'HERE COMES OVER 9000 MORE', url: 'first_win'},
	{num: 2, titulo: 'Vencedor Like a Boss!', descricao: 'Vença 100 lutas', titulo_en: 'Winner Like a Boss', descricao_en: 'Win 100 battles', pontos: 50, img: 'chuck-norris.jpg', texto_cima: 'INSÍGNIA DE CHUCK NORRIS', texto_baixo: 'CHUCK NORRIS VENCE O JOGO', texto_cima_en: 'CHUCK NORRIS BADGE', texto_baixo_en: 'CHUCK NORRIS WINS THE GAME', url: 'winner_like_a_boss'},
	{num: 3, titulo: 'Cinco Derrotas Consecutivas', descricao: 'Perca 5 vezes consecutivas', titulo_en: 'Five Defeats in a row', descricao_en: 'Lose 5 times in row', pontos: 5, img: 'depression-dog.jpg', texto_cima: 'CINCO DERROTAS CONSECUTIVAS', texto_baixo: 'EU SOU UM COMPLETO FRACASSO', texto_cima_en: 'FIVE DEFEATS IN A ROW', texto_baixo_en: 'I AM A TOTAL FAILURE', url: 'lose_5_row'},
	{num: 4, titulo: 'Cinco Vitórias Consecutivas', descricao: 'Ganhe 5 vezes consecutivas', titulo_en: 'Five Wins in row', descricao_en: 'Win 5 times in row', pontos: 8, img: 'success-kid.jpg', texto_cima: 'CINCO VITÓRIAS CONSECUTIVAS', texto_baixo: 'MISSÃO CUMPRIDA', texto_cima_en: 'FIVE WINS IN A ROW', texto_baixo_en: 'MISSION ACCOMPLISHED', url: 'win_5_row'},
	{num: 5, titulo: 'Meme Campeão', descricao: 'Chegue a primeira colocação no Ranking Geral', titulo_en: 'Champion Meme', descricao_en: 'Achieve the first position in the Worldwide Ranking', pontos: 100, img: 'impossibru.jpg', texto_cima: 'PRIMEIRO DO RANKING', texto_baixo: 'IMPOSSIBRU', texto_cima_en: 'FIRST RANK', texto_baixo_en: 'IMPOSSIBRU', url: 'first_rank'},
];

r = [
	{pos: 1, nome: 'Pintinho', nome_en: 'Little Chicken'},
	{pos: 2, nome: 'Coxa de Galinha', nome_en: 'Chicken Drumstrick'},
	{pos: 3, nome: 'Coxa de Galinha Dupla', nome_en: 'Double Chicken Drumstrick'},
	{pos: 4, nome: 'Coxa de Galinha Tripla', nome_en: 'Triple Chicken Drumstrick'},
	{pos: 5, nome: 'Coxa de Galinha de Ouro', nome_en: 'Golden Chicken Drumstrick'},
	{pos: 6, nome: 'Coxa de Galinha de Ouro Dupla', nome_en: 'Double Golden Chicken Drumstrick'},
	{pos: 7, nome: 'Coxa de Galinha de Outro Tripla', nome_en: 'Triple Golden Chicken Drumstrick'},
	{pos: 8, nome: 'Grande Mestre Frango', nome_en: 'Master Chicken Lord'}
];

total = e.length + h.length + a.length + r.length;

for(var i = e.length; i--;){
	(new Equipamento(e[i])).save(function(err){
		done();
	});
}

for(var i = h.length; i--;){
	(new Habilidade(h[i])).save(function(err){
		done();
	});
}

for(var i = a.length; i--;){
	(new Arquivamento(a[i])).save(function(err){
		done();
	});
}

for(var i = r.length; i--;){
	(new Ranking(r[i])).save(function(err){
		done();
	});
}