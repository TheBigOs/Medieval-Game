export type Locale = 'en' | 'fr';

// ── Room text ──────────────────────────────────────────────────────────────

export interface RoomText { name: string; description: string; shortDescription: string; }

export const ROOM_TEXT: Record<Locale, Record<string, RoomText>> = {
  en: {
    'dungeon-cell': {
      name: 'Dungeon Cell',
      description: 'Cold stone walls close in around you, slick with moisture. A thin slit of a window near the ceiling admits a sliver of grey light — barely enough to see by. The stench of damp straw and old despair fills your nostrils. A heavy wooden door reinforced with iron bars stands to the east. It is locked.',
      shortDescription: 'Your cell. Damp stone, mouldy straw, a locked door to the east.',
    },
    'guard-post': {
      name: 'Guard Post',
      description: 'A squat room reeking of tallow candles and unwashed men. A heavy table dominates the center, scattered with the remains of a meal and several empty tankards. A guard sits slumped in his chair — still breathing, but barely awake. He has not noticed you yet. Weapon hooks on the wall hold a battered shield. Passages lead north and east.',
      shortDescription: 'Guard post. Drowsy guard, wooden shield on the wall. North to corridor, east to armory.',
    },
    'armory': {
      name: 'Armory',
      description: 'Racks of weapons and neatly folded armor line the walls — standard castle issue, but well-kept. Crates of bolts and arrows are stacked in one corner. The room is empty of guards — whoever was posted here has abandoned their station.',
      shortDescription: 'Armory. Weapon racks and armor. No enemies. Exit west.',
    },
    'corridor': {
      name: 'Dim Corridor',
      description: 'A narrow passage cut from living rock, its ceiling so low you must duck in places. Guttering torches in iron brackets throw shifting shadows. The place is quiet — no guards patrol here. A side passage opens to the east, another to the west, and the main tunnel continues north.',
      shortDescription: 'Narrow corridor. Silent and empty. East to torture chamber, west to barracks, north deeper.',
    },
    'barracks': {
      name: 'Guard Barracks',
      description: 'A low-ceilinged room lined with rough wooden bunks, most unmade and abandoned in haste. Cloaks and personal effects litter the floor — whoever slept here left quickly. Weapons and gear were scattered in the rush; something useful may still be here. A narrow stair leads north into the dark.',
      shortDescription: 'Abandoned barracks. Empty bunks, scattered belongings. Stair north.',
    },
    'torture-chamber': {
      name: 'Torture Chamber',
      description: 'Your stomach turns as you take in this chamber. Iron racks, chains bolted to the ceiling, and other implements of suffering crowd the space. Dark stains mark the flagstones beneath your boots. An orc in a blood-stained leather apron looks up from his work, expression shifting from surprise to glee.',
      shortDescription: 'Torture chamber. Grim implements everywhere. The orc torturer is here.',
    },
    'undercroft': {
      name: 'Undercroft',
      description: 'A vaulted chamber beneath the castle proper. Ancient stone shelves hold skulls and crumbling relics. The air is bone-dry and smells of dust and old magic. A single robed skeleton stands motionless at the far end — until it senses your presence, and turns with a dry, rattling clatter. A narrow passage leads west; stairs rise to the north.',
      shortDescription: 'Undercroft. Ancient bones, one hostile skeleton. West to crypt, north upstairs.',
    },
    'crypt': {
      name: 'Ancient Crypt',
      description: 'A forgotten burial chamber sealed for centuries. Ornate but decayed sarcophagi line the walls. Cobwebs thick as curtains hang from the ceiling. At the center of the chamber stands a skeleton in full plate armor, hollow eye sockets burning with pale blue flame. It raises a sword as old as the castle itself.',
      shortDescription: 'Ancient crypt. A skeleton knight guards this place.',
    },
    'kitchen': {
      name: 'Castle Kitchen',
      description: 'Warm and smoke-filled, the castle kitchen smells of roasting meat and woodsmoke — a jarring contrast to the dungeon below. Iron pots bubble over roaring fires. Shelves of provisions line the walls. A heavyset cook spins around at your entrance, reaching for a cleaver. He looks more alarmed than bloodthirsty — he might back down. Passages lead east and west off the main hall.',
      shortDescription: "Castle kitchen. Warm fires, food stores. The cook is here. East to dormitory, west to wizard's office.",
    },
    'great-hall': {
      name: 'Great Hall',
      description: "A magnificent hall reduced to a grim barracks. Long feasting tables are shoved against the walls to make room for sparring. Faded tapestries depict battles long forgotten. Standing in the center of the hall is a figure in black plate armor — the castle's champion. He turns at your approach, drawing a greatsword with slow, deliberate menace. \"You'll not leave here alive,\" he says. Archways lead east to the chapel and west to the stables.",
      shortDescription: 'Great Hall. The Dark Knight awaits. Chapel east, stables west, gatehouse north.',
    },
    'gatehouse': {
      name: 'Gatehouse',
      description: "The castle's gatehouse, cold and echoing. Arrow slits in the thick walls look out onto a frozen courtyard bathed in moonlight. A great portcullis blocks the exit to the north — but the winch mechanism is right here. A scarred veteran in chainmail steps forward, halberd leveled at your chest. \"Nobody passes,\" he says, with the quiet certainty of a man who means it.",
      shortDescription: 'Gatehouse. The portcullis and the Gate Captain stand between you and freedom.',
    },
    'charnel-chamber': {
      name: 'Charnel Chamber',
      description: 'A low-ceilinged chamber that reeks of dust and old death. Cracked flagstones are littered with the debris of ages — shards of pottery, rusted metal, and the scattered bones of those who were simply never retrieved. In two separate corners, piles of ancient remains begin to stir. Bones click and rattle as they pull themselves upright, hollow sockets turning toward you with slow, terrible purpose.',
      shortDescription: 'Charnel chamber. Two decrepit skeletons rise from the bones here. Exit south.',
    },
    'chapel': {
      name: 'Castle Chapel',
      description: '', shortDescription: '', // set dynamically
    },
    'stable': {
      name: 'Castle Stables',
      description: '', shortDescription: '', // set dynamically
    },
    'dormitory': {
      name: 'Castle Dormitory',
      description: 'Long rows of two-tiered bunks fill this dormitory, most disheveled or stripped of bedding. Personal effects are strewn across the floor — dice, letters, cheap trinkets. Not fully abandoned: armed soldiers are already rising from their bunks at your intrusion, hands going to their weapons.',
      shortDescription: '', // set dynamically
    },
    'wizard-office': {
      name: "Wizard's Office",
      description: "A cramped office crammed with shelves of glass vessels, dog-eared tomes, and star charts pinned askew to the walls. The reek of sulphur and old parchment fills the room. A young man in ink-stained robes spins around from a cluttered workbench, eyes wide — then suddenly fierce. Power crackles visibly at his fingertips.",
      shortDescription: "Wizard's office. Shelves of arcana. The apprentice is here. Exit east.",
    },
  },
  fr: {
    'dungeon-cell': {
      name: 'Cellule du Donjon',
      description: "Des murs de pierre froide vous encerclent, luisants d'humidité. Une mince fente de fenêtre près du plafond laisse filtrer un rai de lumière grise — à peine suffisant pour voir. L'odeur de paille moisie et de vieux désespoir emplit vos narines. Une lourde porte en bois renforcée de barres de fer se dresse à l'est. Elle est verrouillée.",
      shortDescription: 'Votre cellule. Pierre humide, paille moisie, une porte verrouillée à l\'est.',
    },
    'guard-post': {
      name: 'Poste de Garde',
      description: "Une pièce basse qui empeste les chandelles de suif et les hommes sans toilette. Une table lourde domine le centre, jonchée de restes de repas et de chopes vides. Un garde est affalé dans son fauteuil — encore en vie, mais à peine éveillé. Il ne vous a pas encore remarqué. Des crochets à armes sur le mur supportent un bouclier cabossé. Des passages mènent au nord et à l'est.",
      shortDescription: 'Poste de garde. Garde somnolent, bouclier en bois sur le mur. Nord vers le couloir, est vers l\'armurerie.',
    },
    'armory': {
      name: 'Armurerie',
      description: "Des râteliers d'armes et des armures soigneusement rangées tapissent les murs — équipement standard du château, mais bien entretenu. Des caisses de carreaux et de flèches sont empilées dans un coin. La pièce est vide de gardes — celui qui y était posté a abandonné son poste.",
      shortDescription: 'Armurerie. Râteliers d\'armes et armures. Pas d\'ennemis. Sortie à l\'ouest.',
    },
    'corridor': {
      name: 'Couloir Obscur',
      description: "Un passage étroit taillé dans la roche vive, dont le plafond est si bas que vous devez vous courber par endroits. Des torches vacillantes dans des supports de fer projettent des ombres mouvantes. L'endroit est calme — aucune garde ne patrouille ici. Un passage latéral s'ouvre à l'est, un autre à l'ouest, et le tunnel principal continue vers le nord.",
      shortDescription: 'Couloir étroit. Silencieux et vide. Est vers la salle de torture, ouest vers la caserne, nord plus loin.',
    },
    'barracks': {
      name: 'Caserne des Gardes',
      description: "Une pièce aux plafonds bas bordée de couchettes en bois brut, la plupart défaites et abandonnées à la hâte. Des manteaux et des effets personnels jonchent le sol — ceux qui dormaient ici sont partis précipitamment. Des armes et de l'équipement ont été éparpillés dans la précipitation ; quelque chose d'utile s'y trouve peut-être encore. Un escalier étroit mène au nord dans l'obscurité.",
      shortDescription: 'Caserne abandonnée. Couchettes vides, affaires éparpillées. Escalier au nord.',
    },
    'torture-chamber': {
      name: 'Salle de Torture',
      description: "L'estomac vous remonte en contemplant cette chambre. Des chevalets de fer, des chaînes boulonnées au plafond et d'autres instruments de souffrance encombrent l'espace. Des taches sombres marquent les dalles sous vos bottes. Un orque en tablier de cuir taché de sang lève les yeux de son travail, son expression passant de la surprise à la jubilation.",
      shortDescription: "Salle de torture. Instruments sinistres partout. L'orque tortionnaire est là.",
    },
    'undercroft': {
      name: 'Crypte Souterraine',
      description: "Une salle voûtée sous le château proprement dit. D'anciennes étagères de pierre supportent des crânes et des reliques en ruine. L'air est sec comme de l'os et sent la poussière et la vieille magie. Un squelette encapuchonné se tient immobile à l'autre bout — jusqu'à ce qu'il perçoive votre présence, et se retourne avec un claquement sec et sinistre. Un passage étroit mène à l'ouest ; des marches montent vers le nord.",
      shortDescription: 'Crypte souterraine. Vieux ossements, un squelette hostile. Ouest vers la crypte, nord en haut.',
    },
    'crypt': {
      name: 'Crypte Ancienne',
      description: "Une chambre funéraire oubliée, scellée pendant des siècles. Des sarcophages ornés mais décrépits tapissent les murs. Des toiles d'araignées épaisses comme des rideaux pendent du plafond. Au centre de la chambre se dresse un squelette en armure de plates complète, les orbites creuses brûlant d'une flamme bleue pâle. Il lève une épée aussi ancienne que le château lui-même.",
      shortDescription: 'Crypte ancienne. Un chevalier squelette garde cet endroit.',
    },
    'kitchen': {
      name: 'Cuisine du Château',
      description: "Chaude et enfumée, la cuisine du château sent la viande rôtie et la fumée de bois — un contraste saisissant avec le donjon en dessous. Des marmites de fer bouillonnent sur des feux rugissants. Des étagères de provisions tapissent les murs. Un cuisinier corpulent se retourne à votre entrée, attrapant un couperet. Il a l'air plus alarmé que sanguinaire — il pourrait reculer. Des passages mènent à l'est et à l'ouest de la grande salle.",
      shortDescription: 'Cuisine du château. Feux chauds, réserves de nourriture. Le cuisinier est là. Est vers le dortoir, ouest vers le bureau du sorcier.',
    },
    'great-hall': {
      name: 'Grande Salle',
      description: "Une salle magnifique réduite à une sinistre caserne. De longues tables de festin sont poussées contre les murs pour faire de la place aux combats. Des tapisseries décolorées dépeignent des batailles depuis longtemps oubliées. Debout au centre de la salle se trouve une silhouette en armure de plates noire — le champion du château. Il se retourne à votre approche, dégainant une épée à deux mains avec une lenteur délibérée et menaçante. \"Vous ne sortirez pas d'ici vivant\", dit-il. Des arches mènent à l'est vers la chapelle et à l'ouest vers les écuries.",
      shortDescription: 'Grande Salle. Le Chevalier Noir vous attend. Chapelle à l\'est, écuries à l\'ouest, corps de garde au nord.',
    },
    'gatehouse': {
      name: 'Corps de Garde',
      description: "Le corps de garde du château, froid et résonnant. Des meurtrières dans les épais murs donnent sur une cour gelée baignée de clair de lune. Une grande herse bloque la sortie au nord — mais le mécanisme de treuil est juste là. Un vétéran balafré en cotte de mailles s'avance, sa hallebarde pointée sur votre poitrine. \"Personne ne passe\", dit-il, avec la tranquille certitude d'un homme qui le pense vraiment.",
      shortDescription: 'Corps de garde. La herse et le Capitaine de la Porte se dressent entre vous et la liberté.',
    },
    'charnel-chamber': {
      name: "Chambre Charnelle",
      description: "Une chambre au plafond bas qui pue la poussière et la vieille mort. Des dalles fissurées sont jonchées des débris des âges — éclats de poterie, métal rouillé et ossements épars de ceux qui ne furent jamais récupérés. Dans deux coins séparés, des amas d'antiques restes commencent à s'agiter. Les os claquent et craquent tandis qu'ils se redressent, leurs orbites vides se tournant vers vous avec une lenteur terrible et implacable.",
      shortDescription: 'Chambre charnelle. Deux squelettes décrépits se lèvent des ossements. Sortie au sud.',
    },
    'chapel': { name: 'Chapelle du Château', description: '', shortDescription: '' },
    'stable': { name: 'Écuries du Château', description: '', shortDescription: '' },
    'dormitory': {
      name: 'Dortoir du Château',
      description: "De longues rangées de couchettes à deux niveaux remplissent ce dortoir, la plupart en désordre ou dépourvues de literie. Des effets personnels sont éparpillés sur le sol — dés à jouer, lettres, babioles bon marché. Pas entièrement abandonné : des soldats armés se lèvent déjà de leurs couchettes à votre intrusion, leurs mains se portant vers leurs armes.",
      shortDescription: '',
    },
    'wizard-office': {
      name: 'Bureau du Sorcier',
      description: "Un bureau encombré de bocaux en verre, de grimoires cornés et de cartes des étoiles épinglées de travers sur les murs. La puanteur de soufre et de vieux parchemin emplit la pièce. Un jeune homme en robes tachées d'encre se retourne brusquement d'un établi encombré, les yeux écarquillés — puis soudain féroces. Une puissance crépite visiblement au bout de ses doigts.",
      shortDescription: 'Bureau du sorcier. Étagères d\'arcanes. L\'apprenti est là. Sortie à l\'est.',
    },
  },
};

