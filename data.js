/* ============ DONNÉES ============ */
const FX = {
  calmant:{n:'Calmant',k:'soin',t:['Détend légèrement','Apaise les nerfs et ralentit le pouls','Plonge dans un calme profond, les gestes s\'alourdissent','Terrasse le corps et l\'esprit d\'une torpeur épaisse']},
  soporifique:{n:'Soporifique',k:'esprit',t:['Rend somnolent','Procure un sommeil profond en une heure','Endort presque aussitôt, réveil difficile','Sommeil de plomb dont on émerge des heures plus tard']},
  tonique:{n:'Tonique',k:'soin',t:['Redonne un peu d\'allant','Fortifie et relève les convalescents','Rend vigueur et appétit en quelques jours','Fortifie durablement le corps épuisé']},
  stimulant:{n:'Stimulant',k:'esprit',t:['Éveille, chasse la fatigue','Accélère le cœur, aiguise l\'attention','Excite les sens, sueurs et palpitations','Emballe le cœur, agitation extrême']},
  antalgique:{n:'Antalgique',k:'soin',t:['Émousse un peu la douleur','Soulage les douleurs communes','Engourdit la douleur, même vive','Insensibilise presque entièrement']},
  cicatrisant:{n:'Cicatrisant',k:'soin',t:['Aide les petites plaies à se fermer','Accélère la cicatrisation des plaies propres','Ferme les plaies en quelques jours','Referme et répare les chairs, même profondes']},
  antiseptique:{n:'Antiseptique',k:'soin',t:['Retarde l\'infection','Nettoie et prévient l\'infection des plaies','Désinfecte solidement','Stérilise presque tout ce qu\'il touche']},
  febrifuge:{n:'Fébrifuge',k:'soin',t:['Rafraîchit','Fait baisser une fièvre modérée','Abat la fièvre en quelques heures','Éteint les plus fortes fièvres']},
  pectoral:{n:'Pectoral',k:'soin',t:['Adoucit la gorge','Calme la toux et dégage les poumons','Dégage franchement les bronches','Libère les poumons les plus encombrés']},
  digestif:{n:'Digestif',k:'soin',t:['Ouvre l\'appétit','Facilite la digestion','Réveille vigoureusement l\'estomac paresseux','Relance tout le tube digestif']},
  astringent:{n:'Astringent',k:'soin',t:['Resserre légèrement les tissus','Arrête les petits saignements et les flux','Stoppe les saignements et les flux','Ferme les tissus, arrête net les hémorragies']},
  emollient:{n:'Émollient',k:'soin',t:['Adoucit la peau','Assouplit et apaise les irritations','Apaise profondément les inflammations','Enveloppe les tissus d\'un calme gras et durable']},
  echauffant:{n:'Échauffant',k:'soin',t:['Réchauffe','Rougit la peau et active la circulation','Brûle agréablement, sueurs abondantes','Échauffe jusqu\'à la cloque']},
  diuretique:{n:'Diurétique',k:'soin',t:['Fait uriner un peu plus','Draine les humeurs','Draine abondamment','Vide l\'organisme de ses eaux']},
  antitoxique:{n:'Antitoxique',k:'soin',t:['Absorbe un peu de poison','Neutralise les petites intoxications','Neutralise la plupart des poisons avalés','Antidote puissant, capte presque tout']},
  euphorisant:{n:'Euphorisant',k:'esprit',t:['Légère gaieté','Gaieté franche, langue déliée','Euphorie, inhibitions envolées','Ivresse joyeuse et incontrôlable']},
  delirant:{n:'Délirant',k:'esprit',t:['Trouble légèrement la vue','Pupilles dilatées, vue brouillée, idées confuses','Hallucinations et délire','Délire violent, perte totale de repères']},
  lucidite:{n:'Clarté d\'esprit',k:'esprit',t:['Éclaircit les idées','Mémoire plus vive, esprit dégagé','Esprit très vif, concentration d\'acier','Lucidité presque douloureuse']},
  purgatif:{n:'Purgatif',k:'danger',t:['Relâche le ventre','Purge en quelques heures','Purge violemment','Vide l\'organisme sans ménagement, danger de déshydratation']},
  irritant:{n:'Irritant',k:'danger',t:['Pique un peu la peau ou la gorge','Irrite peau et muqueuses','Brûle la peau et les yeux','Enflamme cruellement tout ce qu\'il touche']},
  toxique:{n:'Toxique',k:'danger',t:['Traces toxiques, malaise passager','Empoisonnement bénin, nausées et fièvre','Poison sérieux, peut tuer un corps affaibli','Poison mortel, agonie assurée']},
  paralysant:{n:'Paralysant',k:'danger',t:['Engourdit les extrémités','Alourdit les membres, parole lente','Paralyse les membres','Paralysie totale, jusqu\'à l\'arrêt du souffle']},
  corrosif:{n:'Corrosif',k:'danger',t:['Ronge légèrement','Attaque la peau et les tissus','Brûle la chair, attaque métaux et pierres','Dissout presque tout ce qu\'il touche']},
  combustible:{n:'Inflammable',k:'matiere',t:['Brûle facilement','Prend feu avec vivacité','Brûle avec ardeur, difficile à éteindre','S\'embrase en un souffle']},
  conservateur:{n:'Conservateur',k:'matiere',t:['Retarde un peu la corruption','Conserve les denrées quelques semaines','Conserve durablement les chairs','Arrête presque toute putréfaction']},
  colorant:{n:'Colorant',k:'matiere',t:['Teinte pâlement','Teinte nettement','Teint franchement et durablement','Pigment intense et couvrant']},
  parfumant:{n:'Parfumant',k:'matiere',t:['Laisse une trace odorante','Parfume agréablement','Embaume toute la pièce','Odeur puissante, entêtante, tenace']},
  detersif:{n:'Détersif',k:'matiere',t:['Nettoie un peu','Dégraisse et nettoie','Décape les graisses','Nettoie jusqu\'à la peau à vif']}
};

