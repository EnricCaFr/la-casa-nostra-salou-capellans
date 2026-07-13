import { Injectable, signal } from '@angular/core';
import { AllergenTag, Category, MenuItem } from './models';

export type LanguageCode = 'es' | 'ca' | 'en' | 'fr' | 'de' | 'it' | 'pt' | 'nl' | 'ru';

type TranslationKey =
  | 'nav.home' | 'nav.menu' | 'nav.schedule' | 'nav.contact' | 'nav.openMenu'
  | 'home.claim' | 'home.viewMenu' | 'home.howToArrive' | 'home.aboutEyebrow' | 'home.aboutTitle' | 'home.description'
  | 'home.featuredEyebrow' | 'home.featuredTitle' | 'home.menuEyebrow' | 'home.categoriesTitle'
  | 'home.experienceTitle' | 'home.expTerrace' | 'home.expPizza' | 'home.expRice' | 'home.expOptions'
  | 'home.galleryAlt' | 'home.review1' | 'home.review2' | 'home.review3' | 'home.scheduleEyebrow'
  | 'menu.eyebrow' | 'menu.title' | 'menu.subtitle' | 'menu.searchPlaceholder' | 'menu.clear' | 'menu.results'
  | 'menu.filtersLabel' | 'menu.categoriesLabel' | 'menu.all' | 'menu.noMatches' | 'menu.loadingError' | 'menu.detail'
  | 'menu.backToFilters' | 'menu.backToFiltersLabel'
  | 'detail.back' | 'detail.notice' | 'detail.loading' | 'detail.error'
  | 'contact.eyebrow' | 'contact.info' | 'contact.phone' | 'contact.schedule' | 'contact.address'
  | 'common.defaultHours' | 'common.defaultAddress';