export const ROOM_DYNAMIC: Record<Locale, {
  chapel_ghost_desc: string; chapel_ghost_short: string;
  chapel_priest_desc: string; chapel_priest_short: string;
  stable_raider_desc: string; stable_raider_short: string;
  stable_empty_desc: string; stable_empty_short: string;
  dormitory_short_one: string; dormitory_short_two: string;
}> = {
  en: {
    chapel_ghost_desc: "The castle chapel has been abandoned for years, its once-holy air now thick with cold dread. Tattered velvet drapes the altar; candles have long since guttered to pools of black wax. Broken pews line the aisles. A translucent figure drifts from behind the altar, hollow eye sockets fixed upon you.",
    chapel_ghost_short: 'Castle chapel. Cold and abandoned. A wailing ghost haunts this place.',
    chapel_priest_desc: "The castle chapel is dim and suffocating, reeking of incense and something fouler underneath. Crude symbols have been scratched over every holy icon. A hollow-eyed priest in torn robes wheels about at your entry, clutching a mace and muttering dark scripture.",
    chapel_priest_short: 'Castle chapel. Defaced altars, dark scripture. A mad priest holds vigil here.',
    stable_raider_desc: "The stables smell of horse, manure, and danger. Empty stalls line the walls — the horses are long gone, spooked or stolen. In the shadows at the far end, a figure shifts. A raider steps forward, crossbow leveled. \"Turn around and no one gets hurt.\"",
    stable_raider_short: 'Castle stables. Empty horse stalls. A raider lurks in the shadows.',
    stable_empty_desc: "The stables smell of horse and old hay. Empty stalls line the walls — the horses are long gone. Feed sacks, tools, and abandoned equipment are stacked against the walls. Whoever fled this place left in a hurry.",
    stable_empty_short: 'Castle stables. Empty stalls, abandoned gear. No enemies.',
    dormitory_short_one: 'Castle dormitory. Rows of bunks. A soldier is here.',
    dormitory_short_two: 'Castle dormitory. Rows of bunks. Two soldiers are here.',
  },
  fr: {
    chapel_ghost_desc: "La chapelle du château est abandonnée depuis des années, son air autrefois sacré désormais chargé d'une froide terreur. Du velours en lambeaux drapait l'autel ; les chandelles se sont depuis longtemps éteintes en flaques de cire noire. Des bancs brisés bordent les allées. Une silhouette translucide dérive de derrière l'autel, ses orbites creuses fixées sur vous.",
    chapel_ghost_short: 'Chapelle du château. Froide et abandonnée. Un fantôme hurlant hante ces lieux.',
    chapel_priest_desc: "La chapelle du château est sombre et étouffante, empestant l'encens et quelque chose de plus fétide encore. Des symboles grossiers ont été griffonnés sur chaque icône sainte. Un prêtre aux yeux creux en robes déchirées se retourne à votre entrée, brandissant une masse et marmonnant de sombres écritures.",
    chapel_priest_short: 'Chapelle du château. Autels profanés, sombres écritures. Un prêtre fou veille ici.',
    stable_raider_desc: "Les écuries sentent le cheval, le fumier et quelque chose de plus dangereux. Des stalles vides tapissent les murs — les chevaux sont partis depuis longtemps, apeurés ou volés. Dans les ombres au fond, une silhouette bouge. Un pillard s'avance, arbalète levée. \"Faites demi-tour et personne ne sera blessé.\"",
    stable_raider_short: 'Écuries du château. Stalles vides. Un pillard se cache dans les ombres.',
    stable_empty_desc: "Les écuries sentent le cheval et le vieux foin. Des stalles vides tapissent les murs — les chevaux sont partis depuis longtemps. Des sacs de fourrage, des outils et de l'équipement abandonné sont empilés contre les murs. Ceux qui ont fui cet endroit l'ont fait à la hâte.",
    stable_empty_short: 'Écuries du château. Stalles vides, équipement abandonné. Pas d\'ennemis.',
    dormitory_short_one: 'Dortoir du château. Rangées de couchettes. Un soldat est là.',
    dormitory_short_two: 'Dortoir du château. Rangées de couchettes. Deux soldats sont là.',
  },
};