const TYPES = {
  poison:{n:'Poison',c:'#7d4a9c',ic:'skull',b:'Substance nocive. À manier avec le plus grand soin.'},
  soin:{n:'Soin',c:'#3f8a6e',ic:'cross',b:'Remède à prendre par la bouche pour traiter un mal.'},
  baume:{n:'Baume',c:'#c08a2e',ic:'jar',b:'Remède d\'application externe, pour la peau et les plaies.'},
  tonique:{n:'Tonique',c:'#c2483f',ic:'spark',b:'Fortifie et réveille le corps.'},
  sedatif:{n:'Sédatif',c:'#34478f',ic:'moon',b:'Apaise, endort, calme les nerfs.'},
  stupefiant:{n:'Stupéfiant',c:'#b04f86',ic:'eye',b:'Agit sur l\'esprit : ivresse, visions, oubli.'},
  antidote:{n:'Antidote',c:'#2f9aa3',ic:'shield',b:'Neutralise les poisons avalés.'},
  purgatif:{n:'Purgatif',c:'#8c9a34',ic:'down',b:'Vide l\'organisme. À doser avec prudence.'},
  caustique:{n:'Caustique',c:'#cbc236',ink:'#38340a',ic:'bolt',b:'Ronge la chair et la matière.'},
  incendiaire:{n:'Incendiaire',c:'#d9782a',ic:'flame',b:'S\'enflamme aisément et brûle fort.'},
  parfum:{n:'Parfum',c:'#c9788e',ic:'flask',b:'Vaut pour son odeur.'},
  colorant:{n:'Colorant',c:'#2f7fb5',ic:'drop',b:'Pigment, teinture ou encre.'},
  conservateur:{n:'Conservateur',c:'#8d7a5a',ic:'hourglass',b:'Retarde la corruption des chairs et des denrées.'},
  detergent:{n:'Détergent',c:'#6fb3c9',ink:'#0f2a33',ic:'bubbles',b:'Nettoie et dégraisse.'},
  desinfectant:{n:'Désinfectant',c:'#7aa84a',ic:'star',b:'Assainit plaies, mains et surfaces.'},
  bourbe:{n:'Bourbe',c:'#6d6a5f',ic:'waves',b:'Une mixture sans vertu franche.'}
};

