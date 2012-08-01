fps = 25;
tempo_corrida = 650;
init_x_p1 = 130;
init_x_p2 = 570;
block = "Block";
miss = "Fail";

// [x, y, frames, (speed), (altura, largura)]

sprites = {
	'default':{
		width: 800,
		size: [79, 79],
		spacing: 1,
		speed: 100,
		parado: [0, 0, 4],
		andando: [80 * 4, 0, 4],
		correndo: [0, 80 * 2, 3],
		soco1: [0, 80, 2],
		soco2: [80 * 2, 80, 2],
		chute1: [80 * 4, 80, 2],
		chute2: [80 * 6, 80, 2],
		arma1: [80 * 6, 80 * 6, 4, 50],
		caindo: [0, 80 * 4, 4],
		caido: [80 * 4, 80 * 4, 1],
		tomando: [80 * 6, 80 * 4, 3],
		esquivando: [0, 80 * 6, 3],
		defendendo: [80 * 6, 80 * 5, 2],
		pegando_arma: [0, 80 * 5, 1],
		levantando:[80 * 6, 80 * 3, 1],
		ganhando: [80 * 8, 0, 1]
	}, demente:{
		image: 'demente.png',
		'default': true
	}, rage:{
		image: 'rage.png',
		'default': true
	}, troll:{
		image: 'troll.png',
		'default': true
	}, pokerface:{
		image: 'pokerface.png',
		'default': true
	}, 'forever_alone':{
		image: 'forever_alone.png',
		'default': true
	}, megusta:{
		image: 'megusta.png',
		'default': true
	}, serious:{
	 	image: 'serious.png',
	 	'default': true
	}, challenge:{
	 	image: 'challenge.png',
	 	'default': true
	 }, yuno:{
	 	image: 'yuno.png',
	 	'default': true
	 }, fuckyea:{
	 	image: 'fuckyea.png',
	 	'default': true
	 }, fap:{
	 	image: 'fap.png',
	 	'default': true
	 }, lol:{
	 	image: 'lol.png',
	 	'default': true
	 }, cereal_guy:{
	 	image: 'cereal_guy.png',
	 	'default': true
	}, okay:{
		image: 'okay.png',
		'default':true
	}, fodase:{
		image: 'fodase.png',
		'default':true
	 }, fap_derpina:{
	 	image: 'fap_derpina.png',
	 	'default': true
	 }, challenge_derpina:{
		image: 'challenge_derpina.png',
		'default': true
	 }, forever_alone_derpina:{
		image: 'forever_alone_derpina.png',
		'default': true
	 }, fuckyea_derpina:{
		image: 'fuckyea_derpina.png',
		'default': true
	 }, rage_derpina:{
		image: 'rage_derpina.png',
		'default': true
	 }, megusta_derpina:{
		image: 'megusta_derpina.png',
		'default': true
	 }, pokerface_derpina:{
		image: 'pokerface_derpina.png',
		'default': true
	 }, serious_derpina:{
		image: 'serious_derpina.png',
		'default': true
	 }, troll_derpina:{
		image: 'troll_derpina.png',
		'default': true
	 }, demente_derpina:{
		image: 'demente_derpina.png',
		'default': true
	 }, lol_derpina:{
	 	image: 'lol_derpina.png',
	 	'default': true
	 }, cereal_guy_derpina:{
	 	image: 'cereal_guy_derpina.png',
	 	'default': true
	}, okay_derpina:{
		image: 'okay_derpina.png',
		'default':true
	}, fodase_derpina:{
		image: 'fodase_derpina.png',
		'default':true
	 }, yuno_derpina:{
		image: 'yuno_derpina.png',
		'default':true
	 }
}