// ── Item text ──────────────────────────────────────────────────────────────

export interface ItemText { name: string; description: string; }

export const ITEM_TEXT: Record<Locale, Record<string, ItemText>> = {
  en: {
    'rusty-shiv':           { name: 'Rusty Shiv',                    description: 'A crude blade fashioned from a broken nail. Dangerous up close if nothing else is available.' },
    'dagger':               { name: 'Dagger',                         description: "A standard guard's dagger. Well-balanced and sharp." },
    'kitchen-knife':        { name: "Cook's Knife",                   description: 'A heavy cleaver meant for butchering, repurposed for butchering.' },
    'short-sword':          { name: 'Short Sword',                    description: 'A compact blade, perfectly balanced for close-quarters work.' },
    'hand-axe':             { name: 'Hand Axe',                       description: 'A sturdy hatchet, weighted for both throwing and melee.' },
    'longsword':            { name: 'Longsword',                      description: 'A finely forged blade. Heavy but lethal in practiced hands.' },
    'greatsword':           { name: "Dark Knight's Greatsword",       description: 'A massive two-handed sword, black as midnight. Engraved with fell runes that seem to drink in the light.' },
    'warhammer':            { name: 'Warhammer',                      description: 'A heavy hammer designed to crush through armor. Devastating against undead bones.' },
    'silver-sword':         { name: 'Silver Longsword',               description: 'A longsword with a silvered blade and holy sigils etched along the fuller. Bane of the undead.' },
    'enchanted-staff':      { name: 'Enchanted Staff',                description: 'A gnarled wooden staff crackling with barely contained arcane energy. Strikes with surprising force.' },
    'battle-axe':           { name: 'Battle Axe',                     description: 'A broad-bladed axe built for war. Heavy but punishing on every impact.' },
    'morning-star':         { name: 'Morning Star',                   description: 'A spiked iron ball on a wooden handle. Brutal and effective against armored foes.' },
    'iron-mace':            { name: 'Iron Mace',                      description: "A priest's mace — heavy and blunt, well-suited to smashing bone." },
    'halberd':              { name: 'Halberd',                        description: 'A long polearm with a broad axe-head and spike. Reach and power in one brutal package.' },
    'leather-armor':        { name: 'Leather Armor',                  description: 'Supple boiled leather. Offers protection without slowing you down.' },
    'chainmail':            { name: 'Chainmail Hauberk',              description: 'Interlocking iron rings. Heavy, but it has stopped many blades before.' },
    'plate-armor':          { name: "Dark Knight's Plate",            description: 'Blackened full plate etched with cursed runes. Imposing and nearly impenetrable.' },
    'wooden-shield':        { name: 'Wooden Shield',                  description: 'A round shield banded with iron strips. Battered but solid.' },
    'scale-armor':          { name: 'Scale Armor',                    description: 'Overlapping metal scales stitched to a leather backing. Better protection than chainmail, less weight than plate.' },
    'half-plate':           { name: 'Half-Plate Armor',              description: 'Heavy plate protecting the torso and arms, with chainmail below. Outstanding defense at the cost of speed.' },
    'blessed-shield':       { name: 'Blessed Shield',                 description: 'An iron-bossed shield marked with holy symbols. It seems to gleam faintly in the dark.' },
    'iron-shield':          { name: 'Iron Shield',                    description: 'A solid iron shield, dented from heavy use but utterly reliable.' },
    'health-potion':        { name: 'Health Potion',                  description: 'A small vial of ruby-red liquid. Warm to the touch. Restores 10 HP.' },
    'healing-herbs':        { name: 'Healing Herbs',                  description: 'A bundle of dried medicinal herbs. Chewing them slows bleeding and eases pain. Restores 4 HP.' },
    'bread-loaf':           { name: 'Stale Bread',                    description: 'Hard as a cobblestone and tasteless. Still, it is food. Restores 2 HP.' },
    'greater-health-potion':{ name: 'Greater Health Potion',          description: 'A large flask of vivid crimson liquid, warm to the touch. Closes wounds at remarkable speed. Restores 20 HP.' },
    'holy-water':           { name: 'Vial of Holy Water',             description: 'Blessed water in a sealed crystal vial. Drinkable in a pinch — faintly bitter, oddly restorative. Restores 6 HP.' },
    'rusty-key':            { name: 'Rusty Iron Key',                 description: 'A heavy iron key, thick with rust. It looks like it fits the lock on the cell door.' },
    'rope':                 { name: 'Coiled Rope',                    description: 'Thirty feet of hempen rope. Could be useful.' },
  },
  fr: {
    'rusty-shiv':           { name: 'Éclat Rouillé',                  description: "Une lame grossière faite d'un clou cassé. Dangereuse de près si rien d'autre n'est disponible." },
    'dagger':               { name: 'Dague',                           description: "La dague standard d'un garde. Bien équilibrée et aiguisée." },
    'kitchen-knife':        { name: 'Couteau de Cuisine',              description: "Un lourd couperet destiné à l'abattage, reconverti en arme." },
    'short-sword':          { name: 'Épée Courte',                     description: 'Une lame compacte, parfaitement équilibrée pour le combat rapproché.' },
    'hand-axe':             { name: 'Hachette',                        description: 'Une solide hachette, équilibrée pour le lancer comme pour le corps à corps.' },
    'longsword':            { name: 'Épée Longue',                     description: 'Une lame finement forgée. Lourde mais létale entre des mains entraînées.' },
    'greatsword':           { name: 'Épée à Deux Mains du Chevalier Noir', description: "Une massive épée à deux mains, noire comme la nuit. Gravée de runes maléfiques qui semblent boire la lumière." },
    'warhammer':            { name: 'Marteau de Guerre',               description: "Un lourd marteau conçu pour fracasser les armures. Dévastateur contre les ossements des morts-vivants." },
    'silver-sword':         { name: 'Épée Longue en Argent',           description: "Une épée longue à lame argentée et sigils saints gravés le long de la gouttière. Fléau des morts-vivants." },
    'enchanted-staff':      { name: 'Bâton Enchanté',                  description: "Un bâton de bois noueux crépitant d'énergie arcane à peine contenue. Frappe avec une force surprenante." },
    'battle-axe':           { name: 'Hache de Guerre',                 description: "Une hache à large lame conçue pour la guerre. Lourde mais implacable à chaque impact." },
    'morning-star':         { name: 'Fléau d\'Armes',                  description: "Une boule de fer hérissée de pointes sur un manche en bois. Brutal et efficace contre les adversaires en armure." },
    'iron-mace':            { name: 'Masse de Fer',                    description: "La masse d'un prêtre — lourde et contondante, bien adaptée pour briser les os." },
    'halberd':              { name: 'Hallebarde',                      description: "Une longue perche armée d'une large tête d'axe et d'une pointe. Portée et puissance en un seul outil brutal." },
    'leather-armor':        { name: 'Armure de Cuir',                  description: 'Du cuir bouilli souple. Offre une protection sans vous ralentir.' },
    'chainmail':            { name: 'Haubert de Cotte de Mailles',     description: "Des anneaux de fer entrelacés. Lourd, mais il a arrêté bien des lames avant vous." },
    'plate-armor':          { name: 'Armure de Plates du Chevalier Noir', description: "Armure de plates complète noircie gravée de runes maudites. Imposante et presque impénétrable." },
    'wooden-shield':        { name: 'Bouclier en Bois',                description: 'Un bouclier rond cerclé de bandes de fer. Cabossé mais solide.' },
    'scale-armor':          { name: "Armure d'Écailles",               description: "Des écailles métalliques superposées cousues sur un support de cuir. Mieux qu'une cotte de mailles, moins lourd que des plates." },
    'half-plate':           { name: 'Demi-Armure de Plates',           description: "Des plates lourdes protégeant le torse et les bras, avec une cotte de mailles en dessous. Défense exceptionnelle au détriment de la vitesse." },
    'blessed-shield':       { name: 'Bouclier Béni',                   description: "Un bouclier à ombilic de fer marqué de symboles saints. Il semble briller faiblement dans l'obscurité." },
    'iron-shield':          { name: 'Bouclier de Fer',                 description: "Un solide bouclier de fer, bosselé par un usage intensif mais absolument fiable." },
    'health-potion':        { name: 'Potion de Soin',                  description: "Une petite fiole de liquide rouge rubis. Chaude au toucher. Restaure 10 PV." },
    'healing-herbs':        { name: 'Herbes Médicinales',              description: "Un bouquet d'herbes médicinales séchées. Les mâcher ralentit le saignement et apaise la douleur. Restaure 4 PV." },
    'bread-loaf':           { name: 'Pain Rassis',                     description: "Dur comme un pavé et sans goût. C'est quand même de la nourriture. Restaure 2 PV." },
    'greater-health-potion':{ name: 'Grande Potion de Soin',           description: "Un grand flacon de liquide cramoisi vif, chaud au toucher. Referme les plaies à une vitesse remarquable. Restaure 20 PV." },
    'holy-water':           { name: "Fiole d'Eau Bénite",              description: "Eau bénite dans une fiole de cristal scellée. Buvable à la rigueur — légèrement amère, étrangement revitalisante. Restaure 6 PV." },
    'rusty-key':            { name: 'Clé de Fer Rouillée',             description: "Une lourde clé de fer, couverte de rouille. Elle semble convenir au verrou de la porte de la cellule." },
    'rope':                 { name: 'Corde Enroulée',                  description: "Neuf mètres de corde de chanvre. Pourrait être utile." },
  },
};