/* Affinité de solubilité : eau, alcool, huile, vinaigre */
const SOL = {
  mucil:{eau:1,alcool:.4,huile:0,vinaigre:.7},
  alcal:{eau:.5,alcool:1,huile:.15,vinaigre:.85},
  resine:{eau:.1,alcool:1,huile:.7,vinaigre:.2},
  gras:{eau:0,alcool:.5,huile:1,vinaigre:0},
  sel:{eau:1,alcool:.1,huile:0,vinaigre:.8},
  metal:{eau:.1,alcool:0,huile:0,vinaigre:.65},
  ess:{eau:.75,alcool:1,huile:.9,vinaigre:.45},
  inerte:{eau:0,alcool:0,huile:.15,vinaigre:.1},
  dis_eau:{eau:1,alcool:.9,huile:.1,vinaigre:.9},
  dis_alcool:{eau:.9,alcool:1,huile:.3,vinaigre:.8},
  dis_huile:{eau:0,alcool:.3,huile:1,vinaigre:0},
  dis_vinaigre:{eau:1,alcool:.8,huile:.1,vinaigre:1}
};
const SOL_LABEL = {mucil:'à l\'eau surtout',alcal:'à l\'alcool ou au vinaigre',resine:'à l\'alcool ou à l\'huile',gras:'à l\'huile',sel:'à l\'eau ou au vinaigre',metal:'au vinaigre seulement',ess:'à l\'alcool et à l\'huile',inerte:'nulle part : elle reste en poudre'};
const PART_LABEL = {tendre:'Fleurs et feuilles tendres',dur:'Racine, écorce ou baie, dure',resine:'Résine',sel:'Sel cristallin',metal:'Métal',inerte:'Poudre ou pierre insoluble',animal:'Substance animale'};

/* Facteur de rendement d'une partie selon la technique humide */
const PF = {
  infuser:{tendre:1,dur:.45,resine:.15,sel:1,metal:.2,inerte:0,animal:.3},
  decocter:{tendre:.7,dur:1,resine:.6,sel:1,metal:.35,inerte:0,animal:.7},
  macerer:{tendre:.85,dur:.95,resine:1,sel:.5,metal:.5,inerte:0,animal:.9}
};