// [x, y, frames, (speed), (altura, largura)]
armas = {
	'default':{
		tipo: 1,
		distancia: false,
		width: 320,
		size: [79, 79],
		spacing: 1,
		speed: 100,
		parado: [0, 0, 4],
		batendo: [0, 80, 4, 50],
		correndo: [0, 80 * 2, 3],
		esquivando: [0, 80 * 3, 3],
		pegando: [80 * 3, 80 * 3, 1],
		defendendo: [0, 80 * 4, 2],
		tomando: [0, 80 * 5, 3],
		caido: [80 * 3, 80 * 5, 1],
		caindo: [0, 80 * 3, 5],
		soltando: [0, 80 * 6, 2]
	}, taco:{
		image: 'taco.png',
		'default': true
	}, faca:{
		image: 'faca.png',
		tipo: 0,
		distancia: false,
		'default': false,
		sound: 'faca',
		width: 320,
		size: [79, 79],
		spacing: 1,
		speed: 100,
		parado: [0, 0, 4],
		batendo: [0, 80, 2],
		correndo: [0, 80 * 2, 3],
		esquivando: [0, 80 * 3, 3],
		pegando: [80 * 3, 80 * 3, 1],
		defendendo: [0, 80 * 4, 2],
		tomando: [0, 80 * 5, 3],
		caido: [80 * 3, 80 * 5, 1],
		soltando: [0, 80 * 6, 2]
	}, soco_ingles:{
		image: 'soco_ingles.png',
		tipo: 0,
		distancia: false,
		'default': false,
		sound: 'hit2',
		width: 320,
		size: [79, 79],
		spacing: 1,
		speed: 100,
		parado: [0, 0, 4],
		batendo: [0, 80, 2],
		correndo: [0, 80 * 2, 3],
		esquivando: [0, 80 * 3, 3],
		pegando: [80 * 3, 80 * 3, 1],
		defendendo: [0, 80 * 4, 2],
		tomando: [0, 80 * 5, 3],
		caido: [80 * 3, 80 * 5, 1],
		soltando: [0, 80 * 6, 2]
	}, patinha:{
		image: 'patinha.png',
		tipo: 0,
		distancia: false,
		'default': false,
		sound: 'hit2',
		width: 320,
		size: [79, 79],
		spacing: 1,
		speed: 100,
		parado: [0, 0, 4],
		batendo: [0, 80, 2],
		correndo: [0, 80 * 2, 3],
		esquivando: [0, 80 * 3, 3],
		pegando: [80 * 3, 80 * 3, 1],
		defendendo: [0, 80 * 4, 2],
		tomando: [0, 80 * 5, 3],
		caido: [80 * 3, 80 * 5, 1],
		soltando: [0, 80 * 6, 2]
	}, marreta:{
		image: 'marreta.png',
		'default': true,
		sound: 'hit3'
	}, marreta_chapolim:{
		image: 'marreta_chapolim.png',
		'default': true,
		sound: 'borracha'
	}, catapulta:{
		image: 'catapulta.png',
		'default': false,
		sound: 'pedra,catapulta',
		programado: true,
		delay: 1800,
		x_plus: -50,
		y_plus: 10,
		tipo: 0,
		distancia: true,
		width: 320,
		size: [79, 79],
		spacing: 1,
		speed: 100,
		parado: [0, 0, 4],
		batendo: [0, 80, 4],
		correndo: [0, 80 * 2, 3],
		esquivando: [0, 80 * 3, 3],
		pegando: [80 * 3, 80 * 3, 1],
		defendendo: [0, 80 * 4, 2],
		tomando: [0, 80 * 5, 3],
		caido: [80 * 3, 80 * 5, 1],
		caindo: [0, 80 * 3, 5],
		soltando: [0, 80 * 6, 2]
	}, serra_eletrica:{
		image: 'serra_eletrica.gif',
		'default': true,
		sound: 'serra'
	}, mace:{
		image: 'mace.png',
		'default': true
	}, espada:{
		image: 'espada.png',
		'default': true,
		sound: 'faca'
	}, ferramenta:{
		image: 'ferramenta.png',
		'default': true,
		sound: 'hit3'
	}, coxa:{
		image: 'coxa.png',
		'default': true
	}, fire_sword: {
		image: 'fire_sword.gif',
		'default': true,
		sound: 'fire'
	}, bacon: {
		image: 'bacon.png',
		'default': true
	}, doce: {
		image: 'doce.png',
		'default': true
	}, foice: {
		image: 'foice.png',
		'default': true,
		sound: 'faca'
	}, espada2: {
		image: 'espada2.png',
		'default': true,
		sound: 'faca'
	}, ice_sword: {
		image: 'ice_sword.gif',
		'default': true,
		sound: 'ice'
	}, thunder_sword: {
		image: 'thunder_sword.gif',
		'default': true,
		sound: 'thunder'
	}, lolipop: {
		image: 'lolipop.png',
		'default': true
	}, ogre_axe: {
		image: 'ogre_axe.png',
		'default': true,
		sound: 'hit3'
	}, flame_sword: {
		image: 'flame_sword.png',
		'default': true,
		sound: 'faca'
	}, steel_dagger: {
		image: 'steel_dagger.png',
		'default': true
	}, fly_sword: {
		image: 'fly_sword.png',
		'default': true,
		sound: 'faca'
	}, double_axe: {
		image: 'double_axe.png',
		'default': true,
		sound: 'hit3'
	}, arabian_dagger: {
		image: 'arabian_dagger.png',
		'default': true,
		sound: 'faca'
	}, poseidon_trident: {
		image: 'poseidon_trident.png',
		'default': true,
		sound: 'faca'
	}, crazyegg_staff: {
		image: 'crazyegg_staff.png',
		'default': true
	}, devil_mace: {
		image: 'devil_mace.png',
		'default': true
	}, talisma_axe: {
		image: 'talisma_axe.png',
		'default': true,
		sound: 'hit3'
	}, dragunsword: {
		image: 'dragunsword.gif',
		'default': true,
		sound: 'fire'
	}, angel_sword: {
		image: 'angel_sword.png',
		'default': true
	}, darkness_sword: {
		image: 'darkness_sword.gif',
		'default': true
	}, devil_sword: {
		image: 'devil_sword.png',
		'default': true
	}, hell_axe: {
		image: 'hell_axe.png',
		'default': true,
		sound: 'hit3'
	}, knight_sword: {
		image: 'knight_sword.png',
		'default': true
	}, steel_axe: {
		image: 'steel_axe.png',
		'default': true,
		sound: 'hit3'
	}, wing_axe: {
		image: 'wing_axe.png',
		'default': true,
		sound: 'hit3'
	}, fireman_axe: {
		image: 'fireman_axe.png',
		'default': true,
		sound: 'hit3'
	}, magic_wand: {
		image: 'magic_wand.png',
		'default': true
	}, plank: {
		image: 'plank.png',
		'default': true
	}, fire_ext: {
		image: 'fire_ext.png',
		'default': true,
		sound: 'hit3'
	}, crowbar: {
		image: 'crowbar.png',
		'default': true
	}
}
equipamentos = [null, "taco", "faca", "soco_ingles", "patinha", "marreta", "marreta_chapolim", "catapulta", "serra_eletrica", "mace", "espada", "ferramenta", "coxa", "fire_sword", "bacon", "doce", "foice", "espada2", "ice_sword", "thunder_sword", "lolipop", "ogre_axe", "flame_sword","steel_dagger","fly_sword","double_axe","arabian_dagger","poseidon_trident","crazyegg_staff","devil_mace","talisma_axe","dragunsword","angel_sword","darkness_sword","devil_sword","hell_axe","knight_sword","steel_axe","wing_axe","fireman_axe","magic_wand","plank","fire_ext","crowbar"];

habilidades = {
	"nyan-cat":{
		delay: 2500,
		sound: 'nyan-cat',
		images: 'nyan-cat.gif[mirror],nyan-cat-rainbow.gif'
	},
	"pedobear":{
		delay: 4500,
		sound: 'ai',
		images: 'pedobear.gif,pedobear_mirror.gif'
	},
	"domokun":{
		delay: 6400,
		sound: 'rugido,rugido2,terremoto',
		images: 'domo.gif[mirror]'
	},
	"over9000":{
		delay: 3800,
		sound: 'maisdeoitomil,ki,teleport',
		images: 'ki.png,visor.gif[mirror]'
	}
};
ordem_habilidades = [null, "nyan-cat", "pedobear", "domokun", "over9000"];

eventos = {
	"orly":{
		delay: 0,
		sound: 'toasty',
		images: 'orly.png[mirror]',
		antes: true
	}
};
ordem_eventos = [null, "orly"];