// ── Enemy text ─────────────────────────────────────────────────────────────

export interface EnemyText { name: string; description: string; }

export const ENEMY_TEXT: Record<Locale, Record<string, EnemyText>> = {
  en: {
    'guard':             { name: 'Castle Guard',          description: 'A human soldier in leather armor, hand on his sword. He looks groggy — you may have caught him mid-nap.' },
    'skeleton':          { name: 'Skeleton',              description: 'A reanimated skeleton, its bones yellowed and cracked. Empty eye sockets regard you with cold malice.' },
    'orc_torturer':      { name: 'Orc Torturer',          description: 'A broad-shouldered orc in a filthy leather apron, gripping a spiked club. He grins at your arrival.' },
    'skeleton_knight':   { name: 'Skeleton Knight',       description: 'An ancient warrior entombed here centuries ago, still standing guard in crumbling plate armor. Blue flames burn in its visor.' },
    'cook':              { name: 'Castle Cook',           description: 'A heavyset man in a stained apron, cleaver already raised. "Back to your cell, wretch!"' },
    'dark_knight':       { name: 'Dark Knight',           description: 'The castle\'s champion, clad head-to-toe in black plate. He draws a massive greatsword and his voice rumbles: "You\'ll not leave here alive."' },
    'gate_captain':      { name: 'Gate Captain',          description: '"Nobody passes," he says flatly.' },
    'weak_skeleton':     { name: 'Decrepit Skeleton',     description: 'A crumbling skeleton with barely any bones intact. It shambles toward you with ancient malice, arms outstretched.' },
    'ghost':             { name: 'Wailing Ghost',         description: 'A translucent figure drifts from the shadows, hollow mouth open in a silent scream. Cold radiates from its form.' },
    'mad_priest':        { name: 'Mad Priest',            description: 'A hollow-eyed cleric in tattered robes, babbling dark scripture and clutching a bloodstained mace. His faith has curdled into something terrible.' },
    'wizard_apprentice': { name: "Wizard's Apprentice",   description: 'A young man in ink-stained robes clutching a gnarled staff. His eyes flash with panic — and dangerous power.' },
    'stable_raider':     { name: 'Stable Raider',         description: 'A brigand who has taken shelter in the stables, armed and desperate. He levels a crossbow at you from the shadows.' },
    'dormitory_soldier': { name: 'Castle Soldier',        description: 'An armed soldier caught resting in the dormitory. He scrambles to his feet, sword already in hand.' },
  },
  fr: {
    'guard':             { name: 'Garde du Château',       description: "Un soldat humain en armure de cuir, la main sur son épée. Il a l'air groggy — vous l'avez peut-être surpris en plein somme." },
    'skeleton':          { name: 'Squelette',              description: 'Un squelette réanimé, ses os jaunis et fissurés. Des orbites vides vous regardent avec une froide malveillance.' },
    'orc_torturer':      { name: 'Orque Tortionnaire',     description: "Un orque aux larges épaules dans un tablier de cuir crasseux, serrant une masse hérissée de pointes. Il sourit à votre arrivée." },
    'skeleton_knight':   { name: 'Chevalier Squelette',    description: "Un ancien guerrier enterré ici il y a des siècles, encore debout en armure de plates croulante. Des flammes bleues brûlent dans sa visière." },
    'cook':              { name: 'Cuisinier du Château',   description: "Un homme corpulent dans un tablier taché, son couperet déjà levé. \"Retournez dans votre cellule, misérable !\"" },
    'dark_knight':       { name: 'Chevalier Noir',         description: "Le champion du château, vêtu de la tête aux pieds de plates noires. Il dégaine une massive épée à deux mains, sa voix gronde : \"Vous ne sortirez pas d'ici vivant.\"" },
    'gate_captain':      { name: 'Capitaine de la Porte',  description: "\"Personne ne passe\", dit-il platement." },
    'weak_skeleton':     { name: 'Squelette Décrépit',     description: "Un squelette en miettes avec à peine quelques os intacts. Il se traîne vers vous avec une malveillance ancienne, les bras tendus." },
    'ghost':             { name: 'Fantôme Hurlant',        description: "Une silhouette translucide dérive des ombres, la bouche creuse ouverte dans un cri silencieux. Le froid irradie de sa forme." },
    'mad_priest':        { name: 'Prêtre Fou',             description: "Un clerc aux yeux creux en robes déchirées, marmonnant de sombres écritures et brandissant une masse ensanglantée. Sa foi a tourné en quelque chose de terrible." },
    'wizard_apprentice': { name: 'Apprenti Sorcier',       description: "Un jeune homme en robes tachées d'encre brandissant un bâton noueux. Ses yeux brillent de panique — et d'un pouvoir dangereux." },
    'stable_raider':     { name: 'Pillard des Écuries',    description: "Un brigand réfugié dans les écuries, armé et désespéré. Il braque une arbalète sur vous depuis les ombres." },
    'dormitory_soldier': { name: 'Soldat du Château',      description: "Un soldat armé surpris en train de se reposer dans le dortoir. Il se lève d'un bond, son épée déjà en main." },
  },
};