/* Ingrédients. p=partie, s=solubilité, v=volatilité (0-2), sh=forme dessinée */
const ING = [
 // — plantes —
 {id:'herbe_veuve',n:'Herbe de veuve',cat:'plantes',d:'Apaise, engourdit, ralentit le corps.',p:'tendre',s:'alcal',v:0,fx:{calmant:2,antalgique:1,paralysant:1},over:{toxique:2,paralysant:1},col:'#5f6b4a',taste:['amer',2],smell:['herbacée lourde',1],side:['Membres et bouche engourdis'],sh:'feuilles'},
 {id:'chardon_lanterne',n:'Chardon-lanterne',cat:'plantes',d:'Réveille, échauffe, fait transpirer.',p:'tendre',s:'ess',v:1,fx:{stimulant:2,echauffant:2},col:'#c2703a',taste:['âcre',1],smell:['épicée',1],side:['Sueurs et palpitations'],sh:'fleurs'},
 {id:'bourrache_noire',n:'Bourrache noire',cat:'plantes',d:'Adoucit la gorge, les poumons, les nerfs.',p:'tendre',s:'mucil',v:0,fx:{pectoral:3,emollient:2,calmant:1},col:'#4d5563',taste:['doux',1],smell:['végétale',1],sh:'feuilles'},
 {id:'sabline',n:'Sabline',cat:'plantes',d:'Draine, assèche, resserre.',p:'tendre',s:'mucil',v:0,fx:{diuretique:2,astringent:2},col:'#8f9c6d',taste:['fade',1],smell:['sèche',1],sh:'fibres'},
 {id:'fleur_nuit',n:'Fleur de nuit',cat:'plantes',d:'Favorise le sommeil et les rêves, laisse la bouche pâteuse.',p:'tendre',s:'ess',v:2,fx:{soporifique:3,delirant:1},col:'#6f5f9c',taste:['doux',1],smell:['capiteuse',2],side:['Bouche pâteuse au réveil'],sh:'fleurs'},
 {id:'racine_amere',n:'Racine-amère',cat:'plantes',d:'Tonifie, ouvre l\'appétit, irrite l\'estomac.',p:'dur',s:'alcal',v:0,fx:{tonique:2,digestif:3,irritant:1},col:'#8c6a3c',taste:['amer',3],smell:['terreuse',1],side:['Brûlures d\'estomac'],sh:'racines'},
 {id:'ortie_rousse',n:'Ortie rousse',cat:'plantes',d:'Irrite la peau, stimule la circulation.',p:'tendre',s:'mucil',v:0,fx:{echauffant:3,irritant:2,tonique:1},labile:['irritant'],col:'#a5553a',taste:['âcre',2],smell:['végétale',1],sh:'feuilles'},
 {id:'melisse_tourbieres',n:'Mélisse des tourbières',cat:'plantes',d:'Calme l\'esprit, atténue la peur.',p:'tendre',s:'ess',v:2,fx:{calmant:2,digestif:1},col:'#7fa07a',taste:['frais',1],smell:['citronnée',2],sh:'feuilles'},
 {id:'fougere_cendree',n:'Fougère cendrée',cat:'plantes',d:'Purge, nettoie, affaiblit.',p:'dur',s:'mucil',v:0,fx:{purgatif:3},col:'#9aa39a',taste:['âcre',2],smell:['humide',1],side:['Affaiblissement, crampes'],sh:'fibres'},
 {id:'lichen_roche',n:'Lichen de roche',cat:'plantes',d:'Nourrit, fortifie, cicatrise lentement.',p:'dur',s:'mucil',v:0,fx:{tonique:2,cicatrisant:1,emollient:1},col:'#a7b08e',taste:['fade',1],smell:['de pierre humide',1],sh:'mousse'},
 {id:'mauve_grasse',n:'Mauve grasse',cat:'plantes',d:'Adoucit, apaise les inflammations.',p:'tendre',s:'mucil',v:0,fx:{emollient:3,cicatrisant:1,pectoral:1},col:'#9a7bb0',taste:['doux',1],smell:['discrète',0],sh:'fleurs'},
 {id:'sauge_fievre',n:'Sauge-fièvre',cat:'plantes',d:'Rafraîchit, fait baisser la chaleur du corps.',p:'tendre',s:'ess',v:1,fx:{febrifuge:3,antiseptique:1},col:'#8fae9c',taste:['amer',1],smell:['camphrée',2],sh:'feuilles'},
 {id:'cornouille_amere',n:'Cornouille amère',cat:'plantes',d:'Resserre, arrête les flux.',p:'dur',s:'mucil',v:0,fx:{astringent:3,febrifuge:1},tags:['tanin'],col:'#6d3b30',taste:['amer',2],smell:['boisée',1],sh:'racines'},
 {id:'belle_ombre',n:'Belle-d\'ombre',cat:'plantes',d:'Dilate les pupilles, trouble l\'esprit. Très dangereuse.',p:'dur',s:'alcal',v:0,fx:{delirant:3,toxique:3},col:'#2f1f44',taste:['doux',1],smell:['aucune',0],side:['Pupilles dilatées, bouche sèche'],sh:'baies',danger:1},
 // — sèves, champignons, résines —
 {id:'larme_pin',n:'Larme de pin',cat:'resines',d:'Résine antiseptique, sert aussi de liant.',p:'resine',s:'resine',v:1,fx:{antiseptique:2,cicatrisant:1,pectoral:1},col:'#d9a441',taste:['âcre',1],smell:['résineuse',2],sh:'pepites'},
 {id:'sang_bouleau',n:'Sang-de-bouleau',cat:'resines',d:'Sève rougeâtre, tonique et légèrement euphorisante.',p:'tendre',s:'mucil',v:0,fx:{tonique:2,euphorisant:1},tags:['sucre'],col:'#a4402f',taste:['doux',2],smell:['sucrée',1],sh:'liquide'},
 {id:'bolet_fauve',n:'Bolet fauve',cat:'resines',d:'Stimule le cœur, provoque des sueurs froides.',p:'dur',s:'alcal',v:0,fx:{stimulant:3,toxique:1},over:{toxique:2},col:'#b9793a',taste:['noisette',1],smell:['de sous-bois',1],side:['Sueurs froides'],sh:'champignons'},
 {id:'vesse_loup',n:'Vesse-de-loup poudreuse',cat:'resines',d:'Spores qui arrêtent les saignements, irritent les yeux.',p:'inerte',s:'inerte',v:0,fx:{astringent:2,cicatrisant:2,irritant:1},col:'#a19b86',taste:['fade',1],smell:['de terre',1],sh:'boules'},
 {id:'moisissure_bleue',n:'Moisissure bleue',cat:'resines',d:'Conservateur, parfois remède, parfois poison.',p:'dur',s:'alcal',v:0,fx:{conservateur:1,antiseptique:1,toxique:1},col:'#3f6f8f',taste:['âcre',1],smell:['de cave',2],sh:'mousse'},
 {id:'encens_rocaille',n:'Encens de rocaille',cat:'resines',d:'Résine qui clarifie l\'esprit, faite pour brûler.',p:'resine',s:'resine',v:2,fx:{lucidite:2,parfumant:3,antiseptique:1},col:'#d8c08a',taste:['âcre',1],smell:['boisée, fumée',3],sh:'pepites'},
 // — minéraux et sels —
 {id:'vitriol_vert',n:'Vitriol vert',cat:'mineraux',d:'Corrosif, tanne, fixe les couleurs.',p:'sel',s:'sel',v:0,fx:{corrosif:2,astringent:1,colorant:1,toxique:1},tags:['mordant'],col:'#5aa88a',taste:['métallique',3],smell:['métallique',1],sh:'cristaux'},
 {id:'sel_amertume',n:'Sel d\'amertume',cat:'mineraux',d:'Purge et vide l\'organisme.',p:'sel',s:'sel',v:0,fx:{purgatif:4},col:'#e3e0d8',taste:['amer',3],smell:['aucune',0],side:['Coliques violentes'],sh:'cristaux'},
 {id:'poudre_eclat',n:'Poudre d\'éclat',cat:'mineraux',d:'Pigment métallique brillant, très toxique.',p:'inerte',s:'inerte',v:0,fx:{colorant:3,toxique:4},tags:['lent'],col:'#e2b731',taste:['fade',1],smell:['aucune',0],sh:'poudre',danger:1},
 {id:'argent_vif',n:'Argent-vif',cat:'mineraux',d:'Liquide lourd, qui traverse et infiltre, tue lentement.',p:'metal',s:'metal',v:1,fx:{toxique:3,antiseptique:1},tags:['mercure','lent'],col:'#b8bcc4',taste:['métallique',1],smell:['aucune',0],sh:'goutte',danger:1},
 {id:'soufre_jaune',n:'Soufre jaune',cat:'mineraux',d:'Désinfecte, fume, brûle avec une odeur âcre.',p:'inerte',s:'inerte',v:0,fx:{antiseptique:2,combustible:3,irritant:1},tags:['soufre','fumeux'],col:'#e6d24a',taste:['âcre',2],smell:['âcre, d\'œuf pourri',3],sh:'cristaux'},
 {id:'pierre_lune',n:'Pierre de lune blanche',cat:'mineraux',d:'Absorbante, purifie les liquides.',p:'inerte',s:'inerte',v:0,fx:{antitoxique:3,astringent:1},col:'#ece9e3',taste:['fade',0],smell:['aucune',0],sh:'galets'},
 {id:'ocre_rouge',n:'Ocre rouge',cat:'mineraux',d:'Pigment inerte, teint et masque.',p:'inerte',s:'inerte',v:0,fx:{colorant:3},col:'#b5482c',taste:['terreux',0],smell:['aucune',0],sh:'poudre'},
 {id:'salpetre_gris',n:'Salpêtre gris',cat:'mineraux',d:'Accélère la combustion, conserve les chairs.',p:'sel',s:'sel',v:0,fx:{combustible:2,conservateur:3},col:'#c4c2bb',taste:['frais',2],smell:['aucune',0],sh:'aiguilles'},
 {id:'alun_cristallin',n:'Alun cristallin',cat:'mineraux',d:'Resserre, cicatrise, clarifie les eaux troubles.',p:'sel',s:'sel',v:0,fx:{astringent:3,cicatrisant:2,antiseptique:1},col:'#dbe8ee',taste:['acide',2],smell:['aucune',0],sh:'cristaux'},
 {id:'fleur_cuivre',n:'Fleur de cuivre',cat:'mineraux',d:'Poudre verte qui teint la flamme, irrite les muqueuses.',p:'metal',s:'metal',v:0,fx:{colorant:2,irritant:2,toxique:1,antiseptique:1},tags:['cuivre','fumeux'],col:'#2fa27c',taste:['métallique',2],smell:['métallique',1],sh:'poudre'},
 {id:'sel_noir',n:'Sel noir',cat:'mineraux',d:'Tire l\'humidité, dessèche, conserve.',p:'sel',s:'sel',v:0,fx:{conservateur:3,astringent:1},col:'#3a3535',taste:['salé',3],smell:['aucune',0],sh:'cristaux'},
 {id:'charbon_saule',n:'Charbon de saule',cat:'mineraux',d:'Absorbe vapeurs et humeurs, brûle sans flamme.',p:'inerte',s:'inerte',v:0,fx:{antitoxique:2,combustible:2,colorant:1},col:'#25211f',taste:['fade',0],smell:['de fumée froide',1],sh:'batons'},
 // — substances animales —
 {id:'fiel_sanglier',n:'Fiel de sanglier',cat:'animal',d:'Amer, dissout les graisses, purge.',p:'animal',s:'alcal',v:0,fx:{purgatif:2,digestif:1,detersif:2},col:'#6b6a2a',taste:['amer',3],smell:['forte',2],sh:'liquide',jar:'fiole'},
 {id:'poudre_corne',n:'Poudre de corne',cat:'animal',d:'Fortifie légèrement.',p:'inerte',s:'inerte',v:0,fx:{tonique:1,cicatrisant:1},col:'#d8cdb2',taste:['fade',0],smell:['de corne brûlée',1],sh:'poudre',jar:'fiole'},
 {id:'venin_vipere',n:'Venin de vipère séché',cat:'animal',d:'En microdose, anesthésiant ; au-delà, paralysant.',p:'animal',s:'alcal',v:0,fx:{paralysant:2,toxique:2},micro:{antalgique:2},tags:['lent'],col:'#c9c19a',taste:['fade',0],smell:['aucune',0],side:['Vertiges, vue qui se voile'],sh:'poudre',jar:'fiole',danger:1},
 {id:'ambre_gris',n:'Ambre gris',cat:'animal',d:'Fixe les parfums, apaise.',p:'resine',s:'ess',v:0,fx:{parfumant:3,calmant:1},tags:['fixateur'],col:'#7d766b',taste:['fade',0],smell:['musquée, marine',2],sh:'pepites',jar:'fiole'},
 // — bases : liquides (solvants) —
 {id:'eau_pluie',n:'Eau de pluie',cat:'bases',role:'solvant',kind:'eau',d:'Douce et neutre, mais se corrompt vite.',fx:{},col:'#cbd6d3',taste:['fade',0],smell:['aucune',0],sh:'liquide',jar:'bouteille'},
 {id:'eau_distillee',n:'Eau distillée',cat:'bases',role:'solvant',kind:'eau',d:'Pure, sans goût ni impureté.',fx:{},col:'#dbe6e8',taste:['fade',0],smell:['aucune',0],sh:'liquide',jar:'bouteille'},
 {id:'alcool',n:'Alcool fort',cat:'bases',role:'solvant',kind:'alcool',d:'Extrait les principes actifs et conserve tout.',fx:{antiseptique:1,conservateur:2},col:'#e6dcc0',taste:['brûlant',2],smell:['piquante',1],sh:'liquide',jar:'bouteille'},
 {id:'vinaigre',n:'Vinaigre de cidre',cat:'bases',role:'solvant',kind:'vinaigre',d:'Dissout les sels et attaque les métaux.',fx:{antiseptique:1,conservateur:1},col:'#d1a34a',taste:['acide',3],smell:['acide',2],tags:['acide'],sh:'liquide',jar:'bouteille'},
 {id:'huile',n:'Huile d\'olive',cat:'bases',role:'solvant',kind:'huile',d:'Capte les principes gras et les essences.',fx:{emollient:1},col:'#c8b23c',taste:['gras',1],smell:['fruitée',1],sh:'liquide',jar:'bouteille'},
 {id:'lait_chaux',n:'Lait de chaux',cat:'bases',role:'solvant',kind:'eau',d:'Alcalin et mordant. Neutralise les acides.',fx:{corrosif:1.4,antiseptique:1},col:'#efeee8',taste:['âcre',2],smell:['minérale',1],tags:['alcalin'],sh:'liquide',jar:'bouteille'},
 // — bases : liants (adjuvants) —
 {id:'miel',n:'Miel',cat:'bases',role:'adjuvant',kind:'miel',d:'Adoucit, masque l\'amertume, conserve.',fx:{emollient:1,pectoral:1,antiseptique:1,conservateur:1},tags:['sucre'],col:'#d9a03a',taste:['doux',3],smell:['florale',1],sh:'liquide',jar:'bocal'},
 {id:'glycerine',n:'Glycérine',cat:'bases',role:'adjuvant',kind:'glycerine',d:'Onctueuse, stabilise et adoucit.',fx:{emollient:2},col:'#e8efe9',taste:['doux',1],smell:['aucune',0],sh:'liquide',jar:'bouteille'},
 {id:'graisse_oie',n:'Graisse d\'oie',cat:'bases',role:'adjuvant',kind:'gras',d:'Base d\'onguent, adoucit.',fx:{emollient:2},tags:['gras'],col:'#eee2c3',taste:['gras',1],smell:['de rôti',1],sh:'pate',jar:'pot'},
 {id:'cire_brune',n:'Cire brune',cat:'bases',role:'adjuvant',kind:'cire',d:'Scelle, protège, conserve.',fx:{conservateur:1,emollient:1},tags:['cire','gras'],col:'#a97d3b',taste:['fade',0],smell:['miellée',1],sh:'pate',jar:'pot'}
];
const BY = {}; ING.forEach(i=>BY[i.id]=i);