const LANGUAGES: { code: LanguageCode; label: string; flag: string; htmlLang: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸', htmlLang: 'es' },
  { code: 'ca', label: 'Català', flag: '🇦🇩', htmlLang: 'ca' },
  { code: 'en', label: 'English', flag: '🇬🇧', htmlLang: 'en' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', htmlLang: 'fr' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪', htmlLang: 'de' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', htmlLang: 'it' },
  { code: 'pt', label: 'Português', flag: '🇵🇹', htmlLang: 'pt' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱', htmlLang: 'nl' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺', htmlLang: 'ru' },
];

const UI: Record<TranslationKey, Partial<Record<LanguageCode, string>>> = {
  'nav.home': { es: 'Inicio', ca: 'Inici', en: 'Home', fr: 'Accueil', de: 'Startseite', it: 'Home', pt: 'Início', nl: 'Start', ru: 'Главная' },
  'nav.menu': { es: 'Carta', ca: 'Carta', en: 'Menu', fr: 'Carte', de: 'Speisekarte', it: 'Menu', pt: 'Menu', nl: 'Menu', ru: 'Меню' },
  'nav.schedule': { es: 'Horario', ca: 'Horari', en: 'Hours', fr: 'Horaires', de: 'Öffnungszeiten', it: 'Orari', pt: 'Horário', nl: 'Openingstijden', ru: 'Часы работы' },
  'nav.contact': { es: 'Contacto', ca: 'Contacte', en: 'Contact', fr: 'Contact', de: 'Kontakt', it: 'Contatto', pt: 'Contacto', nl: 'Contact', ru: 'Контакты' },
  'nav.openMenu': { es: 'Abrir menú', ca: 'Obrir menú', en: 'Open menu', fr: 'Ouvrir le menu', de: 'Menü öffnen', it: 'Apri il menu', pt: 'Abrir menu', nl: 'Menu openen', ru: 'Открыть меню' },
  'home.claim': { es: 'Cocina mediterránea, italiana y de brasa frente al mar', ca: 'Cuina mediterrània, italiana i de brasa davant del mar', en: 'Mediterranean, Italian and grilled cuisine by the sea', fr: 'Cuisine méditerranéenne, italienne et grillades face à la mer', de: 'Mediterrane, italienische Küche und Grillgerichte am Meer', it: 'Cucina mediterranea, italiana e alla brace di fronte al mare', pt: 'Cozinha mediterrânica, italiana e grelhados junto ao mar', nl: 'Mediterrane, Italiaanse en gegrilde gerechten aan zee', ru: 'Средиземноморская и итальянская кухня, гриль у моря' },
  'home.viewMenu': { es: 'Ver carta', ca: 'Veure carta', en: 'View menu', fr: 'Voir la carte', de: 'Speisekarte ansehen', it: 'Vedi il menu', pt: 'Ver menu', nl: 'Menu bekijken', ru: 'Посмотреть меню' },
  'home.howToArrive': { es: 'Cómo llegar', ca: 'Com arribar', en: 'How to get here', fr: 'Comment arriver', de: 'Anfahrt', it: 'Come arrivare', pt: 'Como chegar', nl: 'Route', ru: 'Как добраться' },
  'home.aboutEyebrow': { es: 'Sobre nosotros', ca: 'Sobre nosaltres', en: 'About us', fr: 'À propos', de: 'Über uns', it: 'Chi siamo', pt: 'Sobre nós', nl: 'Over ons', ru: 'О нас' },
  'home.aboutTitle': { es: 'Mediterráneo, brasa y una mesa pensada para disfrutar sin prisa.', ca: 'Mediterrani, brasa i una taula pensada per gaudir sense pressa.', en: 'Mediterranean flavours, grill and a table made for slow enjoyment.', fr: 'Méditerranée, grillades et une table faite pour profiter sans se presser.', de: 'Mediterrane Küche, Grill und ein Tisch zum entspannten Genießen.', it: 'Mediterraneo, brace e una tavola pensata per godersi il momento senza fretta.', pt: 'Mediterrâneo, grelhados e uma mesa pensada para desfrutar sem pressa.', nl: 'Mediterraan, grill en een tafel om rustig van te genieten.', ru: 'Средиземноморские вкусы, гриль и стол для неспешного отдыха.' },
  'home.description': { es: 'Carta mediterránea con pizzas artesanales, arroces, pescados frescos y carnes a la brasa.', ca: 'Carta mediterrània amb pizzes artesanes, arrossos, peix fresc i carns a la brasa.', en: 'Mediterranean menu with artisan pizzas, rice dishes, fresh fish and grilled meats.', fr: 'Carte méditerranéenne avec pizzas artisanales, riz, poissons frais et viandes grillées.', de: 'Mediterrane Karte mit hausgemachten Pizzen, Reisgerichten, frischem Fisch und Grillfleisch.', it: 'Menu mediterraneo con pizze artigianali, risotti, pesce fresco e carni alla brace.', pt: 'Menu mediterrânico com pizzas artesanais, arrozes, peixe fresco e carnes grelhadas.', nl: 'Mediterrane kaart met ambachtelijke pizza’s, rijstgerechten, verse vis en gegrild vlees.', ru: 'Средиземноморское меню с авторской пиццей, рисом, свежей рыбой и мясом на гриле.' },
  'home.featuredEyebrow': { es: 'Destacados', ca: 'Destacats', en: 'Highlights', fr: 'Sélection', de: 'Empfehlungen', it: 'In evidenza', pt: 'Destaques', nl: 'Aanraders', ru: 'Рекомендуем' },
  'home.featuredTitle': { es: 'Platos que abren apetito', ca: 'Plats que obren la gana', en: 'Dishes to whet your appetite', fr: 'Des plats qui ouvrent l’appétit', de: 'Gerichte, die Appetit machen', it: 'Piatti che fanno venire appetito', pt: 'Pratos que abrem o apetite', nl: 'Gerechten die de eetlust wekken', ru: 'Блюда, которые пробуждают аппетит' },
  'home.menuEyebrow': { es: 'Carta', ca: 'Carta', en: 'Menu', fr: 'Carte', de: 'Speisekarte', it: 'Menu', pt: 'Menu', nl: 'Menu', ru: 'Меню' },
  'home.categoriesTitle': { es: 'Categorías', ca: 'Categories', en: 'Categories', fr: 'Catégories', de: 'Kategorien', it: 'Categorie', pt: 'Categorias', nl: 'Categorieën', ru: 'Категории' },
  'home.experienceTitle': { es: 'Terraza, pizzas artesanales, pescados, arroces y carnes a la brasa.', ca: 'Terrassa, pizzes artesanes, peixos, arrossos i carns a la brasa.', en: 'Terrace, artisan pizzas, fish, rice dishes and grilled meats.', fr: 'Terrasse, pizzas artisanales, poissons, riz et viandes grillées.', de: 'Terrasse, hausgemachte Pizzen, Fisch, Reisgerichte und Grillfleisch.', it: 'Terrazza, pizze artigianali, pesce, risotti e carni alla brace.', pt: 'Terraço, pizzas artesanais, peixe, arrozes e carnes grelhadas.', nl: 'Terras, ambachtelijke pizza’s, vis, rijstgerechten en gegrild vlees.', ru: 'Терраса, авторская пицца, рыба, рисовые блюда и мясо на гриле.' },
  'home.expTerrace': { es: 'Terraza cerca del mar', ca: 'Terrassa a prop del mar', en: 'Terrace near the sea', fr: 'Terrasse près de la mer', de: 'Terrasse nahe am Meer', it: 'Terrazza vicino al mare', pt: 'Terraço perto do mar', nl: 'Terras dicht bij zee', ru: 'Терраса у моря' },
  'home.expPizza': { es: 'Pizza y pinsa artesanal', ca: 'Pizza i pinsa artesana', en: 'Artisan pizza and pinsa', fr: 'Pizza et pinsa artisanales', de: 'Hausgemachte Pizza und Pinsa', it: 'Pizza e pinsa artigianali', pt: 'Pizza e pinsa artesanais', nl: 'Ambachtelijke pizza en pinsa', ru: 'Авторская пицца и пинса' },
  'home.expRice': { es: 'Arroces para compartir', ca: 'Arrossos per compartir', en: 'Rice dishes to share', fr: 'Riz à partager', de: 'Reisgerichte zum Teilen', it: 'Risotti e riso da condividere', pt: 'Arrozes para partilhar', nl: 'Rijstgerechten om te delen', ru: 'Рисовые блюда для компании' },
  'home.expOptions': { es: 'Opciones halal y vegetarianas', ca: 'Opcions halal i vegetarianes', en: 'Halal and vegetarian options', fr: 'Options halal et végétariennes', de: 'Halal- und vegetarische Optionen', it: 'Opzioni halal e vegetariane', pt: 'Opções halal e vegetarianas', nl: 'Halal en vegetarische opties', ru: 'Халяльные и вегетарианские варианты' },
  'home.galleryAlt': { es: 'Ambiente de restaurante', ca: 'Ambient de restaurant', en: 'Restaurant atmosphere', fr: 'Ambiance du restaurant', de: 'Restaurantambiente', it: 'Atmosfera del ristorante', pt: 'Ambiente do restaurante', nl: 'Restaurantsfeer', ru: 'Атмосфера ресторана' },
  'home.review1': { es: 'Carta variada, terraza preciosa y servicio atento.', ca: 'Carta variada, terrassa preciosa i servei atent.', en: 'Varied menu, lovely terrace and attentive service.', fr: 'Carte variée, belle terrasse et service attentionné.', de: 'Abwechslungsreiche Karte, schöne Terrasse und aufmerksamer Service.', it: 'Menu vario, terrazza bellissima e servizio attento.', pt: 'Menu variado, terraço bonito e serviço atencioso.', nl: 'Gevarieerde kaart, mooi terras en attente service.', ru: 'Разнообразное меню, красивая терраса и внимательный сервис.' },
  'home.review2': { es: 'La pizza de la casa y la paella fueron el plan perfecto.', ca: 'La pizza de la casa i la paella van ser el pla perfecte.', en: 'The house pizza and paella were the perfect choice.', fr: 'La pizza maison et la paella étaient le choix parfait.', de: 'Die Hauspizza und die Paella waren perfekt.', it: 'La pizza della casa e la paella sono state la scelta perfetta.', pt: 'A pizza da casa e a paelha foram a escolha perfeita.', nl: 'De huispizza en paella waren de perfecte keuze.', ru: 'Фирменная пицца и паэлья были отличным выбором.' },
  'home.review3': { es: 'Ideal para comer junto a Capellans después de la playa.', ca: 'Ideal per menjar a prop de Capellans després de la platja.', en: 'Ideal for eating near Capellans after the beach.', fr: 'Idéal pour manger près de Capellans après la plage.', de: 'Ideal zum Essen bei Capellans nach dem Strand.', it: 'Ideale per mangiare vicino a Capellans dopo la spiaggia.', pt: 'Ideal para comer perto de Capellans depois da praia.', nl: 'Ideaal om bij Capellans te eten na het strand.', ru: 'Идеально поесть рядом с Capellans после пляжа.' },
  'home.scheduleEyebrow': { es: 'Horario y ubicación', ca: 'Horari i ubicació', en: 'Hours and location', fr: 'Horaires et emplacement', de: 'Öffnungszeiten und Lage', it: 'Orari e posizione', pt: 'Horário e localização', nl: 'Openingstijden en locatie', ru: 'Часы работы и адрес' },
  'menu.eyebrow': { es: 'Carta digital QR', ca: 'Carta digital QR', en: 'Digital QR menu', fr: 'Carte QR numérique', de: 'Digitale QR-Speisekarte', it: 'Menu digitale QR', pt: 'Menu digital QR', nl: 'Digitale QR-menukaart', ru: 'Цифровое QR-меню' },
  'menu.title': { es: 'Nuestra carta', ca: 'La nostra carta', en: 'Our menu', fr: 'Notre carte', de: 'Unsere Speisekarte', it: 'Il nostro menu', pt: 'O nosso menu', nl: 'Ons menu', ru: 'Наше меню' },
  'menu.subtitle': { es: 'Busca por plato, ingrediente, categoría o alérgeno. Consulta con nuestro personal si tienes alergias o intolerancias alimentarias.', ca: 'Cerca per plat, ingredient, categoria o al·lergen. Consulta el nostre personal si tens al·lèrgies o intoleràncies.', en: 'Search by dish, ingredient, category or allergen. Ask our team if you have allergies or intolerances.', fr: 'Recherchez par plat, ingrédient, catégorie ou allergène. Consultez notre équipe en cas d’allergies ou d’intolérances.', de: 'Suche nach Gericht, Zutat, Kategorie oder Allergen. Frage unser Team bei Allergien oder Unverträglichkeiten.', it: 'Cerca per piatto, ingrediente, categoria o allergene. Chiedi al nostro team in caso di allergie o intolleranze.', pt: 'Procure por prato, ingrediente, categoria ou alergénio. Fale com a nossa equipa se tiver alergias ou intolerâncias.', nl: 'Zoek op gerecht, ingrediënt, categorie of allergeen. Vraag ons team bij allergieën of intoleranties.', ru: 'Ищите по блюду, ингредиенту, категории или аллергену. Сообщите персоналу об аллергиях или непереносимости.' },
  'menu.searchPlaceholder': { es: 'Buscar pollo, paella, gluten...', ca: 'Cerca pollastre, paella, gluten...', en: 'Search chicken, paella, gluten...', fr: 'Chercher poulet, paella, gluten...', de: 'Huhn, Paella, Gluten suchen...', it: 'Cerca pollo, paella, glutine...', pt: 'Procurar frango, paelha, glúten...', nl: 'Zoek kip, paella, gluten...', ru: 'Искать курицу, паэлью, глютен...' },
  'menu.clear': { es: 'Limpiar filtros', ca: 'Netejar filtres', en: 'Clear filters', fr: 'Effacer les filtres', de: 'Filter löschen', it: 'Cancella filtri', pt: 'Limpar filtros', nl: 'Filters wissen', ru: 'Сбросить фильтры' },
  'menu.results': { es: 'resultados', ca: 'resultats', en: 'results', fr: 'résultats', de: 'Ergebnisse', it: 'risultati', pt: 'resultados', nl: 'resultaten', ru: 'результатов' },
  'menu.filtersLabel': { es: 'Filtros de carta', ca: 'Filtres de carta', en: 'Menu filters', fr: 'Filtres de carte', de: 'Speisekartenfilter', it: 'Filtri del menu', pt: 'Filtros do menu', nl: 'Menufilters', ru: 'Фильтры меню' },
  'menu.categoriesLabel': { es: 'Categorías de carta', ca: 'Categories de carta', en: 'Menu categories', fr: 'Catégories de carte', de: 'Kategorien der Speisekarte', it: 'Categorie del menu', pt: 'Categorias do menu', nl: 'Menucategorieën', ru: 'Категории меню' },
  'menu.all': { es: 'Todo', ca: 'Tot', en: 'All', fr: 'Tout', de: 'Alle', it: 'Tutto', pt: 'Tudo', nl: 'Alles', ru: 'Все' },
  'menu.noMatches': { es: 'No hay platos que coincidan con esos filtros.', ca: 'No hi ha plats que coincideixin amb aquests filtres.', en: 'No dishes match those filters.', fr: 'Aucun plat ne correspond à ces filtres.', de: 'Keine Gerichte passen zu diesen Filtern.', it: 'Nessun piatto corrisponde a questi filtri.', pt: 'Não há pratos que correspondam a esses filtros.', nl: 'Geen gerechten gevonden met deze filters.', ru: 'Нет блюд, подходящих под эти фильтры.' },
  'menu.loadingError': { es: 'No se ha podido cargar la carta. Comprueba que el backend está arrancado.', ca: 'No s’ha pogut carregar la carta. Comprova que el backend estigui en marxa.', en: 'The menu could not be loaded. Check that the backend is running.', fr: 'Impossible de charger la carte. Vérifiez que le backend est démarré.', de: 'Die Speisekarte konnte nicht geladen werden. Prüfe, ob das Backend läuft.', it: 'Impossibile caricare il menu. Controlla che il backend sia avviato.', pt: 'Não foi possível carregar o menu. Verifique se o backend está a funcionar.', nl: 'Het menu kon niet worden geladen. Controleer of de backend draait.', ru: 'Не удалось загрузить меню. Проверьте, что backend запущен.' },
  'menu.detail': { es: 'Ver detalle', ca: 'Veure detall', en: 'View details', fr: 'Voir le détail', de: 'Details ansehen', it: 'Vedi dettagli', pt: 'Ver detalhes', nl: 'Details bekijken', ru: 'Подробнее' },
  'menu.backToFilters': { es: '↑ Filtros', ca: '↑ Filtres', en: '↑ Filters', fr: '↑ Filtres', de: '↑ Filter', it: '↑ Filtri', pt: '↑ Filtros', nl: '↑ Filters', ru: '↑ Фильтры' },
  'menu.backToFiltersLabel': { es: 'Volver a filtros', ca: 'Tornar als filtres', en: 'Back to filters', fr: 'Retour aux filtres', de: 'Zurück zu den Filtern', it: 'Torna ai filtri', pt: 'Voltar aos filtros', nl: 'Terug naar filters', ru: 'Вернуться к фильтрам' },
  'detail.back': { es: 'Volver a carta', ca: 'Tornar a la carta', en: 'Back to menu', fr: 'Retour à la carte', de: 'Zurück zur Speisekarte', it: 'Torna al menu', pt: 'Voltar ao menu', nl: 'Terug naar menu', ru: 'Назад к меню' },
  'detail.notice': { es: 'Consulta con nuestro personal si tienes alergias o intolerancias alimentarias.', ca: 'Consulta el nostre personal si tens al·lèrgies o intoleràncies alimentàries.', en: 'Ask our team if you have food allergies or intolerances.', fr: 'Consultez notre équipe si vous avez des allergies ou intolérances alimentaires.', de: 'Bitte frage unser Team bei Lebensmittelallergien oder Unverträglichkeiten.', it: 'Chiedi al nostro personale in caso di allergie o intolleranze alimentari.', pt: 'Consulte a nossa equipa se tiver alergias ou intolerâncias alimentares.', nl: 'Vraag ons team bij voedselallergieën of intoleranties.', ru: 'Сообщите персоналу о пищевых аллергиях или непереносимости.' },
  'detail.loading': { es: 'Cargando plato...', ca: 'Carregant plat...', en: 'Loading dish...', fr: 'Chargement du plat...', de: 'Gericht wird geladen...', it: 'Caricamento del piatto...', pt: 'A carregar o prato...', nl: 'Gerecht laden...', ru: 'Загрузка блюда...' },
  'detail.error': { es: 'No se ha podido cargar este plato.', ca: 'No s’ha pogut carregar aquest plat.', en: 'This dish could not be loaded.', fr: 'Impossible de charger ce plat.', de: 'Dieses Gericht konnte nicht geladen werden.', it: 'Non è stato possibile caricare questo piatto.', pt: 'Não foi possível carregar este prato.', nl: 'Dit gerecht kon niet worden geladen.', ru: 'Не удалось загрузить это блюдо.' },
  'contact.eyebrow': { es: 'Contacto', ca: 'Contacte', en: 'Contact', fr: 'Contact', de: 'Kontakt', it: 'Contatto', pt: 'Contacto', nl: 'Contact', ru: 'Контакты' },
  'contact.info': { es: 'Información', ca: 'Informació', en: 'Information', fr: 'Informations', de: 'Informationen', it: 'Informazioni', pt: 'Informação', nl: 'Informatie', ru: 'Информация' },
  'contact.phone': { es: 'Teléfono', ca: 'Telèfon', en: 'Phone', fr: 'Téléphone', de: 'Telefon', it: 'Telefono', pt: 'Telefone', nl: 'Telefoon', ru: 'Телефон' },
  'contact.schedule': { es: 'Horario', ca: 'Horari', en: 'Hours', fr: 'Horaires', de: 'Öffnungszeiten', it: 'Orari', pt: 'Horário', nl: 'Openingstijden', ru: 'Часы работы' },
  'contact.address': { es: 'Dirección', ca: 'Adreça', en: 'Address', fr: 'Adresse', de: 'Adresse', it: 'Indirizzo', pt: 'Morada', nl: 'Adres', ru: 'Адрес' },
  'common.defaultHours': { es: 'Lunes a domingo: 12:00 - 23:30', ca: 'Dilluns a diumenge: 12:00 - 23:30', en: 'Monday to Sunday: 12:00 - 23:30', fr: 'Du lundi au dimanche : 12:00 - 23:30', de: 'Montag bis Sonntag: 12:00 - 23:30', it: 'Da lunedì a domenica: 12:00 - 23:30', pt: 'Segunda a domingo: 12:00 - 23:30', nl: 'Maandag t/m zondag: 12:00 - 23:30', ru: 'Понедельник - воскресенье: 12:00 - 23:30' },
  'common.defaultAddress': { es: 'Zona Capellans, Salou', ca: 'Zona Capellans, Salou', en: 'Capellans area, Salou', fr: 'Zone Capellans, Salou', de: 'Bereich Capellans, Salou', it: 'Zona Capellans, Salou', pt: 'Zona Capellans, Salou', nl: 'Zone Capellans, Salou', ru: 'Район Capellans, Салоу' },
};

const CATEGORY: Record<string, Partial<Record<LanguageCode, string>>> = {
  'Entrantes': { ca: 'Entrants', en: 'Starters', fr: 'Entrées', de: 'Vorspeisen', nl: 'Voorgerechten', ru: 'Закуски' },
  'Antipasti': { ca: 'Antipasti', en: 'Antipasti', fr: 'Antipasti', de: 'Antipasti', nl: 'Antipasti', ru: 'Антипасти' },
  'Ensaladas': { ca: 'Amanides', en: 'Salads', fr: 'Salades', de: 'Salate', nl: 'Salades', ru: 'Салаты' },
  'Carnes a la brasa': { ca: 'Carns a la brasa', en: 'Grilled meats', fr: 'Viandes grillées', de: 'Grillfleisch', nl: 'Gegrild vlees', ru: 'Мясо на гриле' },
  'Hamburguesas': { ca: 'Hamburgueses', en: 'Burgers', fr: 'Burgers', de: 'Burger', nl: 'Burgers', ru: 'Бургеры' },
  'Pescado': { ca: 'Peix', en: 'Fish', fr: 'Poisson', de: 'Fisch', nl: 'Vis', ru: 'Рыба' },
  'Arroces y risottos': { ca: 'Arrossos i risottos', en: 'Rice dishes and risottos', fr: 'Riz et risottos', de: 'Reisgerichte und Risottos', nl: 'Rijstgerechten en risotto’s', ru: 'Рисовые блюда и ризотто' },
  'Menu de ninos': { ca: 'Menú infantil', en: 'Kids menu', fr: 'Menu enfants', de: 'Kindermenü', nl: 'Kindermenu', ru: 'Детское меню' },
  'Pizzas artesanales': { ca: 'Pizzes artesanes', en: 'Artisan pizzas', fr: 'Pizzas artisanales', de: 'Hausgemachte Pizzen', nl: 'Ambachtelijke pizza’s', ru: 'Авторская пицца' },
  'Calzones y pinsas artesanales': { ca: 'Calzones i pinses artesanes', en: 'Artisan calzones and pinsas', fr: 'Calzones et pinsas artisanales', de: 'Hausgemachte Calzonen und Pinsas', nl: 'Ambachtelijke calzones en pinsa’s', ru: 'Кальцоне и пинса' },
  'Pasta': { ca: 'Pasta', en: 'Pasta', fr: 'Pâtes', de: 'Pasta', nl: 'Pasta', ru: 'Паста' },
};

const CATEGORY_DESCRIPTION: Record<string, Partial<Record<LanguageCode, string>>> = {
  'Para compartir al centro de la mesa.': { ca: 'Per compartir al centre de la taula.', en: 'To share at the centre of the table.', fr: 'À partager au centre de la table.', de: 'Zum Teilen in der Tischmitte.', nl: 'Om samen te delen.', ru: 'Для компании, чтобы делиться.' },
  'Bocados italianos con producto cuidado.': { ca: 'Bocats italians amb producte cuidat.', en: 'Italian bites with carefully chosen ingredients.', fr: 'Bouchées italiennes avec des produits soignés.', de: 'Italienische Häppchen mit sorgfältig ausgewählten Zutaten.', nl: 'Italiaanse hapjes met zorgvuldig gekozen producten.', ru: 'Итальянские закуски из качественных продуктов.' },
  'Frescas, completas y mediterraneas.': { ca: 'Fresques, completes i mediterrànies.', en: 'Fresh, complete and Mediterranean.', fr: 'Fraîches, complètes et méditerranéennes.', de: 'Frisch, vollwertig und mediterran.', nl: 'Vers, compleet en mediterraan.', ru: 'Свежие, сытные и средиземноморские.' },
  'Cortes de carne y parrilla.': { ca: 'Talls de carn i graella.', en: 'Cuts of meat and grill.', fr: 'Pièces de viande et grillades.', de: 'Fleischstücke vom Grill.', nl: 'Vlees van de grill.', ru: 'Мясные блюда и гриль.' },
  'Burgers con patatas y salsas.': { ca: 'Hamburgueses amb patates i salses.', en: 'Burgers with fries and sauces.', fr: 'Burgers avec frites et sauces.', de: 'Burger mit Pommes und Saucen.', nl: 'Burgers met friet en sauzen.', ru: 'Бургеры с картофелем и соусами.' },
  'Pescados y mariscos a la plancha.': { ca: 'Peixos i mariscs a la planxa.', en: 'Grilled fish and seafood.', fr: 'Poissons et fruits de mer à la plancha.', de: 'Fisch und Meeresfrüchte vom Grill.', nl: 'Gegrilde vis en zeevruchten.', ru: 'Рыба и морепродукты на гриле.' },
  'Arroces para compartir y risottos cremosos.': { ca: 'Arrossos per compartir i risottos cremosos.', en: 'Rice dishes to share and creamy risottos.', fr: 'Riz à partager et risottos crémeux.', de: 'Reisgerichte zum Teilen und cremige Risottos.', nl: 'Rijstgerechten om te delen en romige risotto’s.', ru: 'Рисовые блюда для компании и кремовые ризотто.' },
  'Para menores de 12 anos. Bebida incluida.': { ca: 'Per a menors de 12 anys. Beguda inclosa.', en: 'For children under 12. Drink included.', fr: 'Pour les moins de 12 ans. Boisson incluse.', de: 'Für Kinder unter 12 Jahren. Getränk inklusive.', nl: 'Voor kinderen onder 12 jaar. Drankje inbegrepen.', ru: 'Для детей до 12 лет. Напиток включен.' },
  'Masa artesanal y horno caliente.': { ca: 'Massa artesana i forn calent.', en: 'Artisan dough and hot oven.', fr: 'Pâte artisanale et four chaud.', de: 'Hausgemachter Teig und heißer Ofen.', nl: 'Ambachtelijk deeg en hete oven.', ru: 'Авторское тесто и горячая печь.' },
  'Especialidades artesanas al estilo italiano.': { ca: 'Especialitats artesanes a l’estil italià.', en: 'Artisan specialities in Italian style.', fr: 'Spécialités artisanales à l’italienne.', de: 'Hausgemachte Spezialitäten nach italienischer Art.', nl: 'Ambachtelijke specialiteiten in Italiaanse stijl.', ru: 'Авторские блюда в итальянском стиле.' },
  'Base editable de pastas clasicas.': { ca: 'Base editable de pastes clàssiques.', en: 'Classic pasta dishes.', fr: 'Pâtes classiques.', de: 'Klassische Pastagerichte.', nl: 'Klassieke pastagerechten.', ru: 'Классическая паста.' },
};

const TAGS: Record<string, Partial<Record<LanguageCode, string>>> = {
  GLUTEN: { ca: 'Gluten', en: 'Gluten', fr: 'Gluten', de: 'Gluten', nl: 'Gluten', ru: 'Глютен' },
  HUEVO: { ca: 'Ou', en: 'Egg', fr: 'Œuf', de: 'Ei', nl: 'Ei', ru: 'Яйцо' },
  LACTEOS: { ca: 'Lactis', en: 'Dairy', fr: 'Produits laitiers', de: 'Milchprodukte', nl: 'Zuivel', ru: 'Молочные продукты' },
  PESCADO: { ca: 'Peix', en: 'Fish', fr: 'Poisson', de: 'Fisch', nl: 'Vis', ru: 'Рыба' },
  MARISCO: { ca: 'Marisc / crustacis', en: 'Shellfish / crustaceans', fr: 'Crustacés', de: 'Krustentiere', nl: 'Schaaldieren', ru: 'Ракообразные' },
  MOLUSCOS: { ca: 'Mol·luscs', en: 'Molluscs', fr: 'Mollusques', de: 'Weichtiere', nl: 'Weekdieren', ru: 'Моллюски' },
  FRUTOS_SECOS: { ca: 'Fruits secs', en: 'Tree nuts', fr: 'Fruits à coque', de: 'Schalenfrüchte', nl: 'Noten', ru: 'Орехи' },
  CARNE: { ca: 'Carn', en: 'Meat', fr: 'Viande', de: 'Fleisch', nl: 'Vlees', ru: 'Мясо' },
  POLLO: { ca: 'Pollastre', en: 'Chicken', fr: 'Poulet', de: 'Hähnchen', nl: 'Kip', ru: 'Курица' },
  CERDO: { ca: 'Porc', en: 'Pork', fr: 'Porc', de: 'Schwein', nl: 'Varken', ru: 'Свинина' },
  HALAL: { ca: 'Halal', en: 'Halal', fr: 'Halal', de: 'Halal', nl: 'Halal', ru: 'Халяль' },
  VEGETARIANO: { ca: 'Vegetarià', en: 'Vegetarian', fr: 'Végétarien', de: 'Vegetarisch', nl: 'Vegetarisch', ru: 'Вегетарианское' },
  CACAHUETES: { ca: 'Cacauets', en: 'Peanuts', fr: 'Arachides', de: 'Erdnüsse', nl: 'Pinda’s', ru: 'Арахис' },
  SOJA: { ca: 'Soja', en: 'Soy', fr: 'Soja', de: 'Soja', nl: 'Soja', ru: 'Соя' },
  APIO: { ca: 'Api', en: 'Celery', fr: 'Céleri', de: 'Sellerie', nl: 'Selderij', ru: 'Сельдерей' },
  MOSTAZA: { ca: 'Mostassa', en: 'Mustard', fr: 'Moutarde', de: 'Senf', nl: 'Mosterd', ru: 'Горчица' },
  SESAMO: { ca: 'Sèsam', en: 'Sesame', fr: 'Sésame', de: 'Sesam', nl: 'Sesam', ru: 'Кунжут' },
  SULFITOS: { ca: 'Sulfits', en: 'Sulphites', fr: 'Sulfites', de: 'Sulfite', nl: 'Sulfieten', ru: 'Сульфиты' },
  ALTRAMUCES: { ca: 'Tramussos', en: 'Lupin', fr: 'Lupin', de: 'Lupinen', nl: 'Lupine', ru: 'Люпин' },
};

const DISH_NAMES: Record<string, Partial<Record<LanguageCode, string>>> = {
  'tiras-de-pollo': { ca: 'Tires de pollastre', en: 'Chicken strips', fr: 'Lanières de poulet', de: 'Hähnchenstreifen', nl: 'Kipreepjes' },
  'croquetas-de-pollo-o-jamon-6-uds': { ca: 'Croquetes de pollastre o pernil, 6 uts.', en: 'Chicken or ham croquettes, 6 pcs.', fr: 'Croquettes poulet ou jambon, 6 pcs.', de: 'Hähnchen- oder Schinkenkroketten, 6 Stk.', nl: 'Kip- of hamkroketten, 6 st.' },
  'patatas-bravas': { ca: 'Patates braves', en: 'Patatas bravas', fr: 'Patatas bravas', de: 'Patatas bravas', nl: 'Patatas bravas' },
  'patatas-fritas': { ca: 'Patates fregides', en: 'French fries', fr: 'Frites', de: 'Pommes frites', nl: 'Friet' },
  'nachos-con-queso-carne-guacamole': { ca: 'Nachos amb formatge / carn / guacamole', en: 'Nachos with cheese / meat / guacamole', fr: 'Nachos fromage / viande / guacamole', de: 'Nachos mit Käse / Fleisch / Guacamole', nl: 'Nachos met kaas / vlees / guacamole' },
  'calamar-a-la-andaluza': { ca: 'Calamar a l’andalusa', en: 'Andalusian-style calamari', fr: 'Calamar à l’andalouse', de: 'Calamari nach andalusischer Art', nl: 'Calamares op Andalusische wijze' },
  'chipirones-fritos': { ca: 'Xipirons fregits', en: 'Fried baby squid', fr: 'Petits calamars frits', de: 'Frittierte kleine Tintenfische', nl: 'Gefrituurde kleine inktvis' },
  'mejillones-a-la-marinera': { ca: 'Musclos a la marinera', en: 'Mussels marinara', fr: 'Moules à la marinera', de: 'Miesmuscheln nach Marinera-Art', nl: 'Mosselen marinera' },
  'tabla-de-jamon-iberico': { ca: 'Taula de pernil ibèric', en: 'Iberian ham board', fr: 'Assiette de jambon ibérique', de: 'Iberische Schinkenplatte', nl: 'Iberische hamplank' },
  'pan-de-ajo': { ca: 'Pa d’all', en: 'Garlic bread', fr: 'Pain à l’ail', de: 'Knoblauchbrot', nl: 'Knoflookbrood' },
  'pan': { ca: 'Pa', en: 'Bread', fr: 'Pain', de: 'Brot', nl: 'Brood' },
  'pan-de-la-casa-6-uds': { ca: 'Pa de la casa, 6 uts.', en: 'House bread, 6 pcs.', fr: 'Pain maison, 6 pcs.', de: 'Hausbrot, 6 Stk.', nl: 'Huisbrood, 6 st.' },
  'carpaccio-de-ternera': { ca: 'Carpaccio de vedella', en: 'Beef carpaccio', fr: 'Carpaccio de boeuf', de: 'Rindercarpaccio', nl: 'Rundercarpaccio' },
  'carpaccio-de-bacalao': { ca: 'Carpaccio de bacallà', en: 'Cod carpaccio', fr: 'Carpaccio de morue', de: 'Kabeljau-Carpaccio', nl: 'Kabeljauwcarpaccio' },
  'carpaccio-de-berenjenas': { ca: 'Carpaccio d’albergínies', en: 'Aubergine carpaccio', fr: 'Carpaccio d’aubergines', de: 'Auberginen-Carpaccio', nl: 'Auberginecarpaccio' },
  'burrata-girasol': { ca: 'Burrata Girasol', en: 'Burrata Girasol', fr: 'Burrata Girasol', de: 'Burrata Girasol', nl: 'Burrata Girasol' },
  'ensalada-cesar': { ca: 'Amanida Cèsar', en: 'Caesar salad', fr: 'Salade César', de: 'Caesar Salad', nl: 'Caesarsalade' },
  'ensalada-rulo-de-cabra': { ca: 'Amanida de formatge de cabra', en: 'Goat cheese salad', fr: 'Salade au fromage de chèvre', de: 'Ziegenkäsesalat', nl: 'Geitenkaassalade' },
  'ensalada-girasol': { ca: 'Amanida Girasol', en: 'Girasol salad', fr: 'Salade Girasol', de: 'Girasol-Salat', nl: 'Girasol salade' },
  'lomo-al-pepo': { ca: 'Llom al Pepo', en: 'Pork loin with Pepo sauce', fr: 'Filet de porc sauce Pepo', de: 'Schweinelende mit Pepo-Sauce', nl: 'Varkenslende met Pepo-saus' },
  'entrecot-de-ternera': { ca: 'Entrecot de vedella', en: 'Beef entrecote', fr: 'Entrecôte de boeuf', de: 'Rinderentrecôte', nl: 'Runderentrecote' },
  'solomillo-de-ternera': { ca: 'Filet de vedella', en: 'Sirloin steak', fr: 'Filet de boeuf', de: 'Rinderfilet', nl: 'Ossenhaas' },
  'costillas-de-cerdo': { ca: 'Costelles de porc', en: 'Pork ribs', fr: 'Travers de porc', de: 'Schweinerippchen', nl: 'Varkensribben' },
  'costillas-de-cordero': { ca: 'Costelles de xai', en: 'Rack of lamb', fr: 'Côtes d’agneau', de: 'Lammkoteletts', nl: 'Lamskoteletten' },
  'medio-pollo-al-horno': { ca: '1/2 pollastre al forn', en: '1/2 roast chicken', fr: '1/2 poulet rôti', de: '1/2 Ofenhähnchen', nl: '1/2 gebraden kip' },
  'lasana-de-carne-con-verduras': { ca: 'Lasanya de carn amb verdures', en: 'Meat and vegetable lasagna', fr: 'Lasagne viande et légumes', de: 'Lasagne mit Fleisch und Gemüse', nl: 'Lasagne met vlees en groenten' },
  'hamburguesa-black-angus': { ca: 'Hamburguesa Black Angus', en: 'Black Angus burger', fr: 'Burger Black Angus', de: 'Black-Angus-Burger', nl: 'Black Angus burger' },
  'hamburguesa-de-pollo-crispy': { ca: 'Hamburguesa de pollastre cruixent', en: 'Crispy chicken burger', fr: 'Burger poulet croustillant', de: 'Crispy Chicken Burger', nl: 'Crispy chicken burger' },
  'hamburguesa-pulled-pork': { ca: 'Hamburguesa pulled pork', en: 'Pulled pork burger', fr: 'Burger pulled pork', de: 'Pulled-Pork-Burger', nl: 'Pulled pork burger' },
  'salmon-a-la-plancha': { ca: 'Salmó a la planxa', en: 'Grilled salmon', fr: 'Saumon grillé', de: 'Gegrillter Lachs', nl: 'Gegrilde zalm' },
  'sepia-a-la-plancha': { ca: 'Sèpia a la planxa', en: 'Grilled cuttlefish', fr: 'Seiche grillée', de: 'Gegrillte Sepia', nl: 'Gegrilde zeekat' },
  'dorada-a-la-plancha': { ca: 'Orada a la planxa', en: 'Grilled sea bream', fr: 'Dorade grillée', de: 'Gegrillte Dorade', nl: 'Gegrilde dorade' },
  'pulpo-a-la-gallega': { ca: 'Pop a la gallega', en: 'Galician-style octopus', fr: 'Poulpe à la galicienne', de: 'Oktopus galicischer Art', nl: 'Octopus op Galicische wijze' },
  'pulpo-a-la-brasa-con-guarnicion': { ca: 'Pop a la brasa amb guarnició', en: 'Grilled octopus with garnish', fr: 'Poulpe grillé avec garniture', de: 'Gegrillter Oktopus mit Beilage', nl: 'Gegrilde octopus met garnituur' },
  'gambas-a-la-plancha-6-uds': { ca: 'Gambes a la planxa, 6 uts.', en: 'Grilled prawns, 6 pcs.', fr: 'Gambas grillées, 6 pcs.', de: 'Gegrillte Garnelen, 6 Stk.', nl: 'Gegrilde garnalen, 6 st.' },
  'paella-marinera-arroz-negro-2-personas': { ca: 'Paella marinera / arròs negre, 2 persones', en: 'Seafood paella / black rice, 2 people', fr: 'Paella fruits de mer / riz noir, 2 personnes', de: 'Meeresfrüchte-Paella / schwarzer Reis, 2 Personen', nl: 'Zeevruchtenpaella / zwarte rijst, 2 personen' },
  'paella-marinera-arroz-negro-3-personas': { ca: 'Paella marinera / arròs negre, 3 persones', en: 'Seafood paella / black rice, 3 people', fr: 'Paella fruits de mer / riz noir, 3 personnes', de: 'Meeresfrüchte-Paella / schwarzer Reis, 3 Personen', nl: 'Zeevruchtenpaella / zwarte rijst, 3 personen' },
  'paella-marinera-arroz-negro-4-personas': { ca: 'Paella marinera / arròs negre, 4 persones', en: 'Seafood paella / black rice, 4 people', fr: 'Paella fruits de mer / riz noir, 4 personnes', de: 'Meeresfrüchte-Paella / schwarzer Reis, 4 Personen', nl: 'Zeevruchtenpaella / zwarte rijst, 4 personen' },
  'risotto-carbonara': { ca: 'Risotto carbonara', en: 'Carbonara risotto', fr: 'Risotto carbonara', de: 'Risotto Carbonara', nl: 'Risotto carbonara' },
  'risotto-di-funghi-porcini': { ca: 'Risotto de funghi porcini', en: 'Porcini mushroom risotto', fr: 'Risotto aux cèpes', de: 'Steinpilzrisotto', nl: 'Risotto met eekhoorntjesbrood' },
  'risotto-al-tartufo': { ca: 'Risotto amb tòfona', en: 'Truffle risotto', fr: 'Risotto à la truffe', de: 'Trüffelrisotto', nl: 'Truffelrisotto' },
  'nuggets-de-pollo-con-patatas': { ca: 'Nuggets de pollastre amb patates', en: 'Chicken nuggets with fries', fr: 'Nuggets de poulet avec frites', de: 'Chicken Nuggets mit Pommes', nl: 'Kipnuggets met friet' },
  'macarrones-bolonesa': { ca: 'Macarrons bolonyesa', en: 'Macaroni bolognese', fr: 'Macaronis bolognaise', de: 'Makkaroni Bolognese', nl: 'Macaroni bolognese' },
  'mini-pizza-con-mozzarella-y-jamon': { ca: 'Mini pizza amb mozzarella i pernil', en: 'Mini pizza with mozzarella and ham', fr: 'Mini pizza mozzarella et jambon', de: 'Mini-Pizza mit Mozzarella und Schinken', nl: 'Mini pizza met mozzarella en ham' },
  'margarita': { ca: 'Margarita', en: 'Margherita', fr: 'Margherita', de: 'Margherita', nl: 'Margherita' },
  'garda': { ca: 'Garda', en: 'Garda', fr: 'Garda', de: 'Garda', nl: 'Garda' },
  'prosciutto': { ca: 'Prosciutto', en: 'Prosciutto', fr: 'Prosciutto', de: 'Prosciutto', nl: 'Prosciutto' },
  'pizza-girasol': { ca: 'Pizza Girasol', en: 'Girasol pizza', fr: 'Pizza Girasol', de: 'Pizza Girasol', nl: 'Pizza Girasol' },
  'cuatro-stagioni': { ca: 'Quatre Stagioni', en: 'Quattro Stagioni', fr: 'Quatre saisons', de: 'Quattro Stagioni', nl: 'Quattro Stagioni' },
  'cuatro-quesos': { ca: 'Quatre formatges', en: 'Four cheese pizza', fr: 'Pizza quatre fromages', de: 'Vier-Käse-Pizza', nl: 'Vier kazen pizza' },
  'pizza-di-mare': { ca: 'Pizza del mar', en: 'Seafood pizza', fr: 'Pizza aux fruits de mer', de: 'Meeresfrüchtepizza', nl: 'Zeevruchtenpizza' },
  'pizza-iberica': { ca: 'Pizza ibèrica', en: 'Iberian pizza', fr: 'Pizza ibérique', de: 'Iberische Pizza', nl: 'Iberische pizza' },
  'pepperoni': { ca: 'Pepperoni', en: 'Pepperoni', fr: 'Pepperoni', de: 'Pepperoni', nl: 'Pepperoni' },
  'pizza-barbacoa': { ca: 'Pizza barbacoa', en: 'BBQ pizza', fr: 'Pizza barbecue', de: 'BBQ-Pizza', nl: 'BBQ-pizza' },
  'la-favonia': { ca: 'La Favonia', en: 'La Favonia', fr: 'La Favonia', de: 'La Favonia', nl: 'La Favonia' },
  'la-fantastica': { ca: 'La Fantàstica', en: 'La Fantastica', fr: 'La Fantastica', de: 'La Fantastica', nl: 'La Fantastica' },
  'tono': { ca: 'Tonyina', en: 'Tuna pizza', fr: 'Pizza au thon', de: 'Thunfischpizza', nl: 'Tonijnpizza' },
  'calzone-tradicional': { ca: 'Calzone tradicional', en: 'Traditional calzone', fr: 'Calzone traditionnel', de: 'Traditionelle Calzone', nl: 'Traditionele calzone' },
  'calzone-francesa': { ca: 'Calzone francesa', en: 'French calzone', fr: 'Calzone française', de: 'Französische Calzone', nl: 'Franse calzone' },
  'pinsa-calabria': { ca: 'Pinsa Calàbria', en: 'Calabria pinsa', fr: 'Pinsa Calabria', de: 'Pinsa Calabria', nl: 'Pinsa Calabria' },
  'pinsa-toscana': { ca: 'Pinsa Toscana', en: 'Tuscany pinsa', fr: 'Pinsa Toscane', de: 'Pinsa Toscana', nl: 'Pinsa Toscana' },
  'pasta-bolonesa': { ca: 'Pasta bolonyesa', en: 'Pasta bolognese', fr: 'Pâtes bolognaise', de: 'Pasta Bolognese', nl: 'Pasta bolognese' },
  'pasta-carbonara': { ca: 'Pasta carbonara', en: 'Pasta carbonara', fr: 'Pâtes carbonara', de: 'Pasta Carbonara', nl: 'Pasta carbonara' },
  'pasta-al-pesto': { ca: 'Pasta al pesto', en: 'Pasta with pesto', fr: 'Pâtes au pesto', de: 'Pasta mit Pesto', nl: 'Pasta pesto' },
  'pasta-crema-de-boletus-y-setas': { ca: 'Pasta amb crema de ceps i bolets', en: 'Pasta with porcini and mushroom cream', fr: 'Pâtes crème de cèpes et champignons', de: 'Pasta mit Steinpilz- und Pilzcreme', nl: 'Pasta met eekhoorntjesbrood en paddenstoelenroom' },
  'pasta-esparragos-y-gambas': { ca: 'Pasta amb espàrrecs i gambes', en: 'Pasta with asparagus and prawns', fr: 'Pâtes aux asperges et gambas', de: 'Pasta mit Spargel und Garnelen', nl: 'Pasta met asperges en garnalen' },
  'pasta-arrabiata': { ca: 'Pasta arrabbiata', en: 'Pasta arrabbiata', fr: 'Pâtes arrabbiata', de: 'Pasta Arrabbiata', nl: 'Pasta arrabbiata' },
  'pasta-cuatro-quesos': { ca: 'Pasta quatre formatges', en: 'Four cheese pasta', fr: 'Pâtes quatre fromages', de: 'Vier-Käse-Pasta', nl: 'Vier kazen pasta' },
  'pasta-marinera': { ca: 'Pasta marinera', en: 'Seafood pasta', fr: 'Pâtes aux fruits de mer', de: 'Meeresfrüchtepasta', nl: 'Zeevruchtenpasta' },
};

const DISH_DESCRIPTIONS: Record<string, Partial<Record<LanguageCode, string>>> = {
  'Chicken strips': { es: 'Tiras de pollo', ca: 'Tires de pollastre', en: 'Chicken strips', fr: 'Lanières de poulet', de: 'Hähnchenstreifen', nl: 'Kipreepjes', ru: 'Куриные полоски' },
  'Croquetas de pollo o jamon': { ca: 'Croquetes de pollastre o pernil', en: 'Chicken or ham croquettes', fr: 'Croquettes au poulet ou au jambon', de: 'Kroketten mit Hähnchen oder Schinken', nl: 'Kip- of hamkroketten', ru: 'Крокеты с курицей или хамоном' },
  'Patatas gajo fritas con salsa brava': { ca: 'Patates fregides amb salsa brava', en: 'Fried potato wedges with brava sauce', fr: 'Pommes de terre frites avec sauce brava', de: 'Frittierte Kartoffelecken mit Brava-Sauce', nl: 'Gefrituurde aardappelpartjes met brava-saus', ru: 'Жареный картофель с соусом брава' },
  'French fries': { es: 'Patatas fritas', ca: 'Patates fregides', en: 'French fries', fr: 'Frites', de: 'Pommes frites', nl: 'Friet', ru: 'Картофель фри' },
  'Nachos con queso, carne o guacamole': { ca: 'Nachos amb formatge, carn o guacamole', en: 'Nachos with cheese, meat or guacamole', fr: 'Nachos avec fromage, viande ou guacamole', de: 'Nachos mit Käse, Fleisch oder Guacamole', nl: 'Nachos met kaas, vlees of guacamole', ru: 'Начос с сыром, мясом или гуакамоле' },
  'Garlic bread': { es: 'Pan de ajo', ca: 'Pa d’all', en: 'Garlic bread', fr: 'Pain à l’ail', de: 'Knoblauchbrot', nl: 'Knoflookbrood', ru: 'Чесночный хлеб' },
  'Bread': { es: 'Pan', ca: 'Pa', en: 'Bread', fr: 'Pain', de: 'Brot', nl: 'Brood', ru: 'Хлеб' },
  'Tomate y mozzarella': { ca: 'Tomàquet i mozzarella', en: 'Tomato and mozzarella', fr: 'Tomate et mozzarella', de: 'Tomate und Mozzarella', nl: 'Tomaat en mozzarella', ru: 'Томат и моцарелла' },
  'Pasta con salsa de tomate y carne picada': { ca: 'Pasta amb salsa de tomàquet i carn picada', en: 'Pasta with tomato sauce and minced meat', fr: 'Pâtes à la sauce tomate et viande hachée', de: 'Pasta mit Tomatensauce und Hackfleisch', nl: 'Pasta met tomatensaus en gehakt', ru: 'Паста с томатным соусом и фаршем' },
  'Pasta con nata, bacon y huevo': { ca: 'Pasta amb nata, bacó i ou', en: 'Pasta with cream, bacon and egg', fr: 'Pâtes à la crème, bacon et œuf', de: 'Pasta mit Sahne, Bacon und Ei', nl: 'Pasta met room, bacon en ei', ru: 'Паста со сливками, беконом и яйцом' },
  'Pasta con albahaca, parmesano, ajo y frutos secos': { ca: 'Pasta amb alfàbrega, parmesà, all i fruits secs', en: 'Pasta with basil, parmesan, garlic and nuts', fr: 'Pâtes au basilic, parmesan, ail et fruits à coque', de: 'Pasta mit Basilikum, Parmesan, Knoblauch und Nüssen', nl: 'Pasta met basilicum, parmezaan, knoflook en noten', ru: 'Паста с базиликом, пармезаном, чесноком и орехами' },
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly languages = LANGUAGES;
  readonly language = signal<LanguageCode>(this.detectLanguage());

  constructor() {
    this.applyDocumentLanguage(this.language());
  }

  setLanguage(code: LanguageCode): void {
    this.language.set(code);
    localStorage.setItem('siteLanguage', code);
    this.applyDocumentLanguage(code);
  }

  t(key: TranslationKey): string {
    const lang = this.language();
    return UI[key]?.[lang] || UI[key]?.es || key;
  }

  category(category: Category): string {
    return category.name;
  }

  categoryDescription(description?: string): string {
    if (!description) return '';
    return description;
  }

  tag(tag: AllergenTag | { code: string; name: string }): string {
    return tag.name;
  }

  dishName(item: MenuItem): string {
    return item.name;
  }

  dishDescription(item: MenuItem): string {
    return item.description;
  }

  openingHours(openingHours?: string | null): string {
    const normalized = (openingHours || '').trim().toLowerCase();
    if (!normalized || normalized === 'lunes a domingo: 12:00 - 23:30') return this.t('common.defaultHours');
    return openingHours || this.t('common.defaultHours');
  }

  private detectLanguage(): LanguageCode {
    const saved = localStorage.getItem('siteLanguage') as LanguageCode | null;
    if (saved && LANGUAGES.some((language) => language.code === saved)) return saved;

    const browserLanguages = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
    for (const value of browserLanguages) {
      const lower = value.toLowerCase();
      if (lower.startsWith('ca')) return 'ca';
      if (lower.startsWith('es')) return 'es';
      if (lower.startsWith('fr')) return 'fr';
      if (lower.startsWith('de')) return 'de';
      if (lower.startsWith('it')) return 'it';
      if (lower.startsWith('pt')) return 'pt';
      if (lower.startsWith('nl')) return 'nl';
      if (lower.startsWith('ru')) return 'ru';
      if (lower.startsWith('en')) return 'en';
    }
    return 'es';
  }

  private applyDocumentLanguage(code: LanguageCode): void {
    document.documentElement.lang = LANGUAGES.find((language) => language.code === code)?.htmlLang || code;
  }
}