// ── Body-part labels ───────────────────────────────────────────────────────

export const BODY_LABELS: Record<Locale, Record<string, string>> = {
  en: { head: 'Head', chest: 'Chest', rightArm: 'Right Arm', leftArm: 'Left Arm', rightLeg: 'Right Leg', leftLeg: 'Left Leg' },
  fr: { head: 'Tête', chest: 'Poitrine', rightArm: 'Bras Droit', leftArm: 'Bras Gauche', rightLeg: 'Jambe Droite', leftLeg: 'Jambe Gauche' },
};

// ── Message translations ───────────────────────────────────────────────────

export interface T {
  langSelect: { prompt: string; invalid: string; };
  intro: { banner: string; title: string; flavor: [string, string, string]; hint: string; };
  room: {
    exits: string;
    exitLabel: string;
    itemsNotice: (names: string) => string;
    searchHint: string;
  };
  nav: {
    inCombat: string;
    unknown: (target: string) => string;
    noExit: (dir: string) => string;
    nowhere: string;
    unlock: string;
    victory: [string, string, string, string];
    victoryXP: (xp: number) => string;
  };
  sneak: {
    inCombat: string; noTarget: string; unknown: (t: string) => string;
    roll: (r: number, m: number, tot: number, dc: number) => string;
    successEnemy: (room: string) => string; successEmpty: (room: string) => string;
    failSpotted: string; failSurprise: (name: string) => string;
    failReact: (name: string) => string; failRecover: string; failNoOne: string; exitHint: string;
  };
  examine: { what: string; notFound: (q: string) => string; injuries: string; };
  take: { what: string; notHere: (q: string) => string; pickup: (n: string) => string; };
  drop: { what: string; notCarrying: (q: string) => string; drop: (n: string) => string; };
  inv: {
    equippedHeader: string; weapon: string; offhand: string; armor: string;
    none: string; carriedHeader: string; empty: string;
  };
  equip: {
    what: string; notCarrying: (q: string) => string;
    cant: (n: string) => string; done: (n: string, detail: string) => string;
    damageLabel: string;
  };
  unequip: { notFound: (q: string) => string; done: (n: string) => string; };
  use: {
    what: string; notCarrying: (q: string) => string;
    cant: (n: string) => string; heal: (n: string, hp: number, cur: number, max: number) => string;
  };
  search: {
    nothing: string; already: string; searching: string;
    found: (names: string) => string; nothingElse: string;
  };
  stats: {
    header: string; hp: (hp: number, max: number) => string; acxp: (ac: number, xp: number) => string;
    attr: (str: number, sm: number, dex: number, dm: number) => string;
    atk: (bonus: string, dmg: string) => string; hint: string; divider: string;
  };
  help: string[];
  combat: {
    startSneak: (name: string, part: string) => string;
    startNormal: (name: string, part: string) => string;
    noTarget: string; notIn: string; doubleStrike: string;
    playerMiss: (part: string) => string;
    playerHit: (pre: string, name: string, part: string, dmg: number, roll: number, snk: string, ac: number) => string;
    playerNearMiss: (part: string, roll: number, snk: string, ac: number) => string;
    stun: (name: string) => string; cantAttack: (name: string) => string;
    enemyFumble: (name: string) => string;
    enemyHit: (pre: string, name: string, dmg: number, roll: number) => string;
    enemyMiss: (name: string, roll: number, ac: number) => string;
    playerDeath: string; gameOver: string; gameOverHint: string;
    enemyFalls: (name: string) => string; xpGain: (xp: number) => string;
    drops: (names: string) => string; nextAgg: (name: string) => string;
    levelUp: (gain: number, max: number) => string;
    critical: string; surprise: string;
  };
  bodyFx: {
    head: (name: string) => string; chest: (name: string) => string;
    rightArmWounded: (name: string) => string; rightArmDisabled: (name: string) => string;
    leftArmWounded: (name: string) => string; leftArmDisabled: (name: string) => string;
    legWounded: (name: string, lbl: string) => string;
    legBothCrippled: (name: string, lbl: string) => string;
    legCrippled: (name: string, lbl: string) => string;
    alreadyDamaged: (name: string, lbl: string) => string;
  };
  flee: { notIn: string; fail: string; success: string; nowhere: string; };
  agg: { first: (name: string) => string; resume: (name: string) => string; };
  hp: { healthy: string; hurt: string; badly: string; nearDeath: string; };
  ui: {
    look: string; flee: string; stats: string; help: string; inventory: string;
    search: string; theExit: string; sneak: string; attack: string; equip: string;
    use: string; take: string;
    health: string; ac: string; xp: string; weapon: string; location: string;
    bareHands: string; combatBadge: string; exploringBadge: string;
    hiddenBadge: string; escapedBadge: string; deadBadge: string;
    fightingLabel: string; stunned: string; disarmed: string; crippled: string;
    placeholder: string;
  };
  unknownCmd: (raw: string) => string;
}

// ── English ────────────────────────────────────────────────────────────────