const CATS = [
  {id:'plantes',n:'Plantes'},
  {id:'resines',n:'Sèves et résines'},
  {id:'mineraux',n:'Minéraux et sels'},
  {id:'animal',n:'Animal'},
  {id:'bases',n:'Bases'}
];

/* Techniques */
const TECH = {
  broyer:{n:'Broyer',tool:'Mortier et pilon',d:'Réduire à sec en poudre fine. Rien n\'est dilué, rien n\'est perdu, mais tout reste brut : goût, âpreté et danger compris.',heat:null,solv:[],adj:['miel','glycerine','graisse_oie','cire_brune']},
  infuser:{n:'Infuser',tool:'Théière',d:'Laisser tremper dans de l\'eau chaude. Idéal pour fleurs et feuilles tendres ; les racines et résines cèdent peu.',heat:['Tiède','Chaude','Bouillante'],heatTip:['Extraction lente, les essences se gardent.','Le juste milieu.','Les essences s\'envolent avec la vapeur.'],solv:['eau_pluie','eau_distillee','lait_chaux'],adj:['miel','glycerine']},
  decocter:{n:'Décocter',tool:'Marmite',d:'Faire bouillir longuement. Vient à bout des racines, écorces, baies et champignons, mais chasse les essences fragiles.',heat:['Mijoté','Bouillon franc','Ébullition vive'],heatTip:['Doux et patient, préserve un peu.','Rendement plein.','Concentre, mais tout est cuit et les essences sont perdues.'],solv:['eau_pluie','eau_distillee','vinaigre','lait_chaux'],adj:['miel','glycerine','graisse_oie']},
  macerer:{n:'Macérer',tool:'Bocal',d:'Laisser reposer à froid dans un solvant pendant des jours. L\'alcool extrait le plus, l\'huile capte les principes gras, le vinaigre attaque sels et métaux.',heat:null,solv:['alcool','vinaigre','huile','eau_pluie','eau_distillee'],adj:['miel','glycerine']},
  distiller:{n:'Distiller',tool:'Alambic',d:'Chauffer et recueillir la vapeur. Seules les substances volatiles passent : le reste demeure dans la cornue. Donne des produits très purs.',heat:['Chauffe douce','Chauffe régulière','Feu vif'],heatTip:['Préserve les essences fines, lent.','Régulier, bon rendement.','Risqué : goût de brûlé, vapeurs qui s\'échappent.'],solv:['eau_pluie','eau_distillee','alcool','vinaigre'],adj:[]},
  calciner:{n:'Calciner',tool:'Creuset et fourneau',d:'Réduire au feu en cendre ou en sel. Détruit le vivant, garde et concentre le minéral. Dangereux avec les substances qui brûlent ou s\'évaporent.',heat:['Braise','Feu franc','Feu de forge'],heatTip:['Calcination incomplète.','Calcination complète.','Calcination à outrance, plus âpre.'],solv:[],adj:[]},
  petrir:{n:'Pétrir',tool:'Pot au bain-marie',d:'Malaxer au chaud dans un corps gras : graisse, cire ou huile. Les poudres s\'y mêlent bien ; les plantes s\'y attachent moins.',heat:['Bain-marie doux','Bain-marie chaud','Feu direct'],heatTip:['Tout se conserve.','Fond bien la cire.','La graisse fume et grille.'],solv:['huile','lait_chaux'],adj:['graisse_oie','cire_brune','glycerine','miel']},
  fumiger:{n:'Fumiger',tool:'Encensoir',d:'Brûler sur braises pour respirer les fumées. Les essences volatiles passent très bien ; les substances lourdes, presque pas.',heat:['Braise couvante','Braise vive','Flamme'],heatTip:['Fumée douce et régulière.','Fumée franche.','La flamme brûle tout d\'un coup.'],solv:[],adj:['miel','cire_brune']},
  melanger:{n:'Mélanger',tool:'Bol et cuillère',d:'Mêler à froid, sans extraire ni cuire. Sert surtout à assembler des mixtures déjà préparées : liquide et liquide, poudre et poudre, poudre dans un liquide ou dans un corps gras. Les plantes brutes y cèdent peu.',heat:null,solv:['eau_pluie','eau_distillee','alcool','vinaigre','huile','lait_chaux'],adj:['miel','glycerine','graisse_oie','cire_brune']},
  fermenter:{n:'Fermenter',tool:'Jarre',d:'Laisser travailler plusieurs semaines. Les sucres deviennent alcool ; sans sucre, la mixture tourne.',heat:null,solv:['eau_pluie','eau_distillee'],adj:['miel']}
};
const TECH_ORDER = ['broyer','melanger','infuser','decocter','macerer','distiller','calciner','petrir','fumiger','fermenter'];

const FIN = {
  filtrer:{n:'Filtrer',d:'Passer au filtre de lin. Retire les poudres en suspension et adoucit les irritants. Réservé aux liquides.'},
  reduire:{n:'Réduire',d:'Concentrer à feu doux. Les vertus gagnent en force, les parfums s\'évaporent. Réservé aux liquides.'},
  sceller:{n:'Sceller à la cire',d:'Fermer le flacon à la cire. La conservation est bien plus longue.'}
};
const DOSE_LABEL = ['','Pincée','Mesure','Forte dose'];
const DF = [0,.6,1.2,2.0];
const CAP = 8;
const MAX_ITEMS = 6;
const MAX_STOCK = 30;
