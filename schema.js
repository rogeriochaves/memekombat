var ArquivamentoSchema = new Schema({
	titulo: String
  , num: { type: Number, unique: true }
  ,	descricao: String
  , pontos: Number
  , titulo_en: String
  , descricao_en: String
  , img: String
  , texto_cima: String
  , texto_baixo: String
  , texto_cima_en: String
  , texto_baixo_en: String
  , url: String
});
mongoose.model('Arquivamentos', ArquivamentoSchema);

var NotificacaoSchema = new Schema({
	tipo: Number
  , texto: String
  , texto_en: String
  , data: { type: Date, default: Date.now }
  , luta_id: ObjectId
  , personagem2_id: ObjectId
});

var PersonagemSchema = new Schema({
	uid: {type: String, unique: true}
  ,	meme_src: String
  , level: Number
  , hp: Number
  , atq: Number
  , vel: Number
  , def: Number
  , crit: Number
  , indicacao_id: ObjectId
  , nome: String
  , exp: Number
  , idioma: String
  , genero: String
  , username: String
  , link_indicacao: String
  , ranking_pos: Number
  , campeonato_id: ObjectId
  , chave_lv: Number
  , vitorias: Number
  , derrotas: Number
  , arquivamentos: Array
  , equipamentos: Array
  , habilidades: Array
  , notificacoes: [NotificacaoSchema]
  , random: {type: Number, default: Math.random()}
});
mongoose.model('Personagens', PersonagemSchema);

var CreditoSchema = new Schema({
	personagem_id: ObjectId
  , valor: Number
  , data: { type: Date, default: Date.now }
  , pedido_id: ObjectId
  , quantidade: Number
});
mongoose.model('Creditos', CreditoSchema);

var PedidoSchema = new Schema({
	uid: String
  , order_id: String
  , tipo: Number
  , quantidade: Number
  , arma_id: ObjectId
  , data: { type: Date, default: Date.now }
});
mongoose.model('Pedidos', PedidoSchema);

var EquipamentoSchema = new Schema({
	nome: String
  , num: { type: Number, unique: true }
  , atq: Number
  , def: Number
  , vel: Number
  , crit: Number
  , tipo: { type: Number, default: 0 }
  , nivel_minimo: Number
  , preco_creditos: { type: Number, default: 0 }
});
mongoose.model('Equipamentos', EquipamentoSchema);

var HabilidadeSchema = new Schema({
	nome: String
  , num: { type: Number, unique: true }
  , dano: Number
});
mongoose.model('Habilidades', HabilidadeSchema);

var LutaSchema = new Schema({
	personagem1_id: ObjectId
  , personagem2_id: ObjectId
  , personagem1_hp: Number
  , personagem2_hp: Number
  , personagem1_lv: Number
  , personagem2_lv: Number
  , data: { type: Date, default: Date.now }
  , ganhador_id: ObjectId
  , perdedor_id: ObjectId
  , fb_total_count: {type: Number, default: 0}
  , fb_like_count: {type: Number, default: 0}
  , fb_comment_count: {type: Number, default: 0}
  , fb_share_count: {type: Number, default: 0}
  , fb_click_count: {type: Number, default: 0}
  , credito: Boolean
  , short_url: String
  , campeonato: {type: Boolean, default: false}
  , tweets: {type: Number, default: 0}
  , movimentos: String
});
mongoose.model('Lutas', LutaSchema);

var MemeSchema = new Schema({
	nome: String
  ,	src: {type: String, unique: true}
});
mongoose.model('Memes', MemeSchema);

var RankingSchema = new Schema({
	nome: String
  , nome_en: String
  ,	pos: {type: Number, unique: true}
});
mongoose.model('Rankings', RankingSchema);

global.Personagem = mongoose.model('Personagens');
global.Equipamento = mongoose.model('Equipamentos');
global.Habilidade = mongoose.model('Habilidades');
global.Arquivamento = mongoose.model('Arquivamentos');
global.Luta = mongoose.model('Lutas');
global.Credito = mongoose.model('Creditos');
global.Meme = mongoose.model('Memes');
global.Ranking = mongoose.model('Rankings');

/*
meme.save(function(err){
	if(err) throw(err);
	
	var usuario = new Usuario();
	usuario.meme = meme.src;
	usuario.uid = '123';
	usuario.nome = 'Rogério Chaves';
	usuario.save(function(err){
		if(err) throw(err);

		Usuario.findOne({uid: '123'}, function(err, data){
			if(err) throw(err);
			console.log(data.meme);
			mongoose.disconnect();
		});

	});
	
	
});


/*


mongoose.connect('mongodb://localhost/memekombat');
mongoose.model('Teste', TesteSchema);


var Teste = mongoose.model('Teste');

var t = new Teste();
t.nome = 'aew';
t.date = Date.now();

t.save(function(err){
	if(err) throw(err);
	console.log("salvo!");
	mongoose.disconnect();
});*/