const en: T = {
  langSelect: {
    prompt: '═══════════════════════════════════════════════════════════\n       Choose your language / Choisissez votre langue\n═══════════════════════════════════════════════════════════\n  Type "english" or "french" to begin.\n  Tapez "english" ou "french" pour commencer.',
    invalid: 'Please type "english" or "french" — Tapez "english" ou "french".',
  },
  intro: {
    banner: '═══════════════════════════════════════════════════════════',
    title: '              DUNGEON OF CASTLE MORDENTHAL',
    flavor: [
      'The year is 1423. You have been imprisoned in the dungeons of Castle Mordenthal.',
      'Tonight the guard outside has gone silent, and no one has brought your rations.',
      'This may be your only chance to escape.',
    ],
    hint: 'Type "help" for commands, or "look" to examine your surroundings.',
  },
  room: {
    exits: 'Exits',
    exitLabel: 'THE EXIT',
    itemsNotice: (names) => `You notice: ${names}.`,
    searchHint: 'This place looks like it might be worth searching more carefully.',
  },
  nav: {
    inCombat: 'You cannot move while in combat! Use "flee" to escape.',
    unknown: (t) => `Don't know where "${t}" is from here.`,
    noExit: (d) => `There is no exit to the ${d}.`,
    nowhere: 'That way leads nowhere.',
    unlock: 'You unlock the door with the rusty key.',
    victory: [
      'You crank the portcullis winch with shaking arms. The iron gate groans upward.',
      'Beyond it: open air. A frozen courtyard. The road out.',
      'You walk through — and keep walking, leaving Castle Mordenthal behind forever.',
      '\n★  VICTORY  ★  You have escaped the dungeon!',
    ],
    victoryXP: (xp) => `Final XP: ${xp}`,
  },
  sneak: {
    inCombat: 'You cannot sneak while in combat! Use "flee" to escape.',
    noTarget: 'Sneak where? Specify a destination.',
    unknown: (t) => `You don't know the way to "${t}".`,
    roll: (r, m, tot, dc) => `You move stealthily… (DEX check: rolled ${r} ${m >= 0 ? '+' : ''}${m} = ${tot} vs DC ${dc})`,
    successEnemy: (room) => `You slip into the ${room} without a sound. The enemy hasn't spotted you — strike first or back away!`,
    successEmpty: (room) => `You slip quietly into the ${room}.`,
    failSpotted: "Your foot scrapes stone — you're spotted!",
    failSurprise: (name) => `The ${name} reacts instantly!`,
    failReact: (name) => `The ${name} gets a surprise attack!`,
    failRecover: 'You recover your footing. Fight back!',
    failNoOne: 'You stumble on entry but there is no one here to notice.',
    exitHint: 'The exit is right there — no need to sneak, just go!',
  },
  examine: {
    what: 'Examine what?',
    notFound: (q) => `You don't see anything called "${q}" here.`,
    injuries: 'Injuries',
  },
  take: {
    what: 'Take what?',
    notHere: (q) => `There is no "${q}" here to take.`,
    pickup: (n) => `You pick up the ${n}.`,
  },
  drop: {
    what: 'Drop what?',
    notCarrying: (q) => `You're not carrying any "${q}".`,
    drop: (n) => `You drop the ${n}.`,
  },
  inv: {
    equippedHeader: '── Equipped ──────────────────',
    weapon: 'Weapon ',
    offhand: 'Offhand',
    armor: 'Armor  ',
    none: '(none)',
    carriedHeader: '── Carried ────────────────────',
    empty: 'Your pack is empty.',
  },
  equip: {
    what: 'Equip what?',
    notCarrying: (q) => `You're not carrying any "${q}".`,
    cant: (n) => `The ${n} cannot be equipped.`,
    done: (n, detail) => `You equip the ${n}.${detail}`,
    damageLabel: 'damage',
  },
  unequip: {
    notFound: (q) => `Nothing equipped matches "${q}".`,
    done: (n) => `You unequip the ${n}.`,
  },
  use: {
    what: 'Use what?',
    notCarrying: (q) => `You're not carrying any "${q}".`,
    cant: (n) => `You can't use the ${n} that way.`,
    heal: (n, hp, cur, max) => `You use the ${n} and recover ${hp} HP. (${cur}/${max})`,
  },
  search: {
    nothing: 'You search carefully but find nothing unusual.',
    already: 'You have already searched this area thoroughly.',
    searching: 'You search the area carefully...',
    found: (names) => `You find: ${names}!`,
    nothingElse: 'Nothing else of note.',
  },
  stats: {
    header: '── Character ─────────────────',
    hp: (hp, max) => `HP  : ${hp} / ${max}`,
    acxp: (ac, xp) => `AC  : ${ac}   XP: ${xp}`,
    attr: (s, sm, d, dm) => `STR ${s} (${sm >= 0 ? '+' : ''}${sm})  DEX ${d} (${dm >= 0 ? '+' : ''}${dm})`,
    atk: (bonus, dmg) => `ATK : ${bonus} to hit, ${dmg} dmg`,
    hint: 'Body-part targeting: attack [head|chest|right arm|left arm|right leg|left leg]',
    divider: '──────────────────────────────',
  },
  help: [
    '── Commands ──────────────────────────────────────',
    '  look / l                — describe current room',
    '  go [place/direction]    — move to adjacent room',
    '  sneak [place]           — move stealthily (DEX vs DC 13)',
    '    Success → you go first; Fail → enemy strikes before you',
    '  examine [target]        — inspect item or enemy',
    '  take [item]             — pick up an item',
    '  drop [item]             — drop an item',
    '  inventory / i           — show inventory',
    '  equip [item]            — equip weapon/armor',
    '  unequip [item]          — remove equipped item',
    '  use [item]              — consume a potion or food',
    '  search                  — search for hidden items',
    '  stats                   — show character stats',
    '── In Combat ─────────────────────────────────────',
    '  attack [body part]      — strike head/chest/right arm/left arm/right leg/left leg',
    '  flee                    — attempt to escape',
    '  use [item]              — consume during combat (enemy retaliates)',
    '── Body-Part Effects ─────────────────────────────',
    '  Head     : -4 to hit, x1.6 dmg, stuns target',
    '  Chest    : balanced, no special effect',
    '  Right Arm: -2 to hit, wounds/disables sword arm → enemy loses attack',
    '  Left Arm : -2 to hit, wounds/disables guard arm → enemy loses AC',
    '  Legs     : -2 to hit, wounds → can\'t flee, disables → stumbles (-2 AC)',
    '──────────────────────────────────────────────────',
  ],
  combat: {
    startSneak: (name, part) => `You strike from the shadows at the ${name}'s ${part}! (First Strike: +4 to hit)`,
    startNormal: (name, part) => `You charge at the ${name}, aiming for the ${part}!`,
    noTarget: 'There is no one to attack here.',
    notIn: 'You are not in combat.',
    doubleStrike: 'You press the advantage — a second strike from the shadows!',
    playerMiss: (part) => `You aim for the ${part} and miss completely! (rolled 1)`,
    playerHit: (pre, name, part, dmg, roll, snk, ac) => `${pre}You hit the ${name}'s ${part} for ${dmg} damage! (rolled ${roll}${snk} vs AC ${ac})`,
    playerNearMiss: (part, roll, snk, ac) => `You aim for the ${part} but miss. (rolled ${roll}${snk} vs AC ${ac})`,
    stun: (name) => `The ${name} shakes off the stun — they missed their attack!`,
    cantAttack: (name) => `The ${name} cannot attack — too badly injured!`,
    enemyFumble: (name) => `The ${name} swings wildly — a fumble! (rolled 1)`,
    enemyHit: (pre, name, dmg, roll) => `${pre}The ${name} hits you for ${dmg} damage! (rolled ${roll})`,
    enemyMiss: (name, roll, ac) => `The ${name} attacks but fails to connect. (rolled ${roll} vs AC ${ac})`,
    playerDeath: '\nYour vision darkens. The cold stone rushes up to meet you.',
    gameOver: '★  GAME OVER  ★  You have been defeated.',
    gameOverHint: 'Press "New Game" to start over.',
    enemyFalls: (name) => `The ${name} falls, defeated.`,
    xpGain: (xp) => `+${xp} XP`,
    drops: (names) => `Dropped: ${names}.`,
    nextAgg: (name) => `The ${name} moves to attack!`,
    levelUp: (gain, max) => `★ You grow stronger! Max HP +${gain} → ${max}`,
    critical: '★ Critical! ',
    surprise: '🗡 Surprise Strike! ',
  },
  bodyFx: {
    head: (name) => `You strike the ${name} across the head — they reel, STUNNED, and will skip their next attack!`,
    chest: (name) => `A solid blow to the ${name}'s chest!`,
    rightArmWounded: (name) => `You slash the ${name}'s right arm! They wield their weapon with -3 to attack!`,
    rightArmDisabled: (name) => `You sever the ${name}'s sword arm! They can no longer attack!`,
    leftArmWounded: (name) => `You wound the ${name}'s left arm — their guard drops (-1 AC)!`,
    leftArmDisabled: (name) => `You disable the ${name}'s left arm! They can barely defend themselves (-2 AC)!`,
    legWounded: (name, lbl) => `You gash the ${name}'s ${lbl} — they cannot flee!`,
    legBothCrippled: (name, lbl) => `You cripple the ${name}'s ${lbl}! With both legs gone, they collapse to the ground!`,
    legCrippled: (name, lbl) => `You cripple the ${name}'s ${lbl}! They stumble badly (-2 AC) and cannot flee!`,
    alreadyDamaged: (name, lbl) => `The ${name}'s ${lbl} is already badly damaged.`,
  },
  flee: {
    notIn: 'You are not in combat.',
    fail: 'You try to flee but cannot break away!',
    success: 'You manage to break free and retreat!',
    nowhere: 'Nowhere to run!',
  },
  agg: {
    first: (name) => `The ${name} lunges at you! Combat begins!`,
    resume: (name) => `The ${name} turns on you again — combat resumes!`,
  },
  hp: { healthy: 'Healthy', hurt: 'Hurt', badly: 'Badly Wounded', nearDeath: 'Near Death' },
  ui: {
    look: '👁 Look', flee: '🏃 Flee', stats: '📊 Stats', help: '❓ Help',
    inventory: '📦 Inventory', search: '🔍 Search', theExit: 'THE EXIT ★',
    sneak: '🤫 Sneak', attack: '⚔ Attack', equip: '🗡 Equip', use: '🧪', take: '🎒',
    health: 'HEALTH', ac: 'AC', xp: 'XP', weapon: 'WEAPON', location: 'LOCATION',
    bareHands: 'Bare Hands', combatBadge: '⚔ COMBAT', exploringBadge: '◉ EXPLORING',
    hiddenBadge: '🤫 HIDDEN', escapedBadge: '★ ESCAPED', deadBadge: '✕ DEAD',
    fightingLabel: '⚔ FIGHTING', stunned: 'STUNNED', disarmed: 'DISARMED', crippled: 'CRIPPLED',
    placeholder: 'Enter a command…  (↑↓ for history)',
  },
  unknownCmd: (raw) => `Unknown command: "${raw}". Type "help" for commands.`,
};

// ── French ─────────────────────────────────────────────────────────────────

const fr: T = {
  langSelect: {
    prompt: '═══════════════════════════════════════════════════════════\n       Choose your language / Choisissez votre langue\n═══════════════════════════════════════════════════════════\n  Type "english" or "french" to begin.\n  Tapez "english" ou "french" pour commencer.',
    invalid: 'Please type "english" or "french" — Tapez "english" ou "french".',
  },
  intro: {
    banner: '═══════════════════════════════════════════════════════════',
    title: "          DONJON DU CHÂTEAU MORDENTHAL",
    flavor: [
      "Nous sommes en 1423. Vous avez été emprisonné dans les donjons du Château Mordenthal.",
      "Cette nuit, le garde dehors s'est tu, et personne n'a apporté vos rations.",
      "C'est peut-être votre seule chance de vous évader.",
    ],
    hint: 'Tapez "aide" pour les commandes, ou "regarder" pour examiner vos environs.',
  },
  room: {
    exits: 'Sorties',
    exitLabel: 'LA SORTIE',
    itemsNotice: (names) => `Vous remarquez : ${names}.`,
    searchHint: 'Cet endroit mérite peut-être une fouille plus approfondie.',
  },
  nav: {
    inCombat: 'Vous ne pouvez pas vous déplacer en combat ! Utilisez "fuir" pour vous échapper.',
    unknown: (t) => `Vous ne savez pas où mène "${t}" d'ici.`,
    noExit: (d) => `Il n'y a pas de sortie vers le ${d}.`,
    nowhere: 'Ce chemin ne mène nulle part.',
    unlock: 'Vous déverrouillez la porte avec la vieille clé rouillée.',
    victory: [
      "Vous actionnez le treuil de la herse avec des bras tremblants. La grille de fer grince en remontant.",
      "Au-delà : l'air libre. Une cour gelée. La route vers la liberté.",
      "Vous franchissez la porte — et continuez à marcher, laissant le Château Mordenthal derrière vous pour toujours.",
      "\n★  VICTOIRE  ★  Vous avez quitté le donjon !",
    ],
    victoryXP: (xp) => `XP final : ${xp}`,
  },
  sneak: {
    inCombat: 'Vous ne pouvez pas vous faufiler en combat ! Utilisez "fuir" pour vous échapper.',
    noTarget: 'Se faufiler où ? Précisez une destination.',
    unknown: (t) => `Vous ne connaissez pas le chemin vers "${t}".`,
    roll: (r, m, tot, dc) => `Vous vous déplacez furtivement… (test DEX : lancé ${r} ${m >= 0 ? '+' : ''}${m} = ${tot} contre DC ${dc})`,
    successEnemy: (room) => `Vous vous glissez dans ${room} sans bruit. L'ennemi ne vous a pas repéré — frappez en premier ou reculez !`,
    successEmpty: (room) => `Vous vous glissez silencieusement dans ${room}.`,
    failSpotted: "Votre pied racle la pierre — vous êtes repéré !",
    failSurprise: (name) => `${name} réagit instantanément !`,
    failReact: (name) => `${name} vous attaque par surprise !`,
    failRecover: 'Vous retrouvez votre équilibre. Battez-vous !',
    failNoOne: "Vous trébuchez à l'entrée mais il n'y a personne pour le remarquer.",
    exitHint: 'La sortie est juste là — inutile de vous faufiler, avancez !',
  },
  examine: {
    what: 'Examiner quoi ?',
    notFound: (q) => `Vous ne voyez rien qui s'appelle "${q}" ici.`,
    injuries: 'Blessures',
  },
  take: {
    what: 'Prendre quoi ?',
    notHere: (q) => `Il n'y a pas de "${q}" ici à prendre.`,
    pickup: (n) => `Vous ramassez ${n}.`,
  },
  drop: {
    what: 'Déposer quoi ?',
    notCarrying: (q) => `Vous ne transportez pas de "${q}".`,
    drop: (n) => `Vous déposez ${n}.`,
  },
  inv: {
    equippedHeader: '── Équipé ────────────────────',
    weapon: 'Arme   ',
    offhand: 'Bouclier',
    armor: 'Armure  ',
    none: '(aucun)',
    carriedHeader: '── Porté ─────────────────────',
    empty: 'Votre sac est vide.',
  },
  equip: {
    what: 'Équiper quoi ?',
    notCarrying: (q) => `Vous ne transportez pas de "${q}".`,
    cant: (n) => `${n} ne peut pas être équipé.`,
    done: (n, detail) => `Vous équipez ${n}.${detail}`,
    damageLabel: 'dégâts',
  },
  unequip: {
    notFound: (q) => `Rien d'équipé ne correspond à "${q}".`,
    done: (n) => `Vous retirez ${n}.`,
  },
  use: {
    what: 'Utiliser quoi ?',
    notCarrying: (q) => `Vous ne transportez pas de "${q}".`,
    cant: (n) => `Vous ne pouvez pas utiliser ${n} de cette façon.`,
    heal: (n, hp, cur, max) => `Vous utilisez ${n} et récupérez ${hp} PV. (${cur}/${max})`,
  },
  search: {
    nothing: 'Vous cherchez avec soin mais ne trouvez rien d\'inhabituel.',
    already: 'Vous avez déjà fouillé cet endroit en détail.',
    searching: 'Vous fouilllez la zone soigneusement...',
    found: (names) => `Vous trouvez : ${names} !`,
    nothingElse: "Rien d'autre d'intéressant.",
  },
  stats: {
    header: '── Personnage ────────────────',
    hp: (hp, max) => `PV  : ${hp} / ${max}`,
    acxp: (ac, xp) => `CA  : ${ac}   XP: ${xp}`,
    attr: (s, sm, d, dm) => `FOR ${s} (${sm >= 0 ? '+' : ''}${sm})  DEX ${d} (${dm >= 0 ? '+' : ''}${dm})`,
    atk: (bonus, dmg) => `ATQ : ${bonus} pour toucher, ${dmg} dégâts`,
    hint: 'Ciblage : attaquer [tête|poitrine|bras droit|bras gauche|jambe droite|jambe gauche]',
    divider: '──────────────────────────────',
  },
  help: [
    '── Commandes ─────────────────────────────────────',
    '  regarder / r             — décrire la salle actuelle',
    '  aller [lieu/direction]   — se déplacer vers une salle adjacente',
    '  se faufiler [lieu]       — se déplacer furtivement (DEX vs DC 13)',
    '    Succès → vous agissez en premier ; Échec → l\'ennemi frappe avant vous',
    '  examiner [cible]         — inspecter un objet ou un ennemi',
    '  prendre [objet]          — ramasser un objet',
    '  deposer [objet]          — déposer un objet',
    '  inventaire / inv         — afficher l\'inventaire',
    '  equiper [objet]          — équiper une arme/armure',
    '  retirer [objet]          — enlever un objet équipé',
    '  utiliser [objet]         — consommer une potion ou de la nourriture',
    '  fouiller                 — fouiller les objets cachés',
    '  statistiques             — afficher les statistiques du personnage',
    '── En Combat ─────────────────────────────────────',
    '  attaquer [partie du corps] — frapper tête/poitrine/bras droit/bras gauche/jambe droite/jambe gauche',
    '  fuir                     — tenter de s\'échapper',
    '  utiliser [objet]         — consommer en combat (l\'ennemi riposte)',
    '── Effets des Parties du Corps ───────────────────',
    '  Tête        : -4 pour toucher, x1.6 dégâts, étourdis la cible',
    '  Poitrine    : équilibré, pas d\'effet spécial',
    '  Bras Droit  : -2 pour toucher, blesse/désactive le bras armé → l\'ennemi perd son attaque',
    '  Bras Gauche : -2 pour toucher, blesse/désactive le bras bouclier → l\'ennemi perd de la CA',
    '  Jambes      : -2 pour toucher, blesse → ne peut fuir, désactive → trébuche (-2 CA)',
    '──────────────────────────────────────────────────',
  ],
  combat: {
    startSneak: (name, part) => `Vous frappez depuis les ombres la ${part} de ${name} ! (Frappe surprise : +4 pour toucher)`,
    startNormal: (name, part) => `Vous chargez ${name} en visant ${part} !`,
    noTarget: "Il n'y a personne à attaquer ici.",
    notIn: "Vous n'êtes pas en combat.",
    doubleStrike: "Vous exploitez l'avantage — une deuxième frappe depuis les ombres !",
    playerMiss: (part) => `Vous visez ${part} et ratez complètement ! (lancé 1)`,
    playerHit: (pre, name, part, dmg, roll, snk, ac) => `${pre}Vous touchez ${part} de ${name} pour ${dmg} dégâts ! (lancé ${roll}${snk} contre CA ${ac})`,
    playerNearMiss: (part, roll, snk, ac) => `Vous visez ${part} mais ratez. (lancé ${roll}${snk} contre CA ${ac})`,
    stun: (name) => `${name} se remet de l'étourdissement — son attaque est manquée !`,
    cantAttack: (name) => `${name} ne peut pas attaquer — trop grièvement blessé !`,
    enemyFumble: (name) => `${name} frappe dans le vide — un raté ! (lancé 1)`,
    enemyHit: (pre, name, dmg, roll) => `${pre}${name} vous frappe pour ${dmg} dégâts ! (lancé ${roll})`,
    enemyMiss: (name, roll, ac) => `${name} attaque mais n'arrive pas à toucher. (lancé ${roll} contre CA ${ac})`,
    playerDeath: '\nVotre vision s\'obscurcit. La pierre froide se précipite à votre rencontre.',
    gameOver: '★  PARTIE TERMINÉE  ★  Vous avez été vaincu.',
    gameOverHint: 'Appuyez sur "Nouvelle Partie" pour recommencer.',
    enemyFalls: (name) => `${name} tombe, vaincu.`,
    xpGain: (xp) => `+${xp} XP`,
    drops: (names) => `Lâché : ${names}.`,
    nextAgg: (name) => `${name} passe à l'attaque !`,
    levelUp: (gain, max) => `★ Vous devenez plus fort ! PV max +${gain} → ${max}`,
    critical: '★ Critique ! ',
    surprise: '🗡 Frappe Surprise ! ',
  },
  bodyFx: {
    head: (name) => `Vous frappez ${name} à la tête — il vacille, ÉTOURDI, et ratera sa prochaine attaque !`,
    chest: (name) => `Un coup solide à la poitrine de ${name} !`,
    rightArmWounded: (name) => `Vous tailladez le bras droit de ${name} ! Il manie son arme avec -3 pour toucher !`,
    rightArmDisabled: (name) => `Vous sectionnez le bras armé de ${name} ! Il ne peut plus attaquer !`,
    leftArmWounded: (name) => `Vous blessez le bras gauche de ${name} — sa garde s'abaisse (-1 CA) !`,
    leftArmDisabled: (name) => `Vous désactivez le bras gauche de ${name} ! Il peut à peine se défendre (-2 CA) !`,
    legWounded: (name, lbl) => `Vous entaillez la ${lbl} de ${name} — il ne peut plus fuir !`,
    legBothCrippled: (name, lbl) => `Vous estropiez la ${lbl} de ${name} ! Avec les deux jambes hors combat, il s'effondre !`,
    legCrippled: (name, lbl) => `Vous estropiez la ${lbl} de ${name} ! Il trébuche violemment (-2 CA) et ne peut plus fuir !`,
    alreadyDamaged: (name, lbl) => `La ${lbl} de ${name} est déjà gravement endommagée.`,
  },
  flee: {
    notIn: "Vous n'êtes pas en combat.",
    fail: 'Vous tentez de fuir mais ne pouvez pas vous dégager !',
    success: 'Vous parvenez à vous libérer et à battre en retraite !',
    nowhere: 'Nulle part où fuir !',
  },
  agg: {
    first: (name) => `${name} se jette sur vous ! Le combat commence !`,
    resume: (name) => `${name} se retourne contre vous — le combat reprend !`,
  },
  hp: { healthy: 'En bonne santé', hurt: 'Blessé', badly: 'Grièvement blessé', nearDeath: 'Moribond' },
  ui: {
    look: '👁 Regarder', flee: '🏃 Fuir', stats: '📊 Stats', help: '❓ Aide',
    inventory: '📦 Inventaire', search: '🔍 Fouiller', theExit: 'LA SORTIE ★',
    sneak: '🤫 Se Faufiler', attack: '⚔ Attaquer', equip: '🗡 Équiper', use: '🧪', take: '🎒',
    health: 'SANTÉ', ac: 'CA', xp: 'XP', weapon: 'ARME', location: 'LIEU',
    bareHands: 'Mains Nues', combatBadge: '⚔ COMBAT', exploringBadge: '◉ EXPLORATION',
    hiddenBadge: '🤫 CACHÉ', escapedBadge: '★ ÉVADÉ', deadBadge: '✕ MORT',
    fightingLabel: '⚔ COMBAT', stunned: 'ÉTOURDI', disarmed: 'DÉSARMÉ', crippled: 'ESTROPIÉ',
    placeholder: 'Entrez une commande…  (↑↓ pour l\'historique)',
  },
  unknownCmd: (raw) => `Commande inconnue : "${raw}". Tapez "aide" pour les commandes.`,
};

export const translations: Record<Locale, T> = { en, fr };
export function getT(locale: Locale): T { return translations[locale]; }
